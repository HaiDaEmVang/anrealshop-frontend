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