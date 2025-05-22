import { Product } from 'src/module/product/schemas/product.schema';

export interface resuletInterface {
  isDeleted: boolean;
  name: string;
  _id: string;
}
export interface productFilterResultInterface {
  data: Product[];
  total: number;
  page: number;
  limit: number;
}
