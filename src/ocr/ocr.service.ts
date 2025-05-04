// ocr.service.ts
import { Injectable, HttpException, HttpStatus } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { ScanResult, ScanResultDocument } from '../scan-result/scan-result.schema';
import axios from 'axios';
import * as FormData from 'form-data';
import * as fs from 'fs';
import { ScanResultResponse, ScanHistoryResponse, ScanHistoryItem } from './types';

@Injectable()
export class OcrService {
  private readonly OCR_API_URL = 'http://localhost:8001/analyze';

  constructor(
    @InjectModel(ScanResult.name)
    private readonly scanResultModel: Model<ScanResultDocument>,
  ) {}

  async extractText(imagePath: string, userId: string): Promise<ScanResultResponse> {
    try {
      const formData = new FormData();
      formData.append('file', fs.createReadStream(imagePath));
  
      const response = await axios.post(this.OCR_API_URL, formData, {
        headers: formData.getHeaders(),
        maxBodyLength: 10 * 1024 * 1024,
      });
  
      const scanResult = await this.scanResultModel.create({
        extractedText: response.data.extracted_text,
        detectedComposition: response.data.detected_composition || {},
        isExact: response.data.is_exact || false,
        processingTimeMs: response.data.processing_time_ms || 0,
        imagePath: imagePath,
        userId: userId
      });

      const result = scanResult.toObject();
      
      const warnings = [];
      if (response.data.extracted_text === "No text could be extracted from the image") {
        warnings.push("No text detected - try a clearer image");
      }

      return {
        success: true,
        data: {
          ...response.data,
          scanId: result._id.toString(),
          createdAt: result.createdAt,
          imagePath: result.imagePath,
        },
        warnings
      };
    } catch (error) {
      throw new HttpException(
        error.response?.data?.detail || `OCR processing failed: ${error.message}`,
        error.response?.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  async getScanHistory(userId: string): Promise<ScanHistoryResponse> {
    try {
      const results = await this.scanResultModel.find({ userId })
        .sort({ createdAt: -1 })
        .lean<ScanResultDocument[]>()
        .exec();
      
      const historyItems: ScanHistoryItem[] = results.map(result => ({
        _id: result._id.toString(),
        extractedText: result.extractedText || "No text extracted",
        detectedComposition: result.detectedComposition || {},
        isExact: result.isExact || false,
        processingTimeMs: result.processingTimeMs || 0,
        imagePath: result.imagePath,
        userId: result.userId, // Add this line
        createdAt: result.createdAt,
        updatedAt: result.updatedAt
      }));

      return {
        success: true,
        data: historyItems,
        count: historyItems.length
      };
    } catch (error) {
      throw new HttpException(
        `Failed to fetch scan history: ${error.message}`,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}