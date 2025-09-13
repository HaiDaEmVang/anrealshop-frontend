export type OrderStatus = 'ALL'| 'COMPLETED' | 'PROCESSING' | 'PENDING_CONFIRMATION' | 'PREPARING' | 'AWAITING_SHIPMENT' | 'IN_TRANSIT' | 'OUT_FOR_DELIVERY' | 'DELIVERED' | 'REFUND' | 'CANCELED';

export type ShopOrderStatus = 'INIT_PROCESSING' | 'PENDING_CONFIRMATION' | 'PREPARING' | 'SHIPPING' | 'DELIVERED' | 'CLOSED';

export interface OrderStatusDto {
  id: string;
  name: string;
  count: number;
}

export interface ProductOrderItemDto {
    orderItemId: string;
    productId: string;
    productSkuId: string;
    productName: string;
    productImage: string;
    variant: string;
    quantity: number;
    price: number;
    orderStatus: string;

    submitConfirmDate?: string;
 
    cancelReason: string;
    isReviewed: boolean;
} 

export interface OrderItemDto {
  shopOrderId: string;
  orderStatus: ShopOrderStatus[];
  paymentMethod: string;
  customerName: string;
  customerImage: string;
  shippingMethod: string;
  shippingId: string;

  productOrderItemDtoSet: ProductOrderItemDto[];

}



export interface MyShopOrderListResponse {
    totalCount: number;
    totalPages: number;
    currentPage: number;
    orderItemDtoSet: OrderItemDto[];
}


// approve / reject
export interface OrderRejectRequest {
  ids: string[];
  reason: string;
}


// orderDetails

export interface HistoryTrackDto {
  id: string;
  status: OrderStatus;
  title: string;
  timestamp: Date;
}


export interface ShippingOrderItemDto {
  id: string;
  shippingId: string;
  shippingMethod: string;
  shippingBrand: string;

  shipperName: string;
  shipperPhone: string;


  productImage: string;
  productName: string;
  productQuantity: number;

  shippingHistory: HistoryTrackDto[];

}

export interface OrderDetailDto {
  orderId: string;
  orderStatus: OrderStatus;
  orderHistory: HistoryTrackDto[];
  items: ShippingOrderItemDto[];

  totalProductCost: number;
  totalShippingCost: number;
  shippingFee: number;
  shippingDiscount: number;

  FixedFeeRate: number;
  serviceFeeRate: number;
  PaymentFeeRate: number;

  revenue: number;

  customerName: string;
  customerPhone: string;
  customerAddress: string;

  isReviewed: boolean;

}