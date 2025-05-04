import { Injectable, Logger, HttpException, HttpStatus } from '@nestjs/common';
import axios from 'axios';
import * as fs from 'fs/promises';
import * as path from 'path';
import { ConfigService } from '@nestjs/config';
import * as FileType from 'file-type';
import { InjectModel } from '@nestjs/mongoose';
import { Model, Types } from 'mongoose';
import { Upload, UploadDocument } from './upload.schema';
import { NotFoundException } from '@nestjs/common';

@Injectable()
export class UploadService {
  private readonly logger = new Logger(UploadService.name);
  private readonly HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32';
  private readonly API_KEY: string;
  private readonly UPLOAD_DIR = path.join(process.cwd(), 'uploads');
  private readonly MAX_FILE_SIZE = 5 * 1024 * 1024;

  private carbonFootprint = {
    cotton: 20,
    wool: 25,
    polyester: 30,
    silk: 15,
  };

  constructor(
    private configService: ConfigService,
    @InjectModel(Upload.name) private uploadModel: Model<UploadDocument>,
  ) {
    this.API_KEY = this.configService.get<string>('HUGGING_FACE_API_KEY');
    if (!this.API_KEY) {
      throw new Error('Hugging Face API key not configured');
    }
  }

  async processImage(file: Express.Multer.File, userId: string, body: any) {
    this.logger.log(`Processing file for user: ${userId}`);

    if (!file?.buffer) throw new HttpException('Invalid file', HttpStatus.BAD_REQUEST);
    if (file.size > this.MAX_FILE_SIZE) throw new HttpException('File too large', HttpStatus.PAYLOAD_TOO_LARGE);

    const fileTypeResult = await FileType.fromBuffer(file.buffer);
    if (!fileTypeResult?.mime?.startsWith('image/')) {
      throw new HttpException('Invalid image file', HttpStatus.UNSUPPORTED_MEDIA_TYPE);
    }

    try {
      // Get frontend-provided values
      const frontendCarbon = body.carbon_footprint 
        ? Number(body.carbon_footprint)
        : null;
      const frontendFabric = body.fabric || null;

      let fabric = frontendFabric;
      let carbon = frontendCarbon;

      // Only call AI if frontend didn't provide values
      if (!frontendFabric || !frontendCarbon) {
        const aiResult = await this.analyzeWithAI(file.buffer);
        fabric = aiResult.fabric;
        carbon = aiResult.carbonFootprint;
      }

      const timestamp = new Date().toISOString();
      const savedFilePath = await this.saveUploadedFile(file, fileTypeResult.ext);

      const createdUpload = new this.uploadModel({
        userId,
        originalName: file.originalname,
        filePath: savedFilePath,
        analysisResult: {
          fabric,
          carbonFootprint: carbon,
          timestamp,
        },
        outfitType: body.outfit_type || null,
      });

      await createdUpload.save();

      return {
        success: true,
        fabric,
        carbonFootprint: carbon,
        message: frontendCarbon 
          ? `Custom carbon footprint: ${carbon} kg CO2`
          : `AI-estimated carbon footprint: ${carbon} kg CO2`,
        fileName: file.originalname,
        savedPath: savedFilePath,
        scanId: createdUpload._id.toString(),
        timestamp,
      };
    } catch (error) {
      this.logger.error('Image processing failed', error.stack);
      throw this.handleError(error);
    }
  }

  async updateCarbonFootprint(uploadId: string, userId: string, newCarbonFootprint: number) {
    if (!Types.ObjectId.isValid(uploadId)) {
      throw new HttpException('Invalid upload ID', HttpStatus.BAD_REQUEST);
    }

    const upload = await this.uploadModel.findOneAndUpdate(
      { _id: uploadId, userId },
      { 
        $set: { 
          'analysisResult.carbonFootprint': newCarbonFootprint,
          'analysisResult.timestamp': new Date().toISOString()
        } 
      },
      { new: true }
    );

    if (!upload) {
      throw new NotFoundException('Upload not found or access denied');
    }

    return {
      success: true,
      message: 'Carbon footprint updated successfully',
      data: {
        fabric: upload.analysisResult.fabric,
        carbonFootprint: upload.analysisResult.carbonFootprint,
        timestamp: upload.analysisResult.timestamp,
      },
    };
  }

