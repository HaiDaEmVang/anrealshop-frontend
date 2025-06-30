import { Container, Paper } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';
import { defaultProductDescriptionHtml } from '../../../../data/InitData';
import type { MediaDto } from '../../../../types/CommonType';
import type { ProductCreateRequest } from '../../../../types/ProductType';
import Infor from './Infor';

const ProductForm = () => {
  const { id } = useParams();
  const isEditMode = !!id;
  
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
      hight: 0,
      length: 0,
      width: 0,
      attributes: [],
      productSkus: [],
      media: []
    },

    validate: {
      name: (value) => (value.trim().length === 0 ? 'Tên không được để trống' : null),
      price: (value) => (value <= 0 ? 'Giá phải lớn hơn 0' : null),
      quantity: (value) => (value < 0 ? 'Số lượng không hợp lệ' : null),
      categoryId: (value) => (!value ? 'Chọn danh mục' : null),
      weight: (value) => (value < 0 ? 'Cân nặng không hợp lệ' : null),
      productSkus: (value) => {
        if (!value || value.length === 0) return null; 
        for (const sku of value) {
          if (!sku.sku.trim()) return 'SKU không được để trống';
          if (sku.price <= 0) return 'Giá SKU phải lớn hơn 0';
          if (sku.quantity < 0) return 'Số lượng SKU không hợp lệ';
        }
        return null;
      }
    }
  });

  const [media, setMedia] = useState<MediaDto[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Comprehensive form state logging
  useEffect(() => {
    console.log('🔍 Complete Form State Update:', {
      action: 'formStateChange',
      timestamp: new Date().toISOString(),
      formValues: form.values,
      errors: form.errors,
      isDirty: form.isDirty(),
      touchedFields: Object.keys(form.values).filter(key => form.isTouched(key)),
      summary: {
        hasName: !!form.values.name,
        hasCategory: !!form.values.categoryId,
        attributeCount: form.values.attributes.length,
        skuCount: form.values.productSkus.length,
        hasPrice: form.values.price > 0,
        hasQuantity: form.values.quantity > 0
      }
    });
  }, [form.values, form.errors]);

  // Track specific critical field changes
  useEffect(() => {
    if (form.values.name) {
      console.log('📝 Product Name Changed:', {
        action: 'nameChange',
        timestamp: new Date().toISOString(),
        value: form.values.name,
        length: form.values.name.length
      });
    }
  }, [form.values.name]);

  useEffect(() => {
    if (form.values.price > 0) {
      console.log('💰 Product Price Changed:', {
        action: 'priceChange',
        timestamp: new Date().toISOString(),
        value: form.values.price,
        formatted: new Intl.NumberFormat('vi-VN', { style: 'currency', currency: 'VND' }).format(form.values.price)
      });
    }
  }, [form.values.price]);

  useEffect(() => {
    console.log('🏷️ Attributes Array Changed:', {
      action: 'attributesChange',
      timestamp: new Date().toISOString(),
      count: form.values.attributes.length,
      attributes: form.values.attributes,
      attributeNames: form.values.attributes.map(attr => attr.attributeKeyName)
    });
  }, [form.values.attributes]);

  useEffect(() => {
    console.log('📦 Product SKUs Changed:', {
      action: 'skusChange',
      timestamp: new Date().toISOString(),
      count: form.values.productSkus.length,
      skus: form.values.productSkus,
      skuCodes: form.values.productSkus.map(sku => sku.sku),
      totalValue: form.values.productSkus.reduce((sum, sku) => sum + (sku.price * sku.quantity), 0)
    });
  }, [form.values.productSkus]);

  const openPreview = () => {
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <Container fluid px="lg" py="md">
      <Paper className="!bg-transparent mb-20">
        {isLoading ? (
          <div className="flex justify-center items-center py-8">
            <div className="animate-pulse flex flex-col items-center">
              <div className="h-32 w-32 bg-gray-200 rounded-full mb-4"></div>
              <div className="h-6 w-1/2 bg-gray-200 rounded mb-2"></div>
              <div className="h-4 w-1/3 bg-gray-200 rounded"></div>
            </div>
          </div>
        ) : (
          <Infor
            form={form}
            isEditMode={isEditMode}
          />
        )}
      </Paper>
    </Container>
  );
};

export default ProductForm;