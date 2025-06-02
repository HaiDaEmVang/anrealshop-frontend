
export interface Category {
  id: string;
  name: string;
  image: string;
  productCount: number;
}

export interface Product {
  id: string;
  name: string;
  price: number;
  discountPrice?: number;
  images: string[];
  rating: number;
  reviewCount: number;
  shop: {
    name: string;
  };
  category: {
    name: string;
  };
  tags?: string[];
  isNew?: boolean;
  isFeatured?: boolean;
}

export const mockCategories: Category[] = [
  { id: 'cat1', name: 'Thời trang nam', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=580', productCount: 1250 },
  { id: 'cat2', name: 'Thời trang nữ', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=580', productCount: 1845 },
  { id: 'cat3', name: 'Điện thoại', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=580', productCount: 738 },
  { id: 'cat4', name: 'Máy tính', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=580', productCount: 512 },
  { id: 'cat5', name: 'Đồng hồ', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=580', productCount: 347 },
  { id: 'cat6', name: 'Giày dép', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=580', productCount: 927 },
  { id: 'cat6', name: 'Giày dép', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=580', productCount: 927 },
  { id: 'cat6', name: 'Giày dép', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=580', productCount: 927 },
  { id: 'cat6', name: 'Giày dép', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=580', productCount: 927 },
  { id: 'cat6', name: 'Giày dép', image: 'https://images.unsplash.com/photo-1617137968427-85924c800a22?q=80&w=580', productCount: 927 },
];

export const mockFeaturedProducts: Product[] = [
  {
    id: 'p1',
    name: 'Áo thun nam cao cấp',
    price: 299000,
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=387'],
    rating: 4.8,
    reviewCount: 125,
    shop: { name: 'Fashion Store' },
    category: { name: 'Thời trang nam' },
    isFeatured: true
  },
  {
    id: 'p2',
    name: 'Giày thể thao nữ',
    price: 850000,
    discountPrice: 680000,
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=387'],
    rating: 4.6,
    reviewCount: 89,
    shop: { name: 'Sportland' },
    category: { name: 'Giày dép' },
    isFeatured: true
  },
  {
    id: 'p3',
    name: 'Đồng hồ nam dây da',
    price: 2150000,
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=387'],
    rating: 4.9,
    reviewCount: 213,
    shop: { name: 'LuxWatch' },
    category: { name: 'Đồng hồ' },
    isFeatured: true
  },
  {
    id: 'p4',
    name: 'Balo laptop chống sốc',
    price: 750000,
    discountPrice: 599000,
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=387'],
    rating: 4.7,
    reviewCount: 64,
    shop: { name: 'Tech Gear' },
    category: { name: 'Phụ kiện' },
    isFeatured: true
  },
  {
    id: 'p4',
    name: 'Balo laptop chống sốc',
    price: 750000,
    discountPrice: 599000,
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=387'],
    rating: 4.7,
    reviewCount: 64,
    shop: { name: 'Tech Gear' },
    category: { name: 'Phụ kiện' },
    isFeatured: true
  },
  {
    id: 'p4',
    name: 'Balo laptop chống sốc',
    price: 750000,
    discountPrice: 599000,
    images: ['https://images.unsplash.com/photo-1581655353564-df123a1eb820?q=80&w=387'],
    rating: 4.7,
    reviewCount: 64,
    shop: { name: 'Tech Gear' },
    category: { name: 'Phụ kiện' },
    isFeatured: true
  }
];

export const mockNewArrivals: Product[] = [
  {
    id: 'p5',
    name: 'Tai nghe bluetooth không dây',
    price: 1200000,
    images: ['https://images.unsplash.com/photo-1578319439584-104c94d37305?q=80&w=870'],
    rating: 4.5,
    reviewCount: 42,
    shop: { name: 'Sound World' },
    category: { name: 'Điện tử' },
    isNew: true
  },
  {
    id: 'p6',
    name: 'Váy liền thân nữ',
    price: 450000,
    images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=387'],
    rating: 4.3,
    reviewCount: 28,
    shop: { name: 'Lady Style' },
    category: { name: 'Thời trang nữ' },
    isNew: true
  },
  {
    id: 'p6',
    name: 'Váy liền thân nữ',
    price: 450000,
    images: ['https://images.unsplash.com/photo-1539008835657-9e8e9680c956?q=80&w=387'],
    rating: 4.3,
    reviewCount: 28,
    shop: { name: 'Lady Style' },
    category: { name: 'Thời trang nữ' },
    isNew: true
  },
  {
    id: 'p7',
    name: 'Kính mát thời trang',
    price: 380000,
    discountPrice: 320000,
    images: ['https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=580'],
    rating: 4.4,
    reviewCount: 37,
    shop: { name: 'Accessories Hub' },
    category: { name: 'Phụ kiện' },
    isNew: true
  },
  {
    id: 'p8',
    name: 'Đèn ngủ thông minh',
    price: 550000,
    images: ['https://images.unsplash.com/photo-1507146153580-69a1fe6d8aa1?q=80&w=1170'],
    rating: 4.6,
    reviewCount: 19,
    shop: { name: 'Smart Home' },
    category: { name: 'Gia dụng' },
    isNew: true
  },
];

export const mockTrendingProducts: Product[] = [
  {
    id: 'p9',
    name: 'Điện thoại Samsung Galaxy S23',
    price: 19500000,
    discountPrice: 18200000,
    images: ['https://images.unsplash.com/photo-1610792516307-ea5acd9c3b00?q=80&w=580'],
    rating: 4.9,
    reviewCount: 352,
    shop: { name: 'Mobile World' },
    category: { name: 'Điện thoại' },
    tags: ['trending']
  },
  {
    id: 'p10',
    name: 'Máy ảnh mirrorless Sony Alpha',
    price: 28500000,
    images: ['https://images.unsplash.com/photo-1516035069371-29a1b244cc32?q=80&w=464'],
    rating: 4.8,
    reviewCount: 127,
    shop: { name: 'Camera Hub' },
    category: { name: 'Thiết bị điện tử' },
    tags: ['trending']
  },
  {
    id: 'p11',
    name: 'Laptop gaming Asus ROG',
    price: 32000000,
    discountPrice: 29500000,
    images: ['https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=1074'],
    rating: 4.7,
    reviewCount: 215,
    shop: { name: 'Laptop Pro' },
    category: { name: 'Máy tính' },
    tags: ['trending']
  },
  {
    id: 'p11',
    name: 'Laptop gaming Asus ROG',
    price: 32000000,
    discountPrice: 29500000,
    images: ['https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=1074'],
    rating: 4.7,
    reviewCount: 215,
    shop: { name: 'Laptop Pro' },
    category: { name: 'Máy tính' },
    tags: ['trending']
  },
  {
    id: 'p11',
    name: 'Laptop gaming Asus ROG',
    price: 32000000,
    discountPrice: 29500000,
    images: ['https://images.unsplash.com/photo-1611078489935-0cb964de46d6?q=80&w=1074'],
    rating: 4.7,
    reviewCount: 215,
    shop: { name: 'Laptop Pro' },
    category: { name: 'Máy tính' },
    tags: ['trending']
  },
];