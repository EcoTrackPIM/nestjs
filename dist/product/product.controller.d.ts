/// <reference types="multer" />
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
/// <reference types="mongoose" />
/// <reference types="mongoose/types/inferschematype" />
/// <reference types="mongoose/types/inferrawdoctype" />
import { ProductService } from './product.service';
import { Product } from './product.schema';
export declare class ProductController {
    private readonly productService;
    constructor(productService: ProductService);
    cacheProducts(): Promise<any[]>;
    getAllProducts(): Promise<Product[]>;
    getProductsInTunisia(): Promise<Product[]>;
    scanProduct(code: string): Promise<any>;
    createProduct(product: Product): Promise<Product>;
    getScannedProducts(): Promise<(import("mongoose").Document<unknown, {}, import("./product.schema").ProductDocument> & Product & import("mongoose").Document<unknown, any, any> & Required<{
        _id: unknown;
    }> & {
        __v: number;
    })[]>;
    searchInTunisia(term: string): Promise<Product[]>;
    importProductsFromScript(): Promise<any>;
    addBasicInfo(body: any): Promise<any>;
    uploadPhotos(files: Array<Express.Multer.File>): Promise<{
        success: boolean;
        message: string;
    }>;
}
