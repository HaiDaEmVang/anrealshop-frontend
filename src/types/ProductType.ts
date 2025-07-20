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


export interface MyShopProductListResponse {
  totalCount: number;
  totalPages: number;
  currentPage: number;
  products: MyShopProductDto[];
}

export interface MyShopProductDto {
  id: string;
  name: string;
  thumbnailUrl: string;
  urlSlug: string;
  categoryId: string;
  discountPrice: number;
  quantity: number;
  sold: number;
  status: ProductStatus;
  visible: boolean;
  createdAt: string;
  productSkus?: MyShopProductSkuDto[];
}

export type ProductStatus = 'ALL' | 'ACTIVE' | 'VIOLATION' | 'PENDING' | 'HIDDEN';

export interface ProductStatusDto {
  id: string;
  name: string;
  count: number;
}

export interface MyShopProductSkuDto {
  id: string;
  sku: string;
  imageUrl: string;
  price: number;
  quantity: number;
  sold: number;
  createdAt: string;
}
