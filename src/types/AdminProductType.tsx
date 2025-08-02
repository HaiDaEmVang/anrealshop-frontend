export interface Category {
    id: string;
    name: string;
    description?: string;
    parentId?: string;
}

export interface ProductMedia {
    id: string;
    type: 'IMAGE' | 'VIDEO';
    url: string;
}

export interface ProductVariant {
    id: string;
    sku: string;
    price: number;
    quantity: number;
    attributes: Array<{
        key: string;
        value: string;
    }>;
}

export interface Product {
    id: string;
    name: string;
    shop: {
        id: string;
        name: string;
        avatarUrl?: string;
    };
    category: Category;
    price: number;
    images: string[];
    media: ProductMedia[];
    description: string;
    createdAt: string;
    status: 'pending' | 'approved' | 'rejected';
    reviewNote?: string;
    quantity: number;
    weight: number;
    location?: string;
    sold?: number;
    averageRating?: number;
    totalReviews?: number;
    variants?: ProductVariant[];
    visible: boolean;
    restrictedReason?: string;
}

export const mockProducts: Product[] = [
                {
                    id: 'PRD001',
                    name: 'Áo thun nam basic',
                    shop: { 
                        id: 'SHP001', 
                        name: 'Fashion Store',
                        avatarUrl: 'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?q=80&w=100'
                    },
                    category: { id: 'CAT001', name: 'Thời trang nam' },
                    price: 199000,
                    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=100'],
                    media: [
                        { id: 'M001', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=100' },
                        { id: 'M002', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1583743814966-8936f5b7be1a?q=80&w=100' },
                    ],
                    description: 'Áo thun nam basic chất liệu cotton 100%, thiết kế đơn giản, phù hợp với nhiều phong cách.',
                    createdAt: '2023-05-15T08:30:00Z',
                    status: 'pending',
                    quantity: 150,
                    weight: 200,
                    location: 'Việt Nam',
                    sold: 0,
                    averageRating: 0,
                    totalReviews: 0,
                    visible: true,
                    variants: [
                        {
                            id: 'V001',
                            sku: 'ATNAM-S-W',
                            price: 199000,
                            quantity: 50,
                            attributes: [
                                { key: 'Size', value: 'S' },
                                { key: 'Color', value: 'White' }
                            ]
                        },
                        {
                            id: 'V002',
                            sku: 'ATNAM-M-W',
                            price: 199000,
                            quantity: 50,
                            attributes: [
                                { key: 'Size', value: 'M' },
                                { key: 'Color', value: 'White' }
                            ]
                        },
                        {
                            id: 'V003',
                            sku: 'ATNAM-L-W',
                            price: 199000,
                            quantity: 50,
                            attributes: [
                                { key: 'Size', value: 'L' },
                                { key: 'Color', value: 'White' }
                            ]
                        }
                    ]
                },
                {
                    id: 'PRD002',
                    name: 'Giày thể thao nữ',
                    shop: { 
                        id: 'SHP002', 
                        name: 'Sportland',
                        avatarUrl: 'https://images.unsplash.com/photo-1517836357463-d25dfeac3438?q=80&w=100'
                    },
                    category: { id: 'CAT002', name: 'Giày dép' },
                    price: 450000,
                    images: [
                        'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=100',
                        'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=100'
                    ],
                    media: [
                        { id: 'M003', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1595950653106-6c9ebd614d3a?q=80&w=100' },
                        { id: 'M004', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1560769629-975ec94e6a86?q=80&w=100' },
                        { id: 'M005', type: 'VIDEO', url: 'https://example.com/video.mp4' },
                    ],
                    description: 'Giày thể thao nữ thoáng khí, nhẹ, phù hợp đi chơi, tập thể thao.',
                    createdAt: '2023-05-16T10:15:00Z',
                    status: 'pending',
                    quantity: 100,
                    weight: 600,
                    location: 'Trung Quốc',
                    sold: 0,
                    averageRating: 0,
                    totalReviews: 0,
                    visible: true,
                    variants: [
                        {
                            id: 'V004',
                            sku: 'GIAYTTN-37-W',
                            price: 450000,
                            quantity: 25,
                            attributes: [
                                { key: 'Size', value: '37' },
                                { key: 'Color', value: 'White' }
                            ]
                        },
                        {
                            id: 'V005',
                            sku: 'GIAYTTN-38-W',
                            price: 450000,
                            quantity: 25,
                            attributes: [
                                { key: 'Size', value: '38' },
                                { key: 'Color', value: 'White' }
                            ]
                        },
                        {
                            id: 'V006',
                            sku: 'GIAYTTN-39-W',
                            price: 450000,
                            quantity: 25,
                            attributes: [
                                { key: 'Size', value: '39' },
                                { key: 'Color', value: 'White' }
                            ]
                        },
                        {
                            id: 'V007',
                            sku: 'GIAYTTN-40-W',
                            price: 450000,
                            quantity: 25,
                            attributes: [
                                { key: 'Size', value: '40' },
                                { key: 'Color', value: 'White' }
                            ]
                        }
                    ]
                },
                {
                    id: 'PRD003',
                    name: 'Túi xách nữ thời trang',
                    shop: { 
                        id: 'SHP003', 
                        name: 'Accessories World',
                        avatarUrl: 'https://images.unsplash.com/photo-1491933382434-500287f9b54b?q=80&w=100'
                    },
                    category: { id: 'CAT003', name: 'Phụ kiện' },
                    price: 350000,
                    images: ['https://images.unsplash.com/photo-1591561954555-607968c989ab?q=80&w=100'],
                    media: [
                        { id: 'M006', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1591561954555-607968c989ab?q=80&w=100' },
                    ],
                    description: 'Túi xách nữ thời trang, chất liệu da PU cao cấp, có nhiều ngăn đựng đồ.',
                    createdAt: '2023-05-17T09:45:00Z',
                    status: 'approved',
                    reviewNote: 'Sản phẩm đạt chuẩn, hình ảnh rõ nét.',
                    quantity: 80,
                    weight: 450,
                    location: 'Hàn Quốc',
                    sold: 15,
                    averageRating: 4.7,
                    totalReviews: 8,
                    visible: true,
                    variants: []
                },
                {
                    id: 'PRD004',
                    name: 'Áo khoác dù nam',
                    shop: { 
                        id: 'SHP001', 
                        name: 'Fashion Store',
                        avatarUrl: 'https://images.unsplash.com/photo-1507914372368-b2b085b925a1?q=80&w=100'
                    },
                    category: { id: 'CAT001', name: 'Thời trang nam' },
                    price: 550000,
                    images: ['https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=100'],
                    media: [
                        { id: 'M007', type: 'IMAGE', url: 'https://images.unsplash.com/photo-1591047139829-d91aecb6caea?q=80&w=100' },
                    ],
                    description: 'Áo khoác dù nam chống thấm nước, giữ ấm tốt trong thời tiết se lạnh.',
                    createdAt: '2023-05-18T14:20:00Z',
                    status: 'rejected',
                    reviewNote: 'Hình ảnh không rõ nét, thiếu thông tin kích thước.',
                    quantity: 0,
                    weight: 700,
                    location: 'Việt Nam',
                    sold: 0,
                    averageRating: 0,
                    totalReviews: 0,
                    visible: false,
                    restrictedReason: 'Hình ảnh mờ, không đạt tiêu chuẩn'
                },
            ];