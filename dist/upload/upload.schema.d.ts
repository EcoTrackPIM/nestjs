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
export type UploadDocument = Upload & Document;
export declare class Upload {
    userId: string;
    originalName: string;
    filePath: string;
    analysisResult: {
        fabric: string;
        carbonFootprint: number;
        timestamp: string;
    };
    outfitType: string;
    ecoScore: number;
    createdAt: Date;
    updatedAt: Date;
}
export declare const UploadSchema: import("mongoose").Schema<Upload, import("mongoose").Model<Upload, any, any, any, Document<unknown, any, Upload> & Upload & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}, any>, {}, {}, {}, {}, import("mongoose").DefaultSchemaOptions, Upload, Document<unknown, {}, import("mongoose").FlatRecord<Upload>> & import("mongoose").FlatRecord<Upload> & {
    _id: import("mongoose").Types.ObjectId;
} & {
    __v: number;
}>;
