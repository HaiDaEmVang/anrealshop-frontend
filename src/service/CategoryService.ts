import { API_ENDPOINTS } from '../constant';
import type { BaseCategoryDto } from '../types/CategoryType';
import { axiosInstance } from './AxiosInstant';

const getCategorySuggestions = async (keyword: string): Promise<BaseCategoryDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.CATEGORIES.GET_MY_SHOP_SUGGEST_CATEGORIES, {
        params: { keyword }
      });
    return response.data;
};

export const CategoryService = {
    getCategorySuggestions
};