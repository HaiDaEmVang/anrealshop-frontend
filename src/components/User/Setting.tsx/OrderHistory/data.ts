import type { ShopOrder } from "./ShopOrderItem";

// Mock data for shop orders
export const mockShopOrders: ShopOrder[] = [
    {
        id: 'ORD-12345',
        shopName: 'Fashion Store VN',
        shopId: 'shop-001',
        date: '2023-06-15',
        status: 'completed',
        products: [
            {
                id: 'p1',
                name: 'Áo Thun Unisex Cotton Basic Form Rộng',
                image: 'https://picsum.photos/id/26/300/400',
                brand: 'Local Brand',
                category: 'Áo thun',
                size: 'M',
                color: 'Đen',
                quantity: 1,
                isReviewed: true,
                rating: 5
            },
            {
                id: 'p2',
                name: 'Quần Short Kaki Nam Basic',
                image: 'https://picsum.photos/id/16/300/400',
                brand: 'Local Brand',
                category: 'Quần',
                size: 'L',
                color: 'Nâu',
                quantity: 2,
                isReviewed: false
            }
        ],
        totalPrice: 450000,
        shippingFee: 30000,
        total: 480000,
        paymentMethod: 'COD'
    },
    {
        id: 'ORD-12346',
        shopName: 'Levi\'s Official Store',
        shopId: 'shop-002',
        date: '2023-06-10',
        status: 'processing',
        products: [
            {
                id: 'p3',
                name: 'Quần Jean Nam Slimfit',
                image: 'https://picsum.photos/id/21/300/400',
                brand: 'Levi\'s',
                category: 'Quần jean',
                size: '32',
                color: 'Xanh đậm',
                quantity: 1
            }
        ],
        totalPrice: 500000,
        shippingFee: 0,
        total: 500000,
        paymentMethod: 'Thẻ tín dụng'
    },
    {
        id: 'ORD-12347',
        shopName: 'Nike Vietnam',
        shopId: 'shop-003',
        date: '2023-05-28',
        status: 'shipping',
        products: [
            {
                id: 'p4',
                name: 'Giày Sneaker Nike Air Force 1',
                image: 'https://picsum.photos/id/15/300/400',
                brand: 'Nike',
                category: 'Giày sneaker',
                size: '42',
                color: 'Trắng',
                quantity: 1
            }
        ],
        totalPrice: 2800000,
        shippingFee: 50000,
        total: 2850000,
        paymentMethod: 'Chuyển khoản'
    },
    {
        id: 'ORD-12348',
        shopName: 'Zara Fashion House',
        shopId: 'shop-004',
        date: '2023-05-15',
        status: 'cancelled',
        products: [
            {
                id: 'p5',
                name: 'Đầm Maxi Hoa Nhí Nữ',
                image: 'https://picsum.photos/id/90/300/400',
                brand: 'Zara',
                category: 'Đầm',
                size: 'S',
                color: 'Hoa nhí',
                quantity: 2
            },
            {
                id: 'p6',
                name: 'Áo Sơ Mi Nữ Voan Tay Bồng',
                image: 'https://picsum.photos/id/65/300/400',
                brand: 'Zara',
                category: 'Áo',
                size: 'M',
                color: 'Trắng',
                quantity: 1
            }
        ],
        totalPrice: 850000,
        shippingFee: 30000,
        total: 880000,
        paymentMethod: 'MoMo'
    },
    {
        id: 'ORD-12349',
        shopName: 'Uniqlo Store',
        shopId: 'shop-005',
        date: '2023-06-01',
        status: 'pending',
        products: [
            {
                id: 'p7',
                name: 'Áo Hoodie Nỉ Nam Oversize',
                image: 'https://picsum.photos/id/28/300/400',
                brand: 'Uniqlo',
                category: 'Áo hoodie',
                size: 'L',
                color: 'Xám',
                quantity: 1
            }
        ],
        totalPrice: 750000,
        shippingFee: 30000,
        total: 780000,
        paymentMethod: 'COD'
    }
];