/// <reference types="multer" />
import { ConfigService } from '@nestjs/config';
import { Model } from 'mongoose';
import { UploadDocument } from './upload.schema';
export declare class UploadService {
    private configService;
    private uploadModel;
    private readonly logger;
    private readonly HUGGING_FACE_API_URL;
    private readonly API_KEY;
    private readonly UPLOAD_DIR;
    private readonly MAX_FILE_SIZE;
    private carbonFootprint;
    constructor(configService: ConfigService, uploadModel: Model<UploadDocument>);
    processImage(file: Express.Multer.File, userId: string, body: any): Promise<{
        success: boolean;
        fabric: any;
        carbonFootprint: number;
        message: string;
        fileName: string;
        savedPath: string;
        scanId: string;
        timestamp: string;
    }>;
    updateCarbonFootprint(uploadId: string, userId: string, newCarbonFootprint: number): Promise<{
        success: boolean;
        message: string;
        data: {
            fabric: string;
            carbonFootprint: number;
            timestamp: string;
        };
    }>;
    private analyzeWithAI;
    private saveUploadedFile;
    private handleError;
    getUploadedFiles(userId?: string): Promise<{
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
}
