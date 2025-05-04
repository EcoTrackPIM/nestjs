import { Controller, Post, UseInterceptors, UploadedFile, HttpException, HttpStatus, Get, Query, Body, Param, Put } from '@nestjs/common';
import { FileInterceptor } from '@nestjs/platform-express';
import { UploadService } from './upload.service';
import { diskStorage } from 'multer';
import { extname } from 'path';
import * as fs from 'fs/promises';

@Controller('upload')
export class UploadController {
  constructor(private readonly uploadService: UploadService) {}

  @Post()
@UseInterceptors(FileInterceptor('image', {
  storage: diskStorage({
    destination: './uploads',
    filename: (req, file, cb) => {
      const randomName = Array(32)
        .fill(0)
        .map(() => Math.floor(Math.random() * 16).toString(16))
        .join('');
      return cb(null, `${randomName}${extname(file.originalname)}`);
    }
  }),
  limits: {
    fileSize: 5 * 1024 * 1024, // 5MB
  },
}))
async uploadFile(
  @UploadedFile() file: Express.Multer.File,
  @Body('user_id') userId: string,
  @Body() body: any // Added to capture all body parameters
) {
  if (!file) {
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'No file uploaded',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  if (!userId) {
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'User ID is required',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  try {
    // Read the file from disk since multer saves it
    const fileBuffer = await fs.readFile(file.path);
    const fileWithBuffer = {
      ...file,
      buffer: fileBuffer,
    };

    // Now passing all three required arguments to processImage
    const result = await this.uploadService.processImage(
      fileWithBuffer,
      userId,
      body // Passing the full body object
    );

    // Clean up the temporary file
    await fs.unlink(file.path);

    return result;
  } catch (error) {
    console.error('Controller error:', error);
    throw new HttpException(
      {
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.response?.error || error.message || 'Failed to process image',
        details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
      },
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

// upload.controller.ts
@Get('eco-progress/:userId')
async getEcoProgress(@Param('userId') userId: string) {
  if (!userId) {
    throw new HttpException(
      {
        status: HttpStatus.BAD_REQUEST,
        error: 'User ID is required',
      },
      HttpStatus.BAD_REQUEST,
    );
  }

  try {
    return await this.uploadService.getEcoProgress(userId);
  } catch (error) {
    throw new HttpException(
      {
        status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
        error: error.message || 'Failed to get eco progress',
      },
      error.status || HttpStatus.INTERNAL_SERVER_ERROR,
    );
  }
}

  @Put(':id/carbon-footprint')
  async updateCarbonFootprint(
    @Param('id') id: string,
    @Body('carbonFootprint') carbonFootprint: number,
    @Body('userId') userId: string,
  ) {
    if (!id || !carbonFootprint || !userId) {
      throw new HttpException(
        {
          status: HttpStatus.BAD_REQUEST,
          error: 'ID, carbon footprint, and user ID are required',
        },
        HttpStatus.BAD_REQUEST,
      );
    }

    try {
      const updatedUpload = await this.uploadService.updateCarbonFootprint(
        id,
        userId,
        carbonFootprint,
      );

      return {
        success: true,
        message: 'Carbon footprint updated successfully',
        data: updatedUpload,
      };
    } catch (error) {
      throw new HttpException(
        {
          status: error.status || HttpStatus.INTERNAL_SERVER_ERROR,
          error: error.message || 'Failed to update carbon footprint',
        },
        error.status || HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }


  @Get()
  async getUploads(@Query('userId') userId?: string) {
    try {
      return await this.uploadService.getUploadedFiles(userId);
    } catch (error) {
      throw new HttpException(
        {
          status: HttpStatus.INTERNAL_SERVER_ERROR,
          error: 'Failed to retrieve uploaded files',
        },
        HttpStatus.INTERNAL_SERVER_ERROR,
      );
    }
  }
}