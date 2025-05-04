import { Injectable } from '@nestjs/common';
import { InjectModel } from '@nestjs/mongoose';
import { Model } from 'mongoose';
import { Product, ProductDocument } from './product.schema';
import axios from 'axios';
import { exec } from 'child_process';
import { promisify } from 'util';
const execAsync = promisify(exec);

@Injectable()
export class ProductService {
  constructor(@InjectModel(Product.name) private productModel: Model<ProductDocument>) {}

  async fetchAndCacheProducts() {
    // Récupération classique depuis OpenFoodFacts (déjà codée)
    return [];
  }
  async importProductsFromScript(): Promise<any> {
    try {
      const { stdout, stderr } = await execAsync('python openfood_products.py');
      if (stderr) {
        console.error('❌ Erreur script :', stderr);
        return { success: false, error: stderr };
      }
      return { success: true, message: 'Importation réussie', output: stdout };
    } catch (error) {
      console.error('❌ Exception Python:', error.message);
      return { success: false, error: error.message };
    }
  }
  async getProductsAvailableInTunisia(): Promise<Product[]> {
    return this.productModel.find({ countries: /Tunisia/i }).exec();
  }

  // ✅ AJOUTÉ
async scanAndSaveProduct(code: string): Promise<any> {
  try {
    // ✅ Vérifie si le produit existe déjà
    const existing = await this.productModel.findOne({ code });
    if (existing) {
      return { product: existing }; // ✅ Retourne le produit sans appel API
    }

    // ✅ Appel à OpenFoodFacts
    const url = `https://world.openfoodfacts.org/api/v0/product/${code}.json`;
    const response = await axios.get(url);

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
      source: 'scan', // ✅ Sauvegarde de la source
    });

    await newProduct.save();

    return { product: newProduct }; // ✅ Réponse structurée
  } catch (error) {
    console.error('Erreur lors du scan :', error.message);
    throw new Error('Echec du scan du produit');
  }
}

  
  async saveOrUpdateProduct(productData: any): Promise<Product> {
    const existing = await this.productModel.findOne({ code: productData.code });
    if (existing) return existing;
  
    const created = new this.productModel(productData);
    return created.save();
  }
  // Afficher tous les produits enregistrés (scannés)
async getScannedProducts() {
  return this.productModel.find().sort({ createdAt: -1 }).exec();
}
async searchProductsInTunisia(term: string): Promise<Product[]> {
  return this.productModel.find({
    countries: { $regex: 'tunisia', $options: 'i' },
    $or: [
      { productName: { $regex: term, $options: 'i' } },
      { brands: { $regex: term, $options: 'i' } },
      { categories: { $regex: term, $options: 'i' } }
    ]
  }).exec();
}




async getAllProducts(): Promise<Product[]> {
  return this.productModel.find().exec();
}

async updateBasicInfo(
  code: string,
  productName: string,
  brands: string,
  quantity: string,
  ingredients: string,
): Promise<any> {
  const product = await this.productModel.findOne({ code });

  if (!product) {
    throw new Error('Produit non trouvé pour mise à jour');
  }

  product.productName = productName || product.productName;
  product.brands = brands || product.brands;
  product.ingredients = ingredients || product.ingredients;
  
  if (quantity) {
    product.categories = `${product.categories} - ${quantity}`; // Facultatif : concaténer la quantité dans catégorie
  }

  await product.save();
  return { success: true, message: 'Produit mis à jour', product };
}

}
