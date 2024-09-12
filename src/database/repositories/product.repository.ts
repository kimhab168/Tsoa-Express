// src/repositories/product.repository.ts
import ProductModel, { ProductType } from "@/database/models/products";
import { ProductCreateRequest } from "@/controllers/types/product-request.type";

class ProductRepository {
  public async createProduct(
    productRequest: ProductCreateRequest
  ): Promise<ProductType> {
    try {
      const newProduct = await ProductModel.create(productRequest);
      return newProduct;
    } catch (error) {
      throw error;
    }
  }
}

// Add more repository methods as needed
export default new ProductRepository();
