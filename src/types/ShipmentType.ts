import type { CartItemDto } from "./CartType";
import type { ShopDto } from "./ShopType";

export interface CartShippingFee {
    shopId: string;
    fee: number;
    leadTime: string;
    isSuccess: boolean;
    serviceName: string;
}

export interface CheckoutInfoDto {
    shop: ShopDto;
    items: CartItemDto[];
    fee: number;
    leadTime: string;
    isSuccess: boolean;
    serviceName: string;
}

export type PaymentMethodId = 'cod' | 'bank_transfer' | 'zalopay' | 'momo' | 'vnpay';

