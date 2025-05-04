"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.VisionService = void 0;
const common_1 = require("@nestjs/common");
const vision_1 = require("@google-cloud/vision");
let VisionService = class VisionService {
    constructor() {
        this.client = new vision_1.ImageAnnotatorClient({
            keyFilename: 'src/vision-key.json',
        });
    }
    async detectText(imageBuffer) {
        try {
            const [result] = await this.client.textDetection({
                image: { content: imageBuffer },
            });
            const detections = result.textAnnotations || [];
            return detections.map((text) => text.description);
        }
        catch (error) {
            console.error('Error in Vision API:', error);
            return [];
        }
    }
};
VisionService = __decorate([
    (0, common_1.Injectable)(),
    __metadata("design:paramtypes", [])
], VisionService);
exports.VisionService = VisionService;
//# sourceMappingURL=vision.service.js.map