// import {
//   Body,
//   Controller,
//   Delete,
//   Get,
//   Path,
//   Post,
//   Put,
//   Route,
//   SuccessResponse,
// } from "tsoa";
import { ProductModel, ProductType } from "../models/products";
import {
  Controller,
  Route,
  Get,
  Path,
  Post,
  Body,
  Put,
  Delete,
  Response,
  Queries,
} from "tsoa";

export interface IItem {
  name: string;
  price: number;
  category: string;
  stock: number;
}
interface QueriesReqType {
  filter?: string;
  page?: number;
  limit?: number;
  sort?: string;
}
// interface ResType {
//   message: string;
//   data: ProductType[];
// }
interface PaginationType {
  message: string;
  data: ProductType[];
  currentPage: number;
  totalPage: number;
  limit: number;
  totalItem: number;
}
interface filterType {
  [key: string]: ProductType | { [key: string]: string };
}
interface sortType {
  [key: string]: 1 | -1;
}

@Route("/v1/products")
export class ProductController extends Controller {
  @Get("/")
  public async getAllProducts(
    @Queries() qry: QueriesReqType
  ): Promise<PaginationType> {
    try {
      //get Query from Route URL
      const page = qry.page ? qry.page : 1;
      const limit = qry.limit ? qry.limit : 5;
      const filter = qry.filter ? JSON.parse(qry.filter) : {};
      const sort = qry.sort ? JSON.parse(qry.sort) : {};
      const skip = (page - 1) * limit;

      //Convert query to mongoose
      //filter to query support in mongo
      const newFilter: filterType = {};
      for (let i in filter) {
        if (typeof filter[i] === "object") {
          newFilter[i] = {};
          for (let j in filter[i]) {
            if (j === "min") {
              newFilter[i]["$gte"] = filter[i][j];
            } else if (j === "max") {
              newFilter[i]["$lte"] = filter[i][j];
            }
          }
        } else {
          newFilter[i] = filter[i];
        }
      }
      //sort to mongo query sort
      const newSort: sortType = {};
      for (let i in sort) {
        newSort[i] = sort[i] === "asc" ? 1 : -1;
      }

      //Retreive data
      const products: ProductType[] = await ProductModel.find(newFilter)
        .sort(newSort)
        .skip(skip)
        .limit(limit)
        .exec();
      const totalItem = await ProductModel.countDocuments(newFilter);
      const totalPage = Math.ceil(totalItem / limit);
      return {
        message: "Products:",
        data: products,
        currentPage: page,
        totalPage: totalPage,
        limit: limit,
        totalItem: totalItem,
      };
    } catch (error) {
      this.setStatus(500);
      throw new Error("Error fetching products");
    }
  }
  @Get("{id}")
  public async getProductById(@Path() id: string): Promise<ProductType> {
    try {
      const product = await ProductModel.findById(id).exec();
      if (!product) {
        this.setStatus(404);
        throw new Error("No Product found!");
      }
      return product;
    } catch (error) {
      this.setStatus(500);
      throw new Error("Error fetching product");
    }
  }
  @Post("/")
  @Response(201, "Created Product")
  public async createProduct(
    @Body() reqBody: ProductType
  ): Promise<ProductType> {
    const newProduct = await new ProductModel(reqBody).save();
    return newProduct;
  }
  @Put("{id}")
  @Response(201, "Updated Product!")
  public async updateById(
    @Path() id: string,
    @Body() reqBody: ProductType
  ): Promise<ProductType> {
    const update = await ProductModel.findByIdAndUpdate(id, reqBody, {
      new: true,
    });
    if (!update) throw new Error("No Item Found!");
    return update;
  }
  @Delete("{id}")
  @Response(204, "Deleted Product!")
  public async deleteById(@Path() id: string): Promise<void> {
    try {
      await ProductModel.findByIdAndDelete(id).exec();
    } catch (err) {
      throw err;
    }
  }
}
