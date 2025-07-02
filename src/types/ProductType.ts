import type { ProductAttribute } from "./AttributeType";
import type { MediaDto } from "./CommonType";

export interface ProductCreateRequest {
  name: string;
  description: string;
  sortDescription: string;
  price: number;
  discountPrice: number;
  quantity: number;
  categoryId: string;
  weight: number;
  height: number;
  length: number;
  width: number;
  attributes: ProductAttribute[];
  productSkus: ProductSkuRequest[];
  media: MediaDto[];
}
 
export interface ProductSkuRequest {
  sku: string;
  price: number;
  quantity: number;
  imageUrl: string;
  attributes: ProductAttribute[];
}


