import type { ShopDto } from "./ShopType";

export interface CartDto {
    shop: ShopDto;
    items: CartItemDto[];
}

export interface CartItemDto {
    id?: string;
    productSkuId: string;
    productName?: string;
    thumbnailUrl?: string;
    quantity: number;
    price?: number;
    attributeString?: string;
}