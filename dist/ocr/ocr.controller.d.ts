/// <reference types="multer" />
import { OcrService } from './ocr.service';
import { ScanResultResponse, ScanHistoryResponse } from './types';
export declare class OcrController {
    private readonly ocrService;
    constructor(ocrService: OcrService);
    scanLabel(file: Express.Multer.File, body: {
        userId: string;
    }): Promise<ScanResultResponse>;
    getScanHistory(userId: string): Promise<ScanHistoryResponse>;
}
