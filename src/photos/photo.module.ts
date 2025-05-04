import { Module } from '@nestjs/common';
import { MongooseModule } from '@nestjs/mongoose';
import { Photo, PhotoSchema } from './photo.schema';
import { PhotosController } from './photos.controller';
import { PhotoService } from './photo.service';

@Module({
  imports: [MongooseModule.forFeature([{ name: Photo.name, schema: PhotoSchema }])],
  controllers: [PhotosController],
  providers: [PhotoService],
})
export class PhotoModule {}
