/// <reference types="multer" />
import { PhotoService } from './photo.service';
export declare class PhotosController {
    private readonly photoService;
    constructor(photoService: PhotoService);
    uploadFiles(files: {
        files?: Express.Multer.File[];
    }, types: string[]): Promise<{
        success: boolean;
        data: import("./photo.schema").Photo[];
    }>;
}
