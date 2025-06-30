import type { AttributeRequest } from "./AttributeType";
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
  attributes: AttributeRequest[];
  productSkus: ProductSkuRequest[];
  media: MediaDto[];
}

export interface ProductSkuRequest {
  sku: string;
  price: number;
  quantity: number;
  imageUrl: string;
  attributes: ProductSkuAttribute[];
}

export interface ProductSkuAttribute {
  attributeKeyName: string;
  value: string;
}

