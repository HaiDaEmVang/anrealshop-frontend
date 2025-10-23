import type { OrderDetailDto, OrderStatusDto } from "../types/OrderType";

export const OrderStatusDefaultDataAdmin: OrderStatusDto[] = [
  {
    id: 'ALL',
    name: 'Tất cả',
    count: 0
  },
  {
    id: 'PENDING_CONFIRMATION',
    name: 'Chờ xác nhận',
    count: 0
  },
  {
    id: 'PREPARING',
    name: 'Đang chuẩn bị',
    count: 0
  },
  {
    id: 'SHIPPING',
    name: 'Đang vận chuyển',
    count: 0
  },
  {
    id: 'DELIVERED',
    name: 'Đã giao',
    count: 0
  },
  {
    id: 'CLOSED',
    name: 'Hủy/Hoàn/Trả',
    count: 0
  }
];

export const OrderStatusDefaultDataUser: OrderStatusDto[] = [
  {
    id: 'INIT_PROCESSING',
    name: 'Chờ xử lý',
    count: 0
  },
  {
    id: 'PENDING_CONFIRMATION',
    name: 'Chờ xác nhận',
    count: 0
  },
  {
    id: 'PREPARING',
    name: 'vận chuyển',
    count: 0
  },
  {
    id: 'SHIPPING',
    name: 'Chờ nhận hàng',
    count: 0
  },
  {
    id: 'DELIVERED',
    name: 'Hoàn thành',
    count: 0
  },
  {
    id: 'CANCELED',
    name: 'Hủy đơn',
    count: 0
  },
  {
    id: 'REFUND',
    name: 'Hoàn/Trả',
    count: 0
  }
];


export const SampleOrderDetail: OrderDetailDto = {
  orderId: "ORD12345",
  orderStatus: "IN_TRANSIT",
  orderHistory: [
    {
      id: "hist-1",
      status: "PENDING_CONFIRMATION",
      title: "Đơn hàng được tạo",
      timestamp: new Date("2023-11-10T08:30:00Z")
    },
    {
      id: "hist-2",
      status: "PREPARING",
      title: "Đơn hàng đã được xác nhận",
      timestamp: new Date("2023-11-10T09:15:00Z")
    },
    {
      id: "hist-3",
      status: "AWAITING_SHIPMENT",
      title: "Người bán đang chuẩn bị hàng",
      timestamp: new Date("2023-11-10T15:45:00Z")
    },
    {
      id: "hist-4",
      status: "IN_TRANSIT",
      title: "Đơn hàng đã được giao cho đơn vị vận chuyển",
      timestamp: new Date("2023-11-11T10:30:00Z")
    }
  ],
  items: [
    {
      id: "item-1",
      shippingId: "GHN12345",
      shippingMethod: "Giao hàng nhanh",
      shippingBrand: "Giao Hàng Nhanh",
      shipperName: "Nguyễn Văn Đức",
      shipperPhone: "0987654321",
      productImage: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      productName: "Áo thun nam cotton cổ tròn basic",
      productQuantity: 2,
      shippingHistory: [
        {
          id: "ship-1",
          status: "AWAITING_SHIPMENT",
          title: "Đơn vị vận chuyển đã lấy hàng",
          timestamp: new Date("2023-11-11T10:30:00Z")
        },
        {
          id: "ship-2",
          status: "IN_TRANSIT",
          title: "Đơn hàng đang được vận chuyển đến kho phân loại",
          timestamp: new Date("2023-11-11T14:15:00Z")
        },
        {
          id: "ship-3",
          status: "IN_TRANSIT",
          title: "Đơn hàng đã đến kho trung chuyển Đà Nẵng",
          timestamp: new Date("2023-11-11T21:30:00Z")
        }
      ]
    },
    {
      id: "item-2",
      shippingId: "GHN12345", // Same shipping ID indicates same package
      shippingMethod: "Giao hàng nhanh",
      shippingBrand: "Giao Hàng Nhanh",
      shipperName: "Nguyễn Văn Đức",
      shipperPhone: "0987654321",
      productImage: "https://images.unsplash.com/photo-1542272604-787c3835535d?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      productName: "Quần jean nam dáng Regular fit",
      productQuantity: 1,
      shippingHistory: [
        {
          id: "ship-1",
          status: "AWAITING_SHIPMENT",
          title: "Đơn vị vận chuyển đã lấy hàng",
          timestamp: new Date("2023-11-11T10:30:00Z")
        },
        {
          id: "ship-2",
          status: "IN_TRANSIT",
          title: "Đơn hàng đang được vận chuyển đến kho phân loại",
          timestamp: new Date("2023-11-11T14:15:00Z")
        },
        {
          id: "ship-3",
          status: "IN_TRANSIT",
          title: "Đơn hàng đã đến kho trung chuyển Đà Nẵng",
          timestamp: new Date("2023-11-11T21:30:00Z")
        }
      ]
    },
    {
      id: "item-3",
      shippingId: "GHTK6789",  // Different shipping ID indicates separate package
      shippingMethod: "Giao hàng tiết kiệm",
      shippingBrand: "Giao Hàng Tiết Kiệm",
      shipperName: "Trần Văn Minh",
      shipperPhone: "0912345678",
      productImage: "https://images.unsplash.com/photo-1593642632823-8f785ba67e45?ixlib=rb-1.2.1&auto=format&fit=crop&w=500&q=80",
      productName: "Ốp lưng điện thoại iPhone 14 Pro",
      productQuantity: 1,
      shippingHistory: [
        {
          id: "ship-4",
          status: "AWAITING_SHIPMENT",
          title: "Đơn vị vận chuyển đã lấy hàng",
          timestamp: new Date("2023-11-11T10:45:00Z")
        },
        {
          id: "ship-5",
          status: "IN_TRANSIT",
          title: "Đơn hàng đang được vận chuyển đến kho phân loại",
          timestamp: new Date("2023-11-11T15:30:00Z")
        },
        {
          id: "ship-6",
          status: "IN_TRANSIT",
          title: "Đơn hàng đã đến kho trung chuyển Hồ Chí Minh",
          timestamp: new Date("2023-11-11T22:15:00Z")
        }
      ]
    }
  ],
  totalProductCost: 1150000,
  totalShippingCost: 45000,
  shippingFee: 50000,
  shippingDiscount: 5000,

  FixedFeeRate: 3.0,
  serviceFeeRate: 6.0,
  PaymentFeeRate: 2.5,

  revenue: 1057500,

  customerName: "Nguyễn Văn Hiệp",
  customerPhone: "+84366420659",
  customerAddress: "123 Nguyễn Huệ, Phường Bến Nghé, Quận 1, TP.HCM",

  isReviewed: false
};