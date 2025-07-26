import { API_ENDPOINTS } from '../constant';
import type { BaseCategoryDto } from '../types/CategoryType';
import { axiosInstance } from './AxiosInstant';

const getCategorySuggestions = async (keyword: string): Promise<BaseCategoryDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.GET_MY_SHOP_SUGGEST_CATEGORIES, {
        params: { keyword }
      });
    return response.data;
};

const getCategorySuggestionsByNameProduct = async (keyword: string): Promise<BaseCategoryDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.GET_SUGGEST_BY_NAME_PRODUCT, {
        params: { keyword }
      });
    return response.data;
};

const getCategoryForShop = async (): Promise<BaseCategoryDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.GET_FOR_SHOP);
    return response.data;
};

export const CategoryService = {
    getCategorySuggestions,
    getCategorySuggestionsByNameProduct,
    getCategoryForShop
};