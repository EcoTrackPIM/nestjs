// src/upload/types.ts
import { Document } from 'mongoose';

export interface User {
  _id: string;
  // Add other user properties as needed
  id?: string; // Some systems might use 'id' instead of '_id'
}

declare global {
  namespace Express {
    interface Request {
      user?: User | any; // Use 'any' as fallback
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