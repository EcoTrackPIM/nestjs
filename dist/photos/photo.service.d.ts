import { Model } from 'mongoose';
import { Photo, PhotoDocument } from './photo.schema';
export declare class PhotoService {
    private photoModel;
    constructor(photoModel: Model<PhotoDocument>);
    savePhotos(photoData: {
        filename: string;
        type: string;
        path: string;
    }[]): Promise<Photo[]>;
}
