// types.ts
export interface ScanResultResponse {
    success: boolean;
    data: {
      extracted_text: string;
      detected_composition: Record<string, number>;
      is_exact: boolean;
      processing_time_ms: number;
      scanId: string;
      createdAt: Date;
      imagePath?: string;
      userId?: string;
    };
    warnings?: string[];
  }
  
  export interface ScanHistoryItem {
    _id: string;
    extractedText: string;
    detectedComposition: Record<string, number>;
    isExact: boolean;
    processingTimeMs: number;
    imagePath?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
  }
  
  export interface ScanHistoryResponse {
    success: boolean;
    data: ScanHistoryItem[];
    count?: number;
  }