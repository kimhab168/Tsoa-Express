import { Controller, Route, Get } from "tsoa";

export interface IItem {
  name: string;
  category: string;
  price: number;
}

@Route("/v1/products")
export class ProductController extends Controller {
  @Get("/")
  public getAllProducts(): Promise<IItem[]> {
    return Promise.resolve([
      { name: "Cherrie", category: "fruit", price: 10.2 },
    ]);
  }
}
