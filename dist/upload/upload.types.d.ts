export interface UploadResponse {
    success: boolean;
    fabric: string;
    carbonFootprint: number;
    message: string;
    fileName: string;
    savedPath: string;
    scanId: string;
    createdAt: Date;
    timestamp: string;
}
export interface UploadHistoryItem {
    id: string;
    fabric: string;
    carbonFootprint: number;
    fileName: string;
    savedPath: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface UploadHistoryResponse {
    success: boolean;
    data: UploadHistoryItem[];
    count: number;
    timestamp: string;
}
