/// <reference types="node" />
/// <reference types="node" />
export declare class VisionService {
    private client;
    constructor();
    detectText(imageBuffer: Buffer): Promise<string[]>;
}
