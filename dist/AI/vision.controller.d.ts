/// <reference types="multer" />
import { VisionService } from './vision.service';
export declare class VisionController {
    private readonly visionService;
    constructor(visionService: VisionService);
    detectText(file: Express.Multer.File): Promise<string[]>;
}
