import { API_ENDPOINTS } from '../constant';
import type { AdminCategoryDto, BaseCategoryDto, CategoryRequestDto } from '../types/CategoryType';
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

const getCategoryForAdmin = async (): Promise<AdminCategoryDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.CATEGORY_LIST);
    return response.data;
};

const getCategoryDisabledForAdmin = async (): Promise<AdminCategoryDto[]> => {
    const response = await axiosInstance.get(API_ENDPOINTS.ADMIN.CATEGORY_DISABLED);
    return response.data;
};

const addCategory = async (categoryRequestDto: CategoryRequestDto) => {
    const response = await axiosInstance.post(API_ENDPOINTS.ADMIN.CATEGORY_LIST, categoryRequestDto);
    return response.data;
};

const updateCategory = async (categoryId: string, categoryRequestDto: CategoryRequestDto) => {
    const response = await axiosInstance.put(API_ENDPOINTS.ADMIN.CATEGORY_ID(categoryId), categoryRequestDto);
    return response.data;
};

const toggleCategoryStatus = async (categoryId: string, includeChildren: boolean = false): Promise<void> => {
    await axiosInstance.put(API_ENDPOINTS.ADMIN.CATEGORY_SWITCH(categoryId), null, {
        params: { includeChildren }
    });
};

const deleteCategory = async (categoryId: string, includeChildren: boolean = false) => {
    const response = await axiosInstance.delete(API_ENDPOINTS.ADMIN.CATEGORY_ID(categoryId), {
        params: { includeChildren }
    });
    return response.data;
};

export const CategoryService = {
    getCategorySuggestions,
    getCategorySuggestionsByNameProduct,
    getCategoryForShop,
    getCategoryDisabledForAdmin,
    getCategoryForAdmin,
    addCategory,
    updateCategory,
    deleteCategory,
    toggleCategoryStatus,
};