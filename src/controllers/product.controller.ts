// src/controllers/product.controller.ts
import { Controller, Route, Body, Post, Response, Middlewares } from "tsoa";
import { ProductCreateRequest } from "@/controllers/types/product-request.type";
import { ProductResponse } from "@/controllers/types/user-response.type";
import ProductService from "@/services/product.service";
import validateRequest from "@/middlewares/validate-input";
import { productCreateSchema } from "";
@Route("v1/products")
export class ProductController extends Controller {
  @Post()
  @Response(201, "Created Success")
  @Middlewares(validateRequest(productCreateSchema))
  public async createItem(
    @Body() reqBody: ProductCreateRequest
  ): Promise<ProductResponse> {
    try {
      const newProduct = await ProductService.createProduct(reqBody);
      return {
        message: "success",
        data: {
          name: newProduct.name,
          price: newProduct.price,
          category: newProduct.category,
          stock: newProduct.stock,
        },
      };
    } catch (error) {
      throw error;
    }
  }
}
