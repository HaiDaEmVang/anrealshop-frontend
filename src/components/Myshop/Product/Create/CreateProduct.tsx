import { Button, Container, Group, Modal, Paper, Text } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { FiEye, FiSave } from 'react-icons/fi';
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
      height: 0,
      length: 0,
      width: 0,
      attributes: [],
      productSkus: [],
      media: []
    },

    validate: {
      name: (value) => (value.trim().length === 0 ? 'Tên không được để trống' : null),
      price: (value) => (value <= 0 ? 'Giá phải lớn hơn 0' : null),
      discountPrice: (value, values) => {
        if (value < 0) return 'Giá khuyến mãi không hợp lệ';
        if (value > 0 && value >= values.price) return 'Giá khuyến mãi phải nhỏ hơn giá gốc';
        return null;
      },
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


  useEffect(()=>{
    console.log(form.values);
  }, [form])
  const openPreview = () => {
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  const handleSubmit = () => {
    const validation = form.validate();
    if (validation.hasErrors) {
      console.log('Form has errors:', validation.errors);
      return;
    }

    console.log(`${isEditMode ? 'Updating' : 'Submitting'} product:`, form.values, media);
    console.log(`Product ${isEditMode ? 'updated' : 'created'} successfully`);
  };

  return (
    <Container fluid px="lg" py="md">
      {/* Preview Modal */}
      <Modal
        opened={isPreviewOpen}
        onClose={closePreview}
        size="90%"
        padding={0}
        centered
        styles={{
          header: { padding: '16px 24px', borderBottom: '1px solid #e9ecef' },
          body: { padding: 0 },
          content: {
            borderRadius: '8px',
            maxHeight: '95vh',
            display: 'flex',
            flexDirection: 'column'
          },
          inner: {
            padding: '20px'
          },
          title: {
            fontWeight: 600,
            fontSize: '18px',
            display: 'flex',
            alignItems: 'center',
            gap: '8px'
          },
          close: {
            backgroundColor: '#f8f9fa',
            '&:hover': {
              backgroundColor: '#e9ecef'
            }
          }
        }}
        title={
          <Group>
            <FiEye size={20} className="text-primary" />
            <Text>Xem trước sản phẩm</Text>
          </Group>
        }
        transitionProps={{ transition: 'fade', duration: 300 }}
      >
        <div style={{
          overflow: 'auto',
          maxHeight: 'calc(95vh - 60px)',
          padding: '0'
        }}>
          {/* <Review
            form={form}
            media={media}
            onBack={closePreview}
            onSubmit={handleSubmit}
            isPreview={true}
          /> */}
        </div>
      </Modal>

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

      <Paper
        shadow="md"
        p="md"
        className="bg-white border-t fixed bottom-0 left-0 right-0 z-10"
        style={{ boxShadow: '0 -2px 10px rgba(0,0,0,0.1)' }}
      >
        <Container fluid px="lg">
          <Group justify="space-between">
            <Text size="sm" c="dimmed" className="hidden md:block">
              {isDirty ? 'Sản phẩm có thay đổi chưa được lưu' : isEditMode ? 'Chỉnh sửa thông tin sản phẩm của bạn' : 'Tạo và quản lý thông tin sản phẩm của bạn'}
            </Text>
            <Group>
              <Button
                leftSection={<FiEye size={16} />}
                variant="outline"
                onClick={openPreview}
                radius="md"
              >
                Xem trước
              </Button>
              <Button
                leftSection={<FiSave size={16} />}
                variant="default"
                radius="md"
              >
                Lưu nháp
              </Button>
              <Button
                className="bg-primary hover:bg-primary/90"
                onClick={handleSubmit}
                disabled={!isDirty}
                radius="md"
              >
                {isEditMode ? 'Cập nhật sản phẩm' : 'Đăng sản phẩm'}
              </Button>
            </Group>
          </Group>
        </Container>
      </Paper>
    </Container>
  );
};

export default ProductForm;