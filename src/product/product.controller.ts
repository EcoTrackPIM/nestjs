import { Controller, Get, Post, Body, Param } from '@nestjs/common';
import { ProductService } from './product.service';
import { Product } from './product.schema';
import { CreateProductDto } from './product.dto'; // Ajoute cet import si nécessaire
import { UploadedFiles, UseInterceptors } from '@nestjs/common';
import { FilesInterceptor } from '@nestjs/platform-express';
@Controller('products')
export class ProductController {
  constructor(private readonly productService: ProductService) {}

  @Get('cache-products')
  async cacheProducts() {
    return this.productService.fetchAndCacheProducts();
  }

  @Get()
  async getAllProducts() {
    return this.productService.getAllProducts();
  }

  @Get('in-tunisia')
  async getProductsInTunisia() {
    return this.productService.getProductsAvailableInTunisia();
  }

  @Post('scan')
  async scanProduct(@Body('code') code: string) {
    return this.productService.scanAndSaveProduct(code);
  }
  
  @Post()
  async createProduct(@Body() product: Product) {
    console.log('🔍 Produit reçu :', product);
    return this.productService.saveOrUpdateProduct(product);
  }

  @Get('scanned')
  async getScannedProducts() {
    return this.productService.getScannedProducts();
  }

  @Get('search/:term')
  async searchInTunisia(@Param('term') term: string) {
    console.log('🔍 Recherche de :', term);
    return this.productService.searchProductsInTunisia(term);
  }

  @Get('import-from-api')
  async importProductsFromScript() {
    return this.productService.importProductsFromScript();
  }

  @Post('basic-info')
async addBasicInfo(@Body() body: any) {
  const { code, productName, brands, quantity, ingredients } = body;
  return this.productService.updateBasicInfo(code, productName, brands, quantity, ingredients);
}
@Post('upload-photos')
@UseInterceptors(FilesInterceptor('files'))
async uploadPhotos(@UploadedFiles() files: Array<Express.Multer.File>) {
  console.log('📸 Photos reçues:', files.length);
  return { success: true, message: `${files.length} photos uploadées` };
}

}
