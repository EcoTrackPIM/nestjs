/// <reference types="mongoose/types/aggregate" />
/// <reference types="mongoose/types/callback" />
/// <reference types="mongoose/types/collection" />
/// <reference types="mongoose/types/connection" />
/// <reference types="mongoose/types/cursor" />
/// <reference types="mongoose/types/document" />
/// <reference types="mongoose/types/error" />
/// <reference types="mongoose/types/expressions" />
/// <reference types="mongoose/types/helpers" />
/// <reference types="mongoose/types/middlewares" />
/// <reference types="mongoose/types/indexes" />
/// <reference types="mongoose/types/models" />
/// <reference types="mongoose/types/mongooseoptions" />
/// <reference types="mongoose/types/pipelinestage" />
/// <reference types="mongoose/types/populate" />
/// <reference types="mongoose/types/query" />
/// <reference types="mongoose/types/schemaoptions" />
/// <reference types="mongoose/types/schematypes" />
/// <reference types="mongoose/types/session" />
/// <reference types="mongoose/types/types" />
/// <reference types="mongoose/types/utility" />
/// <reference types="mongoose/types/validation" />
/// <reference types="mongoose/types/virtuals" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { Document } from 'mongoose';
export declare class ScanResult {
    extractedText: string;
    detectedComposition: Record<string, number>;
    isExact: boolean;
    processingTimeMs: number;
    imagePath?: string;
    userId: string;
    createdAt: Date;
    updatedAt: Date;
}
export interface ScanResultDocument extends ScanResult, Document {
    createdAt: Date;
    updatedAt: Date;
}
export declare const ScanResultSchema: import("mongoose").Schema<ScanResult, import("mongoose").Model<ScanResult, any, any, any, Document<unknown, any, ScanResult> & ScanResult & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, ScanResult, Document<unknown, {}, import("mongoose").FlatRecord<ScanResult>> & import("mongoose").FlatRecord<ScanResult> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
