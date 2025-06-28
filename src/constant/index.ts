export const BASE_API_URL = import.meta.env.VITE_BASE_API_URL
export const BASE_BE_URL = import.meta.env.VITE_BASE_BE_URL
export const MAX_IMAGE_SIZE = import.meta.env.VITE_MAX_IMAGE_SIZE
export const BASE_FE_URL = import.meta.env.VITE_BASE_FE_URL
export const GOOGLE_LOGIN_URL = `${BASE_BE_URL}/oauth2/authorization/google`
export const CLOUNDINARY_UPLOAD_PRESET = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET
export const CLOUNDINARY_NAME = import.meta.env.VITE_CLOUDINARY_NAME



export const API_ENDPOINTS = {
  AUTH: {
    LOGIN: '/login',
    LOGIN_GOOGLE: '/oauth2/callback/google',
    LOGOUT: '/logout',
    FORGOT_PASSWORD: '/forgot-password',
    REFRESH: '/auth/refresh-token',
  },
  OTP: {
    GET_OTP: '/otp/sendOtp',
    VERIFY_OTP: '/otp/verifyOTP',
  },
  USERS: {
    ME: '/user/me',
    REGISTER: '/user/register',
    PROFILE: '/user/profile',
    CHANGE_PASSWORD: '/user/change-password',
    RESET_PASSWORD: '/user/reset-password',
  },
  PRODUCTS: {
    // BASE: '/products', 
    CREATE: '/products/create',
    // APPROVALS: '/products/approvals',
    // SEARCH: '/products/search',
    // CATEGORY: (slug: string) => `/products/category/${slug}`,
    // SHOP: (slug: string) => `/products/shop/${slug}`,
  },
};


export const APP_ROUTES = {
  // User Routes
  HOME: '/',
  PRODUCTS: '/products',
  PRODUCT_DETAIL: (slug: string) => `/products/${slug}`,
  CHECKOUT: '/checkout',
  CART: '/carts',
  USER_SETTINGS: '/settings',
  SEARCH: '/search',
  CATEGORY_PAGE: (slug: string) => `/category/${slug}`,
  SHOP_PAGE: (slug: string) => `/shop/${slug}`,

  // MyShop Routes
  MYSHOP: {
    BASE: '/myshop',
    DASHBOARD: '/myshop/dashboard',
    SALE: '/myshop/sale',
    PRODUCTS: '/myshop/products',
    PRODUCT_CREATE: '/myshop/products/create',
    PRODUCT_EDIT: (id: string) => `/myshop/products/edit/${id}`,
    ORDERS: '/myshop/orders',
    ORDER_DETAIL: (id: string) => `/myshop/orders/${id}`,
    MESSAGES: '/myshop/messages',
    SETTINGS: '/myshop/settings',
  },

  // Admin Routes
  ADMIN: {
    BASE: '/admin',
    DASHBOARD: '/admin/dashboard',
    CATEGORIES: '/admin/categories',
    USERS: '/admin/users',
    SHOP_REGISTRATIONS: '/admin/shop-registrations',
    PRODUCT_APPROVALS: '/admin/product-approvals',
    ORDERS: '/admin/orders',
    REPORTS: '/admin/reports',
    SETTINGS: '/admin/settings',
  },
};

export const ROUTE_NAMES: Record<string, string> = {
  admin: 'Quản trị',
  dashboard: 'Tổng quan',
  categories: 'Quản lý danh mục',
  users: 'Quản lý người dùng',
  'shop-registrations': 'Duyệt đăng ký shop',
  'product-approvals': 'Duyệt sản phẩm',
  orders: 'Quản lý đơn hàng',
  reports: 'Báo cáo & Thống kê',
  settings: 'Cài đặt hệ thống',
  myshop: 'Kênh người bán',
  products: 'Quản lý sản phẩm',
  create: 'Thêm sản phẩm mới',
  edit: 'Chỉnh sửa sản phẩm',
  messages: 'Quản lý chat',
  sale: 'Phân tích bán hàng',
};

// 4. User Roles
export const USER_ROLES = {
  ADMIN: 'admin',
  USER: 'user',
};

export const QUERY_KEYS = {
  PRODUCTS: 'products',
  PRODUCT_APPROVALS: 'product-approvals',
  CATEGORIES: 'categories',
  ORDERS: 'orders',
  USERS: 'users',
  SHOPS: 'shops',
  SHOP_REGISTRATIONS: 'shop-registrations',
  USER_PROFILE: 'user-profile',
  CART: 'cart',
};

export const APP_CONFIG = {
  ITEMS_PER_PAGE: 10,
  REQUEST_TIMEOUT: 30000,
};

export const LOCAL_STORAGE_KEYS = {
  USER_PREFERENCES: 'user-preferences',
};