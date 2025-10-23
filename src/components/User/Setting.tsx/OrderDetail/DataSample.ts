import type { HistoryTrackDto, ProductOrderItemDto, UserOrderDetailDto } from '../../../../types/OrderType';
import type { SimpleAddressDto } from '../../../../types/AddressType';

// Sample history data
export const sampleHistoryData: HistoryTrackDto[] = [
    {
        id: '1',
        status: 'DELIVERED',
        title: 'Đã giao',
        timestamp: '2025-09-28T12:04:00',
    },
    {
        id: '2',
        status: 'IN_TRANSIT',
        title: 'Đang vận chuyển',
        timestamp: '2025-09-28T08:02:00',
    },
    {
        id: '3',
        status: 'IN_TRANSIT',
        title: 'Đang vận chuyển',
        timestamp: '2025-09-27T18:36:00',
    },
    {
        id: '4',
        status: 'IN_TRANSIT',
        title: 'Đang vận chuyển',
        timestamp: '2025-09-27T08:13:00',
    },
    {
        id: '5',
        status: 'IN_TRANSIT',
        title: 'Đang vận chuyển',
        timestamp: '2025-09-27T06:48:00',
    },
    {
        id: '6',
        status: 'PREPARING',
        title: 'Đang được chuẩn bị',
        timestamp: '2025-09-25T08:46:00',
    },
    {
        id: '7',
        status: 'PENDING_CONFIRMATION',
        title: 'Đặt hàng thành công',
        timestamp: '2025-09-24T17:03:00',
    }
];

// Sample product order items
export const sampleProductItems: ProductOrderItemDto[] = [
    {
        orderItemId: '1001',
        productId: 'prod-001',
        productSkuId: 'sku-001',
        productName: 'Áo Polo Kẻ Sọc Ngang Dễ Phối Đồ, Áo Polo Nam Nữ Tôn Dáng Chất Liệu Cotton Mát Mẻ Thoải Mái',
        productImage: 'https://via.placeholder.com/80',
        variant: 'Đen, L(55-65kg)',
        quantity: 1,
        price: 136000,
        orderStatus: 'DELIVERED',
        cancelReason: '',
        isReviewed: false
    },
    {
        orderItemId: '1002',
        productId: 'prod-002',
        productSkuId: 'sku-002',
        productName: 'Quần Short Kaki Nam Form Rộng Trẻ Trung, Phong Cách Đường Phố',
        productImage: 'https://via.placeholder.com/80',
        variant: 'Xám, XL(68-75kg)',
        quantity: 2,
        price: 95000,
        orderStatus: 'DELIVERED',
        cancelReason: '',
        isReviewed: true
    }
];

// Sample address data
export const sampleAddress: SimpleAddressDto = {
    id: 'addr-001',
    receiverOrSenderName: 'Le Hai',
    phoneNumber: '(+84) 941 780 045',
    detailAddress: 'Kí Túc Xá Trường Đại Học Spkt - Đh Đà Nẵng, Số 02, Thanh Sơn, Phường Thanh Bình, Quận Hải Châu, Đà Nẵng'
};

// Sample UserOrderDetailDto
export const sampleOrderDetail: UserOrderDetailDto = {
    shopOrderId: 'order-123456789',
    shopOrderStatus: 'DELIVERED',

    shopId: 'shop-001',
    shopName: 'DHShop.Fashion',
    shopImage: 'https://via.placeholder.com/40',

    orderHistory: sampleHistoryData,
    productItems: sampleProductItems,

    totalProductCost: 326000, // 136000 + (95000 * 2)
    totalShippingCost: 3000,
    shippingFee: 32700,
    shippingDiscount: -29700,

    totalCost: 3811, // After applying discounts

    isReviewed: false,

    // Added the address field
    address: sampleAddress
};

// Export a sample data with various status for testing
export const orderDetailSamples = {
    pending: {
        ...sampleOrderDetail,
        shopOrderId: 'order-pending',
        shopOrderStatus: 'PENDING_CONFIRMATION',
        orderHistory: sampleHistoryData.slice(6),
        isReviewed: false
    },
    preparing: {
        ...sampleOrderDetail,
        shopOrderId: 'order-preparing',
        shopOrderStatus: 'PREPARING',
        orderHistory: sampleHistoryData.slice(5),
        isReviewed: false
    },
    shipping: {
        ...sampleOrderDetail,
        shopOrderId: 'order-shipping',
        shopOrderStatus: 'IN_TRANSIT',
        orderHistory: sampleHistoryData.slice(1),
        isReviewed: false
    },
    delivered: {
        ...sampleOrderDetail,
        shopOrderId: 'order-delivered',
        shopOrderStatus: 'DELIVERED',
        isReviewed: false
    },
    reviewed: {
        ...sampleOrderDetail,
        shopOrderId: 'order-reviewed',
        shopOrderStatus: 'DELIVERED',
        isReviewed: true,
        productItems: sampleProductItems.map(item => ({ ...item, isReviewed: true }))
    }
};

export default sampleOrderDetail;
