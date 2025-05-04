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
exports.ProductService = void 0;
const common_1 = require("@nestjs/common");
const mongoose_1 = require("@nestjs/mongoose");
const mongoose_2 = require("mongoose");
const product_schema_1 = require("./product.schema");
const axios_1 = require("axios");
const child_process_1 = require("child_process");
const util_1 = require("util");
const execAsync = (0, util_1.promisify)(child_process_1.exec);
let ProductService = class ProductService {
    constructor(productModel) {
        this.productModel = productModel;
    }
    async fetchAndCacheProducts() {
        return [];
    }
    async importProductsFromScript() {
        try {
            const { stdout, stderr } = await execAsync('python openfood_products.py');
            if (stderr) {
                console.error('❌ Erreur script :', stderr);
                return { success: false, error: stderr };
            }
            return { success: true, message: 'Importation réussie', output: stdout };
        }
        catch (error) {
            console.error('❌ Exception Python:', error.message);
            return { success: false, error: error.message };
        }
    }
    async getProductsAvailableInTunisia() {
        return this.productModel.find({ countries: /Tunisia/i }).exec();
    }
    async scanAndSaveProduct(code) {
        try {
            const existing = await this.productModel.findOne({ code });
            if (existing) {
                return { product: existing };
            }
            const url = `https://world.openfoodfacts.org/api/v0/product/${code}.json`;
            const response = await axios_1.default.get(url);
            if (!response.data || !response.data.product) {
                throw new Error('Produit introuvable');
            }
            const p = response.data.product;
            const newProduct = new this.productModel({
                code: p.code,
                productName: p.product_name || 'Inconnu',
                brands: p.brands || 'Non spécifié',
                categories: p.categories || 'Non spécifié',
                imageUrl: p.image_url || '',
                carbonImpact: p.ecoscore_data?.agribalyse?.co2_total || 0,
                ingredients: p.ingredients_text || '',
                recyclability: p.packaging || 'Non spécifié',
                countries: p.countries || '',
                source: 'scan',
            });
            await newProduct.save();
            return { product: newProduct };
        }
        catch (error) {
            console.error('Erreur lors du scan :', error.message);
            throw new Error('Echec du scan du produit');
        }
    }
    async saveOrUpdateProduct(productData) {
        const existing = await this.productModel.findOne({ code: productData.code });
        if (existing)
            return existing;
        const created = new this.productModel(productData);
        return created.save();
    }
    async getScannedProducts() {
        return this.productModel.find().sort({ createdAt: -1 }).exec();
    }
    async searchProductsInTunisia(term) {
        return this.productModel.find({
            countries: { $regex: 'tunisia', $options: 'i' },
            $or: [
                { productName: { $regex: term, $options: 'i' } },
                { brands: { $regex: term, $options: 'i' } },
                { categories: { $regex: term, $options: 'i' } }
            ]
        }).exec();
    }
    async getAllProducts() {
        return this.productModel.find().exec();
    }
    async updateBasicInfo(code, productName, brands, quantity, ingredients) {
        const product = await this.productModel.findOne({ code });
        if (!product) {
            throw new Error('Produit non trouvé pour mise à jour');
        }
        product.productName = productName || product.productName;
        product.brands = brands || product.brands;
        product.ingredients = ingredients || product.ingredients;
        if (quantity) {
            product.categories = `${product.categories} - ${quantity}`;
        }
        await product.save();
        return { success: true, message: 'Produit mis à jour', product };
    }
};
ProductService = __decorate([
    (0, common_1.Injectable)(),
    __param(0, (0, mongoose_1.InjectModel)(product_schema_1.Product.name)),
    __metadata("design:paramtypes", [mongoose_2.Model])
], ProductService);
exports.ProductService = ProductService;
//# sourceMappingURL=product.service.js.map