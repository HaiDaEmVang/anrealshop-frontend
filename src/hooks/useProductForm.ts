// useProductForm.ts
import { isNotEmpty, useForm } from '@mantine/form';
import type { ProductCreateRequest } from '../types/ProductType';
import { defaultProductDescriptionHtml } from '../data/InitData';
import showErrorNotification from '../components/Toast/NotificationError';
import ProductsService from '../service/ProductsService';

interface UseProductFormOptions {
    isEditMode: boolean;
}

export const useProductForm = (options: UseProductFormOptions) => {
    const { isEditMode } = options;

    const form = useForm<ProductCreateRequest>({
        initialValues: {
            name: '',
            description: defaultProductDescriptionHtml,
            sortDescription: '',
            price: 0,
            discountPrice: 0,
            quantity: 0,
            categoryId: '',
            weight: 0,
            height: 0,
            length: 0,
            width: 0,
            attributes: [],
            productSkus: [],
            media: []
        },
        validate: {
            name: (value) => {
                if (!value.trim()) return 'Tên sản phẩm không được để trống';
                if (value.trim().length > 255 || value.trim().length < 50) return 'Tên sản phẩm không được nhỏ hơn 50 và vượt quá 255 ký tự';
                return null;
            },
            description: (value) => {
                if (!value.trim()) return 'Mô tả sản phẩm không được để trống';
                return null;
            },
            sortDescription: (value) => {
                if (!value.trim()) return 'Mô tả ngắn không được để trống';
                if (value.trim().length > 500) return 'Mô tả ngắn không được vượt quá 500 ký tự';
                return null;
            },
            price: (value) => {
                if (value === null || value === undefined) return 'Giá sản phẩm không được để trống';
                if (value <= 0) return 'Giá sản phẩm phải lớn hơn 0';
                return null;
            },
            discountPrice: (value, values) => {
                if (value === null || value === undefined) return 'Giá khuyến mãi không được để trống';
                if (value < 0) return 'Giá khuyến mãi không hợp lệ';
                if (value > 0 && value >= values.price) return 'Giá khuyến mãi phải nhỏ hơn giá gốc';
                return null;
            },
            quantity: (value) => {
                if (value === null || value === undefined) return 'Số lượng không được để trống';
                if (value < 0) return 'Số lượng không hợp lệ';
                return null;
            },
            categoryId: (value) => {
                if (!value) return 'Vui lòng chọn danh mục';
                return null;
            },
            weight: (value) => {
                if (value === null || value === undefined) return 'Cân nặng không được để trống';
                if (value <= 0) return 'Cân nặng không hợp lệ';
                return null;
            },
            height: (value) => {
                if (value === null || value === undefined) return 'Chiều cao không được để trống';
                if (value <= 0) return 'Chiều cao không hợp lệ';
                return null;
            },
            length: (value) => {
                if (value === null || value === undefined) return 'Chiều dài không được để trống';
                if (value <= 0) return 'Chiều dài không hợp lệ';
                return null;
            },
            width: (value) => {
                if (value === null || value === undefined) return 'Chiều rộng không được để trống';
                if (value <= 0) return 'Chiều rộng không hợp lệ';
                return null;
            },
            productSkus: (value) => {
                if (!value || value.length === 0) return null;
                for (const sku of value) {
                    if (!sku.sku.trim()) return 'Mã SKU không được để trống';
                    if (sku.price === null || sku.price === undefined || sku.price <= 0) return 'Giá SKU phải lớn hơn 0';
                    if (sku.quantity === null || sku.quantity === undefined || sku.quantity < 0) return 'Số lượng SKU không hợp lệ';
                }
                return null;
            },
            media: (value) => {
                if (!value || value.length === 0) return 'Sản phẩm phải có ít nhất một hình ảnh';
                return null;
            },
            attributes: (value) => {
                if (!value) return 'Thuộc tính sản phẩm không hợp lệ';
                for (const attribute of value) {
                    if (!attribute.attributeKeyName.trim()) return 'Tên thuộc tính không được để trống';
                    if (!attribute.attributeKeyDisplay.trim()) return 'Tên hiển thị thuộc tính không được để trống';
                    if (!attribute.values || attribute.values.length === 0) return 'Thuộc tính phải có ít nhất một giá trị';
                }
                return null;
            }
        }
    });

    const handleSubmit = async () => {
        form.validate();
        if (!form.isValid()) {
            showErrorNotification('Thông báo', 'Vui lòng nhập đầy đủ thông tin sản phẩm và kiểm tra các lỗi.');
            return;
        }
        // form.values.categoryId = '026890fd-fd6d-4fd2-93e2-1b46727815ab'
        // if(form.values.productSkus.length > 0){
        //     const quantity = form.values.productSkus.reduce((total, sku) => total + (sku.quantity || 0), 0);
        //     form.setFieldValue("quantity", quantity);
        // }
        // console.log('Form values:', form.values);
        // debugger;
        // try {
        //     const data = await ProductsService.create(form.values);
        //     console.log('Product created successfully:', data);
        //     showErrorNotification('Thành công', 'Sản phẩm đã được tạo thành công.');
        // } catch (error) {
        //     console.error('Error creating product:', error);
        //     showErrorNotification('Lỗi', 'Không thể tạo sản phẩm. Vui lòng thử lại sau.');
        //     return;
        // }

    };

    return { form, handleSubmit };
};