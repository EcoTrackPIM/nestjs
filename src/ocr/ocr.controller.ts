// ocr.controller.ts
import { Controller, Post, Get, UploadedFile, UseInterceptors, HttpException, HttpStatus, Body, Param } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { OcrService } from './ocr.service';
import * as fs from 'fs';
import { ScanResultResponse, ScanHistoryResponse } from './types';

@Controller('ocr')
export class OcrController {
  constructor(private readonly ocrService: OcrService) {}

  @Post('scan')
  @UseInterceptors(FileInterceptor('file', {
    storage: diskStorage({
      destination: './uploads',
      filename: (req, file, callback) => {
        const uniqueName = `${Date.now()}-${file.originalname}`;
        callback(null, uniqueName);
      },
    }),
    limits: { fileSize: 10 * 1024 * 1024 },
    fileFilter: (req, file, callback) => {
      if (!file.mimetype.match(/\/(jpg|jpeg|png|webp)$/)) {
        return callback(
          new HttpException('Only image files are allowed!', HttpStatus.BAD_REQUEST),
          false
        );
      }
      callback(null, true);
    },
  }))
  async scanLabel(
    @UploadedFile() file: Express.Multer.File,
    @Body() body: { userId: string }
  ): Promise<ScanResultResponse> {
    if (!file) {
      throw new HttpException('No file uploaded', HttpStatus.BAD_REQUEST);
    }
    if (!body.userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      const result = await this.ocrService.extractText(file.path, body.userId);
      fs.unlinkSync(file.path);
      return result;
    } catch (error) {
      fs.unlinkSync(file.path);
      throw new HttpException(
        error.message,
        error.status || HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }

  @Get('history/:userId')
  async getScanHistory(@Param('userId') userId: string): Promise<ScanHistoryResponse> {
    if (!userId) {
      throw new HttpException('User ID is required', HttpStatus.BAD_REQUEST);
    }

    try {
      return await this.ocrService.getScanHistory(userId);
    } catch (error) {
      throw new HttpException(
        error.message,
        HttpStatus.INTERNAL_SERVER_ERROR
      );
    }
  }
}