  private async analyzeWithAI(buffer: Buffer) {
    try {
      const base64Image = buffer.toString('base64');
      const response = await axios.post(
        this.HUGGING_FACE_API_URL,
        {
          inputs: base64Image,
          parameters: { candidate_labels: ['cotton', 'wool', 'polyester', 'silk'] }
        },
        {
          headers: { Authorization: `Bearer ${this.API_KEY}` },
          timeout: 30000
        }
      );

      const fabric = response.data[0]?.label?.toLowerCase() || 'unknown';
      return {
        fabric,
        carbonFootprint: this.carbonFootprint[fabric] || 0
      };
    } catch (error) {
      this.logger.error('AI analysis failed', error.stack);
      return { fabric: 'unknown', carbonFootprint: 0 };
    }
  }

  private async saveUploadedFile(file: Express.Multer.File, ext: string): Promise<string> {
    await fs.mkdir(this.UPLOAD_DIR, { recursive: true });
    const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
    const filePath = path.join(this.UPLOAD_DIR, filename);
    await fs.writeFile(filePath, file.buffer);
    return filePath;
  }

  private handleError(error: any) {
    if (error instanceof HttpException) return error;
    if (error.response?.status) {
      return new HttpException(
        error.response.data?.error || 'External API error',
        error.response.status
      );
    }
    return new HttpException(
      error.message || 'Internal server error',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }

  async getUploadedFiles(userId?: string) {
    try {
      const query = userId ? { userId } : {};
      const uploads = await this.uploadModel.find(query).sort({ createdAt: -1 }).exec();
      
      return {
        success: true,
        count: uploads.length,
        files: uploads.map(upload => ({
          id: upload._id.toString(),
          fileName: upload.originalName,
          path: upload.filePath,
          fabric: upload.analysisResult.fabric,
          carbonFootprint: upload.analysisResult.carbonFootprint,
          outfitType: upload.outfitType,
          timestamp: upload.analysisResult.timestamp,
          userId: upload.userId,
        })),
        timestamp: new Date().toISOString(),
      };
    } catch (error) {
      this.logger.error('Database query failed', error.stack);
      throw new HttpException(
        'Failed to retrieve uploads',
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

// upload.service.ts
async getEcoProgress(userId: string) {
  try {
    // Get all uploads sorted by date (newest first)
    const uploads = await this.uploadModel.find({ userId })
      .sort({ createdAt: -1 })
      .exec();

    if (uploads.length === 0) {
      return {
        success: true,
        message: 'No uploads found for this user',
        ecoScore: 0,
        improvements: 0,
        carbonHistory: []
      };
    }

    let improvements = 0;
    const carbonHistory = [];
    let previousCarbon = uploads[0].analysisResult.carbonFootprint;

    // Start from the second item to compare with previous
    for (let i = 1; i < uploads.length; i++) {
      const current = uploads[i];
      const currentCarbon = current.analysisResult.carbonFootprint;
      
      carbonHistory.push({
        date: current.createdAt,
        carbonFootprint: currentCarbon
      });

      // If current carbon is lower than previous, it's an improvement
      if (currentCarbon < previousCarbon) {
        improvements++;
        
        // Update the ecoScore for this record
        await this.uploadModel.findByIdAndUpdate(
          current._id,
          { $inc: { ecoScore: 1 } }
        );
      }
      previousCarbon = currentCarbon;
    }

    // Calculate total ecoScore (can be sum or average, here we use sum)
    const totalEcoScore = improvements;

    return {
      success: true,
      message: 'Eco progress calculated',
      ecoScore: totalEcoScore,
      improvements,
      carbonHistory,
      timeline: uploads.map(upload => ({
        date: upload.createdAt,
        carbonFootprint: upload.analysisResult.carbonFootprint,
        outfitType: upload.outfitType,
        ecoScore: upload.ecoScore
      }))
    };
  } catch (error) {
    this.logger.error('Failed to calculate eco progress', error.stack);
    throw new HttpException(
      'Failed to calculate eco progress',
      HttpStatus.INTERNAL_SERVER_ERROR
    );
  }
}



}