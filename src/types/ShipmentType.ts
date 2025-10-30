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

<<<<<<< Updated upstream
=======
export interface CreateShipmentRequest {
    shopOrderIds: string[],
    addressId: string,
    note: string,
    pickupDate: string,
}

export interface BaseCreateShipmentRequest {
    note: string,
    pickupDate: string,
}

// myshop get list shipping


export interface MyShopShippingListResponse {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    orderItemDtoSet: ShippingItems[];
}


export type ShippingItems = {
    shopOrderId: string;
    countOrderItems: number;
    createdAt?: string;

    customerId: string;
    customerName: string;
    customerPhone: string;

    shippingId: string;
    shippingMethod: string;
    shippingStatus: string;
    dayPickup?: string;

    confirmationTime: string;
    isPrinted: boolean;
}

// history

export type HistoryShipping = {
    id: string;
    status: ShippingStatus;
    notes: HistoryShippingNote[];
}

export type HistoryShippingNote = {
    content: string;
    timestamp: Date | string;
}


export type CheckoutShippingFee = {
    userAddressId: string;
    checkoutItems: Record<string, number>;
}
>>>>>>> Stashed changes
