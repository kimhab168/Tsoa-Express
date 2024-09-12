// src/services/product.service.ts
import { ProductCreateRequest } from "@/controllers/types/product-request.type";
import { ProductType } from "@/database/models/products";
import ProductRepository from "@/database/repositories/product.repository";

export class ProductService {
  public async createProduct(
    productRequest: ProductCreateRequest
  ): Promise<ProductType> {
    try {
      const newProduct = await ProductRepository.createProduct(productRequest);
      return newProduct;
    } catch (error) {
      console.log(`ProductService - createProduct() method error: ${error}`);
      throw error;
    }
  }
}

export default new ProductService();
