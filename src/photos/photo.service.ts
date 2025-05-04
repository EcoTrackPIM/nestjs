import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Photo, PhotoDocument } from './photo.schema';

@Injectable()
export class PhotoService {
  constructor(
    @InjectModel(Photo.name) private photoModel: Model<PhotoDocument>,
  ) {}

  async savePhotos(photoData: { filename: string; type: string; path: string }[]): Promise<Photo[]> {
    const createdPhotos = await this.photoModel.insertMany(photoData);
    return createdPhotos;
  }
}
