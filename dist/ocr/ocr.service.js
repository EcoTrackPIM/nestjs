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
var __param = (this && this.__param) || function (paramIndex, decorator) {
    return function (target, key) { decorator(target, key, paramIndex); }
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.OcrService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const scan_result_schema_1 = require("../scan-result/scan-result.schema");
const axios_1 = require("axios");
const FormData = require("form-data");
const fs = require("fs");
let OcrService = class OcrService {
    constructor(scanResultModel) {
        this.scanResultModel = scanResultModel;
        this.OCR_API_URL = 'http://localhost:8001/analyze';
    }
    async extractText(imagePath, userId) {
        try {
            const formData = new FormData();
            formData.append('file', fs.createReadStream(imagePath));
            const response = await axios_1.default.post(this.OCR_API_URL, formData, {
                headers: formData.getHeaders(),
                maxBodyLength: 10 * 1024 * 1024,
            });
            const scanResult = await this.scanResultModel.create({
                extractedText: response.data.extracted_text,
                detectedComposition: response.data.detected_composition || {},
                isExact: response.data.is_exact || false,
                processingTimeMs: response.data.processing_time_ms || 0,
                imagePath: imagePath,
                userId: userId
            });
            const result = scanResult.toObject();
            const warnings = [];
            if (response.data.extracted_text === "No text could be extracted from the image") {
                warnings.push("No text detected - try a clearer image");
            }
            return {
                success: true,
                data: {
                    ...response.data,
                    scanId: result._id.toString(),
                    createdAt: result.createdAt,
                    imagePath: result.imagePath,
                },
                warnings
            };
        }
        catch (error) {
            throw new common_1.HttpException(error.response?.data?.detail || `OCR processing failed: ${error.message}`, error.response?.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getScanHistory(userId) {
        try {
            const results = await this.scanResultModel.find({ userId })
                .sort({ createdAt: -1 })
                .lean()
                .exec();
            const historyItems = results.map(result => ({
                _id: result._id.toString(),
                extractedText: result.extractedText || "No text extracted",
                detectedComposition: result.detectedComposition || {},
                isExact: result.isExact || false,
                processingTimeMs: result.processingTimeMs || 0,
                imagePath: result.imagePath,
                userId: result.userId,
                createdAt: result.createdAt,
                updatedAt: result.updatedAt
            }));
            return {
                success: true,
                data: historyItems,
                count: historyItems.length
            };
        }
        catch (error) {
            throw new common_1.HttpException(`Failed to fetch scan history: ${error.message}`, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
OcrService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(scan_result_schema_1.ScanResult.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], OcrService);
exports.OcrService = OcrService;
//# sourceMappingURL=ocr.service.js.map