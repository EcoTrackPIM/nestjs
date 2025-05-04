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
var UploadService_1;
Object.defineProperty(exports, "__esModule", { value: true });
exports.UploadService = void 0;
const common_1 = require("@nestjs/common");
const axios_1 = require("axios");
const fs = require("fs/promises");
const path = require("path");
const config_1 = require("@nestjs/config");
const FileType = require("file-type");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const upload_schema_1 = require("./upload.schema");
const common_2 = require("@nestjs/common");
let UploadService = UploadService_1 = class UploadService {
    constructor(configService, uploadModel) {
        this.configService = configService;
        this.uploadModel = uploadModel;
        this.logger = new common_1.Logger(UploadService_1.name);
        this.HUGGING_FACE_API_URL = 'https://api-inference.huggingface.co/models/openai/clip-vit-base-patch32';
        this.UPLOAD_DIR = path.join(process.cwd(), 'uploads');
        this.MAX_FILE_SIZE = 5 * 1024 * 1024;
        this.carbonFootprint = {
            cotton: 20,
            wool: 25,
            polyester: 30,
            silk: 15,
        };
        this.API_KEY = this.configService.get('HUGGING_FACE_API_KEY');
        if (!this.API_KEY) {
            throw new Error('Hugging Face API key not configured');
        }
    }
    async processImage(file, userId, body) {
        this.logger.log(`Processing file for user: ${userId}`);
        if (!file?.buffer)
            throw new common_1.HttpException('Invalid file', common_1.HttpStatus.BAD_REQUEST);
        if (file.size > this.MAX_FILE_SIZE)
            throw new common_1.HttpException('File too large', common_1.HttpStatus.PAYLOAD_TOO_LARGE);
        const fileTypeResult = await FileType.fromBuffer(file.buffer);
        if (!fileTypeResult?.mime?.startsWith('image/')) {
            throw new common_1.HttpException('Invalid image file', common_1.HttpStatus.UNSUPPORTED_MEDIA_TYPE);
        }
        try {
            const frontendCarbon = body.carbon_footprint
                ? Number(body.carbon_footprint)
                : null;
            const frontendFabric = body.fabric || null;
            let fabric = frontendFabric;
            let carbon = frontendCarbon;
            if (!frontendFabric || !frontendCarbon) {
                const aiResult = await this.analyzeWithAI(file.buffer);
                fabric = aiResult.fabric;
                carbon = aiResult.carbonFootprint;
            }
            const timestamp = new Date().toISOString();
            const savedFilePath = await this.saveUploadedFile(file, fileTypeResult.ext);
            const createdUpload = new this.uploadModel({
                userId,
                originalName: file.originalname,
                filePath: savedFilePath,
                analysisResult: {
                    fabric,
                    carbonFootprint: carbon,
                    timestamp,
                },
                outfitType: body.outfit_type || null,
            });
            await createdUpload.save();
            return {
                success: true,
                fabric,
                carbonFootprint: carbon,
                message: frontendCarbon
                    ? `Custom carbon footprint: ${carbon} kg CO2`
                    : `AI-estimated carbon footprint: ${carbon} kg CO2`,
                fileName: file.originalname,
                savedPath: savedFilePath,
                scanId: createdUpload._id.toString(),
                timestamp,
            };
        }
        catch (error) {
            this.logger.error('Image processing failed', error.stack);
            throw this.handleError(error);
        }
    }
    async updateCarbonFootprint(uploadId, userId, newCarbonFootprint) {
        if (!mongoose_2.Types.ObjectId.isValid(uploadId)) {
            throw new common_1.HttpException('Invalid upload ID', common_1.HttpStatus.BAD_REQUEST);
        }
        const upload = await this.uploadModel.findOneAndUpdate({ _id: uploadId, userId }, {
            $set: {
                'analysisResult.carbonFootprint': newCarbonFootprint,
                'analysisResult.timestamp': new Date().toISOString()
            }
        }, { new: true });
        if (!upload) {
            throw new common_2.NotFoundException('Upload not found or access denied');
        }
        return {
            success: true,
            message: 'Carbon footprint updated successfully',
            data: {
                fabric: upload.analysisResult.fabric,
                carbonFootprint: upload.analysisResult.carbonFootprint,
                timestamp: upload.analysisResult.timestamp,
            },
        };
    }
    async analyzeWithAI(buffer) {
        try {
            const base64Image = buffer.toString('base64');
            const response = await axios_1.default.post(this.HUGGING_FACE_API_URL, {
                inputs: base64Image,
                parameters: { candidate_labels: ['cotton', 'wool', 'polyester', 'silk'] }
            }, {
                headers: { Authorization: `Bearer ${this.API_KEY}` },
                timeout: 30000
            });
            const fabric = response.data[0]?.label?.toLowerCase() || 'unknown';
            return {
                fabric,
                carbonFootprint: this.carbonFootprint[fabric] || 0
            };
        }
        catch (error) {
            this.logger.error('AI analysis failed', error.stack);
            return { fabric: 'unknown', carbonFootprint: 0 };
        }
    }
    async saveUploadedFile(file, ext) {
        await fs.mkdir(this.UPLOAD_DIR, { recursive: true });
        const filename = `${Date.now()}-${Math.random().toString(36).substr(2, 9)}.${ext}`;
        const filePath = path.join(this.UPLOAD_DIR, filename);
        await fs.writeFile(filePath, file.buffer);
        return filePath;
    }
    handleError(error) {
        if (error instanceof common_1.HttpException)
            return error;
        if (error.response?.status) {
            return new common_1.HttpException(error.response.data?.error || 'External API error', error.response.status);
        }
        return new common_1.HttpException(error.message || 'Internal server error', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
    }
    async getUploadedFiles(userId) {
        try {
            const query = userId ? { userId } : {};
            const uploads = await this.uploadModel.find(query).sort({ createdAt: -1 }).exec();
            return {
                success: true,
                count: uploads.length,
                files: uploads.map(upload => ({
                    id: upload._id.toString(),
                    fileName: upload.originalName,
                    path: upload.filePath,
                    fabric: upload.analysisResult.fabric,
                    carbonFootprint: upload.analysisResult.carbonFootprint,
                    outfitType: upload.outfitType,
                    timestamp: upload.analysisResult.timestamp,
                    userId: upload.userId,
                })),
                timestamp: new Date().toISOString(),
            };
        }
        catch (error) {
            this.logger.error('Database query failed', error.stack);
            throw new common_1.HttpException('Failed to retrieve uploads', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEcoProgress(userId) {
        try {
            const uploads = await this.uploadModel.find({ userId })
                .sort({ createdAt: -1 })
                .exec();
            if (uploads.length === 0) {
                return {
                    success: true,
                    message: 'No uploads found for this user',
                    ecoScore: 0,
                    improvements: 0,
                    carbonHistory: []
                };
            }
            let improvements = 0;
            const carbonHistory = [];
            let previousCarbon = uploads[0].analysisResult.carbonFootprint;
            for (let i = 1; i < uploads.length; i++) {
                const current = uploads[i];
                const currentCarbon = current.analysisResult.carbonFootprint;
                carbonHistory.push({
                    date: current.createdAt,
                    carbonFootprint: currentCarbon
                });
                if (currentCarbon < previousCarbon) {
                    improvements++;
                    await this.uploadModel.findByIdAndUpdate(current._id, { $inc: { ecoScore: 1 } });
                }
                previousCarbon = currentCarbon;
            }
            const totalEcoScore = improvements;
            return {
                success: true,
                message: 'Eco progress calculated',
                ecoScore: totalEcoScore,
                improvements,
                carbonHistory,
                timeline: uploads.map(upload => ({
                    date: upload.createdAt,
                    carbonFootprint: upload.analysisResult.carbonFootprint,
                    outfitType: upload.outfitType,
                    ecoScore: upload.ecoScore
                }))
            };
        }
        catch (error) {
            this.logger.error('Failed to calculate eco progress', error.stack);
            throw new common_1.HttpException('Failed to calculate eco progress', common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
UploadService = UploadService_1 = __decorate([
    (0, common_1.Injectable)(),
    __param(1, (0, mongoose_1.InjectModel)(upload_schema_1.Upload.name)),
    __metadata("design:paramtypes", [config_1.ConfigService,
        mongoose_2.Model])
], UploadService);
exports.UploadService = UploadService;
//# sourceMappingURL=upload.service.js.map