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
exports.PhotosController = void 0;
const common_1 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
const multer_1 = require("multer");
const uuid_1 = require("uuid");
const path = require("path");
const photo_service_1 = require("./photo.service");
let PhotosController = class PhotosController {
    constructor(photoService) {
        this.photoService = photoService;
    }
    async uploadFiles(files, types) {
        console.log('✅ Photos reçues :', files?.files?.length);
        console.log('📋 Types reçus :', types);
        if (!files.files || files.files.length === 0) {
            throw new Error('Aucun fichier reçu');
        }
        const photosToSave = files.files.map((file, index) => ({
            filename: file.filename,
            path: file.path,
            type: Array.isArray(types) ? types[index] : types,
        }));
        const savedPhotos = await this.photoService.savePhotos(photosToSave);
        return { success: true, data: savedPhotos };
    }
};
__decorate([
    (0, common_1.Post)('upload'),
    (0, common_1.UseInterceptors)((0, platform_express_1.FileFieldsInterceptor)([
        { name: 'files', maxCount: 10 },
    ], {
        storage: (0, multer_1.diskStorage)({
            destination: './uploads/photos',
            filename: (req, file, cb) => {
                const uniqueName = `${(0, uuid_1.v4)()}${path.extname(file.originalname)}`;
                cb(null, uniqueName);
            }
        }),
    })),
    __param(0, (0, common_1.UploadedFiles)()),
    __param(1, (0, common_1.Body)('types')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object, Array]),
    __metadata("design:returntype", Promise)
], PhotosController.prototype, "uploadFiles", null);
PhotosController = __decorate([
    (0, common_1.Controller)('photos'),
    __metadata("design:paramtypes", [photo_service_1.PhotoService])
], PhotosController);
exports.PhotosController = PhotosController;
//# sourceMappingURL=photos.controller.js.map