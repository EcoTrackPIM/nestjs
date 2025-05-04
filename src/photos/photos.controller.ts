import { Controller, Post, UploadedFiles, UseInterceptors, Body } from '@nestjs/common';
import { FileFieldsInterceptor } from '@nestjs/platform-express';
import { diskStorage } from 'multer';
import { v4 as uuidv4 } from 'uuid';
import * as path from 'path';
import { PhotoService } from './photo.service';

@Controller('photos')
export class PhotosController {
  constructor(private readonly photoService: PhotoService) {}

  @Post('upload')
  @UseInterceptors(FileFieldsInterceptor([
    { name: 'files', maxCount: 10 },
  ], {
    storage: diskStorage({
      destination: './uploads/photos',
      filename: (req, file, cb) => {
        const uniqueName = `${uuidv4()}${path.extname(file.originalname)}`;
        cb(null, uniqueName);
      }
    }),
  }))
  async uploadFiles(
    @UploadedFiles() files: { files?: Express.Multer.File[] },
    @Body('types') types: string[],
  ) {
    console.log('✅ Photos reçues :', files?.files?.length);
    console.log('📋 Types reçus :', types);

    if (!files.files || files.files.length === 0) {
      throw new Error('Aucun fichier reçu');
    }

    const photosToSave = files.files.map((file, index) => ({
      filename: file.filename,
      path: file.path,
      type: Array.isArray(types) ? types[index] : types, // ⚡ important: si types[] est un seul élément
    }));

    const savedPhotos = await this.photoService.savePhotos(photosToSave);

    return { success: true, data: savedPhotos };
  }
}
