/// <reference types="multer" />
import { UploadService } from './upload.service';
export declare class UploadController {
    private readonly uploadService;
    constructor(uploadService: UploadService);
    uploadFile(file: Express.Multer.File, userId: string, body: any): Promise<{
        success: boolean;
        fabric: any;
        carbonFootprint: number;
        message: string;
        fileName: string;
        savedPath: string;
        scanId: string;
        timestamp: string;
    }>;
    getEcoProgress(userId: string): Promise<{
        success: boolean;
        message: string;
        ecoScore: number;
        improvements: number;
        carbonHistory: any[];
        timeline?: undefined;
    } | {
        success: boolean;
        message: string;
        ecoScore: number;
        improvements: number;
        carbonHistory: any[];
        timeline: {
            date: Date;
            carbonFootprint: number;
            outfitType: string;
            ecoScore: number;
        }[];
    }>;
    updateCarbonFootprint(id: string, carbonFootprint: number, userId: string): Promise<{
        success: boolean;
        message: string;
        data: {
            success: boolean;
            message: string;
            data: {
                fabric: string;
                carbonFootprint: number;
                timestamp: string;
            };
        };
    }>;
    getUploads(userId?: string): Promise<{
        success: boolean;
        count: number;
        files: {
            id: string;
            fileName: string;
            path: string;
            fabric: string;
            carbonFootprint: number;
            outfitType: string;
            timestamp: string;
            userId: string;
        }[];
        timestamp: string;
    }>;
}
