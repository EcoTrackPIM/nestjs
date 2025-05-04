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
exports.ProductController = void 0;
const common_1 = require("@nestjs/common");
const product_service_1 = require("./product.service");
const product_schema_1 = require("./product.schema");
const common_2 = require("@nestjs/common");
const platform_express_1 = require("@nestjs/platform-express");
let ProductController = class ProductController {
    constructor(productService) {
        this.productService = productService;
    }
    async cacheProducts() {
        return this.productService.fetchAndCacheProducts();
    }
    async getAllProducts() {
        return this.productService.getAllProducts();
    }
    async getProductsInTunisia() {
        return this.productService.getProductsAvailableInTunisia();
    }
    async scanProduct(code) {
        return this.productService.scanAndSaveProduct(code);
    }
    async createProduct(product) {
        console.log('🔍 Produit reçu :', product);
        return this.productService.saveOrUpdateProduct(product);
    }
    async getScannedProducts() {
        return this.productService.getScannedProducts();
    }
    async searchInTunisia(term) {
        console.log('🔍 Recherche de :', term);
        return this.productService.searchProductsInTunisia(term);
    }
    async importProductsFromScript() {
        return this.productService.importProductsFromScript();
    }
    async addBasicInfo(body) {
        const { code, productName, brands, quantity, ingredients } = body;
        return this.productService.updateBasicInfo(code, productName, brands, quantity, ingredients);
    }
    async uploadPhotos(files) {
        console.log('📸 Photos reçues:', files.length);
        return { success: true, message: `${files.length} photos uploadées` };
    }
};
__decorate([
    (0, common_1.Get)('cache-products'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "cacheProducts", null);
__decorate([
    (0, common_1.Get)(),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getAllProducts", null);
__decorate([
    (0, common_1.Get)('in-tunisia'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getProductsInTunisia", null);
__decorate([
    (0, common_1.Post)('scan'),
    __param(0, (0, common_1.Body)('code')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "scanProduct", null);
__decorate([
    (0, common_1.Post)(),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [product_schema_1.Product]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "createProduct", null);
__decorate([
    (0, common_1.Get)('scanned'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "getScannedProducts", null);
__decorate([
    (0, common_1.Get)('search/:term'),
    __param(0, (0, common_1.Param)('term')),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [String]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "searchInTunisia", null);
__decorate([
    (0, common_1.Get)('import-from-api'),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", []),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "importProductsFromScript", null);
__decorate([
    (0, common_1.Post)('basic-info'),
    __param(0, (0, common_1.Body)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Object]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "addBasicInfo", null);
__decorate([
    (0, common_1.Post)('upload-photos'),
    (0, common_2.UseInterceptors)((0, platform_express_1.FilesInterceptor)('files')),
    __param(0, (0, common_2.UploadedFiles)()),
    __metadata("design:type", Function),
    __metadata("design:paramtypes", [Array]),
    __metadata("design:returntype", Promise)
], ProductController.prototype, "uploadPhotos", null);
ProductController = __decorate([
    (0, common_1.Controller)('products'),
    __metadata("design:paramtypes", [product_service_1.ProductService])
], ProductController);
exports.ProductController = ProductController;
//# sourceMappingURL=product.controller.js.map