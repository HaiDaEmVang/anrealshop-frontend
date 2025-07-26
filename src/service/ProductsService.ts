import { API_ENDPOINTS } from "../constant";
import type { MyShopProductDto, MyShopProductListResponse, ProductCreateRequest, ProductStatus, ProductStatusDto } from "../types/ProductType";
import { axiosInstance } from "./AxiosInstant";

const create = async (data: ProductCreateRequest) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PRODUCTS.CREATE, data);
    return response.data;
}

const getMyShopProducts = async (params?: {
  page?: number;
  limit?: number;
  status?: ProductStatus;
  search?: string;
  categoryId?: string;
  sortBy?: string;
}): Promise<MyShopProductListResponse> => {
  const queryParams = new URLSearchParams();

  Object.entries(params || {}).forEach(([key, value]) => {
    if (value != null) {
      queryParams.append(key, String(value));
    }
  });

  const response = await axiosInstance.get(
    `${API_ENDPOINTS.PRODUCTS.GET_MY_SHOP_PRODUCTS}?${queryParams}`
  );
  return response.data;
};


// Get my shop product by ID
const getMyShopProductById = async (id: string): Promise<ProductCreateRequest> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.GET_MY_SHOP_PRODUCT_BY_ID(id));
    return response.data;
};

// Update product
const update = async (id: string, data: ProductCreateRequest): Promise<MyShopProductDto> => {
    const response = await axiosInstance.put(API_ENDPOINTS.PRODUCTS.UPDATE(id), data);
    return response.data;
};

// Delete product
const deleteProduct = async (id: string, isForce: boolean = false) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.PRODUCTS.DELETE(id), {
        params: { isForce }
    });
    return response.data;
};

// Update product visibility (show/hide)
const updateVisibility = async (id: string, visible: boolean) => {
    const response = await axiosInstance.put(API_ENDPOINTS.PRODUCTS.UPDATE_VISIBILITY(id), null, {
        params: { visible }
    });
    return response.data;
};

// Get product name suggestions for autocomplete
const getProductNameSuggestions = async (keyword: string): Promise<string[]> => {
    const response = await axiosInstance.get(
        `${API_ENDPOINTS.PRODUCTS.GET_MY_SHOP_SUGGEST_PRODUCT_NAME}?keyword=${encodeURIComponent(keyword)}`
    );
    return response.data;
};

// Get product status metadata (counts for each status)
const getProductStatusMetadata = async (): Promise<ProductStatusDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.PRODUCTS.GET_META_STATUS);
    return response.data;
};


const deleteProducts = async (ids: string[]): Promise<void> => {
    await axiosInstance.delete(API_ENDPOINTS.PRODUCTS.DELETE_MULTIPLE, {
        data: ids  
    });
};

const updateProductsVisibility = async (ids: string[], visible = true): Promise<void> => {
    await axiosInstance.put(API_ENDPOINTS.PRODUCTS.UPDATE_MULTIPLE_VISIBILITY, 
        ids, { params: { visible }});
};


const ProductsService = {
    create,
    getMyShopProducts,
    getMyShopProductById,
    update,
    deleteProduct,
    updateVisibility,
    getProductNameSuggestions,
    getProductStatusMetadata,
    deleteProducts,
    updateProductsVisibility,
};

export default ProductsService;