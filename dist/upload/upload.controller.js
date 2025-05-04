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
exports.UploadController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const upload_service_1 = require("./upload.service");
const multer_1 = require("multer");
const path_1 = require("path");
const fs = require("fs/promises");
let UploadController = class UploadController {
    constructor(uploadService) {
        this.uploadService = uploadService;
    }
    async uploadFile(file, userId, body) {
        if (!file) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: 'No file uploaded',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        if (!userId) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: 'User ID is required',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const fileBuffer = await fs.readFile(file.path);
            const fileWithBuffer = {
                ...file,
                buffer: fileBuffer,
            };
            const result = await this.uploadService.processImage(fileWithBuffer, userId, body);
            await fs.unlink(file.path);
            return result;
        }
        catch (error) {
            console.error('Controller error:', error);
            throw new common_1.HttpException({
                status: error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.response?.error || error.message || 'Failed to process image',
                details: process.env.NODE_ENV === 'development' ? error.stack : undefined,
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getEcoProgress(userId) {
        if (!userId) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: 'User ID is required',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            return await this.uploadService.getEcoProgress(userId);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message || 'Failed to get eco progress',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async updateCarbonFootprint(id, carbonFootprint, userId) {
        if (!id || !carbonFootprint || !userId) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.BAD_REQUEST,
                error: 'ID, carbon footprint, and user ID are required',
            }, common_1.HttpStatus.BAD_REQUEST);
        }
        try {
            const updatedUpload = await this.uploadService.updateCarbonFootprint(id, userId, carbonFootprint);
            return {
                success: true,
                message: 'Carbon footprint updated successfully',
                data: updatedUpload,
            };
        }
        catch (error) {
            throw new common_1.HttpException({
                status: error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: error.message || 'Failed to update carbon footprint',
            }, error.status || common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
    async getUploads(userId) {
        try {
            return await this.uploadService.getUploadedFiles(userId);
        }
        catch (error) {
            throw new common_1.HttpException({
                status: common_1.HttpStatus.INTERNAL_SERVER_ERROR,
                error: 'Failed to retrieve uploaded files',
            }, common_1.HttpStatus.INTERNAL_SERVER_ERROR);
        }
    }
};
__decorate([
    (0, common_1.Post)(),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileInterceptor)('image', {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads',
            filename: (req, file, cb) => {
                const randomName = Array(32)
                    .fill(0)
                    .map(() => Math.floor(Math.random() * 16).toString(16))
                    .join('');
                return cb(null, `${randomName}${(0, path_1.extname)(file.originalname)}`);
            }
        }),
        limits: {
            fileSize: 5 * 1024 * 1024,
        },
    })),
    __param(0, (0, common_1.UploadedFile)()),
    __param(1, (0, common_1.Body)('user_id')),
    __param(2, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, String, Object]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "uploadFile", null);
__decorate([
    (0, common_1.Get)('eco-progress/:userId'),
    __param(0, (0, common_1.Param)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getEcoProgress", null);
__decorate([
    (0, common_1.Put)(':id/carbon-footprint'),
    __param(0, (0, common_1.Param)('id')),
    __param(1, (0, common_1.Body)('carbonFootprint')),
    __param(2, (0, common_1.Body)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String, Number, String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "updateCarbonFootprint", null);
__decorate([
    (0, common_1.Get)(),
    __param(0, (0, common_1.Query)('userId')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], UploadController.prototype, "getUploads", null);
UploadController = __decorate([
    (0, common_1.Controller)('upload'),
    __metadata("design:paramtypes", [upload_service_1.UploadService])
], UploadController);
exports.UploadController = UploadController;
//# sourceMappingURL=upload.controller.js.map