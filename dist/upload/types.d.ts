export interface User {
    _id: string;
    id?: string;
}
declare global {
    namespace Express {
        interface Request {
            user?: User | any;
        }
    }
}
export interface UploadResponse {
    success: boolean;
    fabric: string;
    carbonFootprint: number;
    message: string;
    fileName: string;
    savedPath: string;
    scanId?: string;
    timestamp: string;
}
