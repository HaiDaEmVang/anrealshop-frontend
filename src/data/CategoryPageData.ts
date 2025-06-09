import type { Category } from '../components/User/CategoryPage/CategoryPage';
import { mockFeaturedProducts, type Product } from '../data/FilterData';

// Mock data for categories
const MOCK_CATEGORIES: {[key: string]: Category} = {
  'electronics': {
    id: 'electronics',
    name: 'Điện tử',
    hasChildren: true,
    slug: 'electronics',
    description: 'Sản phẩm điện tử chính hãng, giá rẻ, chất lượng cao',
    subCategories: [
      { 
        id: 'smartphones', 
        name: 'Điện thoại', 
        imageUrl: 'https://i.imgur.com/wXuQ7bm.jpg',
        productCount: 153,
        slug: 'smartphones'
      },
      { 
        id: 'laptops', 
        name: 'Laptop', 
        imageUrl: 'https://i.imgur.com/wXuQ7bm.jpg',
        productCount: 78,
        slug: 'laptops'
      },
      { 
        id: 'tablets', 
        name: 'Máy tính bảng', 
        imageUrl: 'https://i.imgur.com/wXuQ7bm.jpg',
        productCount: 45,
        slug: 'tablets'
      },
      { 
        id: 'cameras', 
        name: 'Máy ảnh', 
        imageUrl: 'https://i.imgur.com/wXuQ7bm.jpg',
        productCount: 32,
        slug: 'cameras'
      },
      { 
        id: 'accessories', 
        name: 'Phụ kiện', 
        imageUrl: 'https://i.imgur.com/wXuQ7bm.jpg',
        productCount: 211,
        slug: 'accessories'
      },
      { 
        id: 'accessories', 
        name: 'Phụ kiện', 
        imageUrl: 'https://i.imgur.com/wXuQ7bm.jpg',
        productCount: 211,
        slug: 'accessories'
      },
      { 
        id: 'accessories', 
        name: 'Phụ kiện', 
        imageUrl: 'https://i.imgur.com/wXuQ7bm.jpg',
        productCount: 211,
        slug: 'accessories'
      },
      { 
        id: 'accessories', 
        name: 'Phụ kiện', 
        imageUrl: 'https://i.imgur.com/wXuQ7bm.jpg',
        productCount: 211,
        slug: 'accessories'
      },
      { 
        id: 'accessories', 
        name: 'Phụ kiện', 
        imageUrl: 'https://i.imgur.com/wXuQ7bm.jpg',
        productCount: 211,
        slug: 'accessories'
      },
      { 
        id: 'accessories', 
        name: 'Phụ kiện', 
        imageUrl: 'https://i.imgur.com/wXuQ7bm.jpg',
        productCount: 211,
        slug: 'accessories'
      },
      { 
        id: 'accessories', 
        name: 'Phụ kiện', 
        imageUrl: 'https://i.imgur.com/wXuQ7bm.jpg',
        productCount: 211,
        slug: 'accessories'
      },
      { 
        id: 'accessories', 
        name: 'Phụ kiện', 
        imageUrl: 'https://i.imgur.com/wXuQ7bm.jpg',
        productCount: 211,
        slug: 'accessories'
      },
      { 
        id: 'accessories', 
        name: 'Phụ kiện', 
        imageUrl: 'https://i.imgur.com/wXuQ7bm.jpg',
        productCount: 211,
        slug: 'accessories'
      },
    ]
  },
  'smartphones': {
    id: 'smartphones',
    name: 'Điện thoại',
    hasChildren: false,
    slug: 'smartphones',
    description: 'Điện thoại chính hãng từ các thương hiệu uy tín',
    subCategories: [],
    parentId: 'electronics',
    parentName: 'Điện tử'
  },
  // Thêm các danh mục khác nếu cần
};

// Hàm lấy thông tin danh mục theo slug
export const getCategoryData = async (slug: string): Promise<Category | null> => {
  // Giả lập API call
  return new Promise((resolve) => {
    setTimeout(() => {
      resolve(MOCK_CATEGORIES[slug] || null);
    }, 500);
  });
};

// Hàm lấy sản phẩm theo danh mục
export const getCategoryProducts = async (categoryId: string, filters: any) : Promise<Product[]> => {
  // Giả lập API call
  return new Promise((resolve) => {
    setTimeout(() => {
      // Giả lập lọc sản phẩm
      let products = [...mockFeaturedProducts];
      
      // Lọc theo thương hiệu
      if (filters.brands && filters.brands.length > 0) {
        products = products.filter(p => filters.brands.includes(p.brand?.toLowerCase()));
      }
      
      // Lọc theo xuất xứ
      if (filters.origins && filters.origins.length > 0) {
        products = products.filter(p => filters.origins.includes(p.origin?.toLowerCase()));
      }
      
      // Lọc theo kích thước
      if (filters.sizes && filters.sizes.length > 0) {
        products = products.filter(p => 
          p.sizes && p.sizes.some(size => filters.sizes.includes(size))
        );
      }
      
      // Sắp xếp
      switch (filters.sort) {
        case 'price-asc':
          products.sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price));
          break;
        case 'price-desc':
          products.sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price));
          break;
        case 'name-asc':
          products.sort((a, b) => a.name.localeCompare(b.name));
          break;
        case 'name-desc':
          products.sort((a, b) => b.name.localeCompare(a.name));
          break;
        case 'rating':
          products.sort((a, b) => b.rating - a.rating);
          break;
        default:
          // Newest
          products.sort((a, b) => Number(b.id) - Number(a.id));
      }
      
      resolve(products);
    }, 800);
  });
};