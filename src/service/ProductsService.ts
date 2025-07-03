import { API_ENDPOINTS } from "../constant";
import type { ProductCreateRequest } from "../types/ProductType";
import { axiosInstance } from "./AxiosInstant";

const create = async (data: ProductCreateRequest) => {
    const response = await axiosInstance.post(API_ENDPOINTS.PRODUCTS.CREATE, data);
    return response.data;
}

const ProductsService = {
    create,
};

export default ProductsService;