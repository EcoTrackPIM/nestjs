import { Model } from 'mongoose';
import { ScanResultDocument } from '../scan-result/scan-result.schema';
import { ScanResultResponse, ScanHistoryResponse } from './types';
export declare class OcrService {
    private readonly scanResultModel;
    private readonly OCR_API_URL;
    constructor(scanResultModel: Model<ScanResultDocument>);
    extractText(imagePath: string, userId: string): Promise<ScanResultResponse>;
    getScanHistory(userId: string): Promise<ScanHistoryResponse>;
}
