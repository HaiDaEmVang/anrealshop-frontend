import { Anchor, Box, Breadcrumbs, Button, Container, Group, Modal, Paper, Text, Title } from '@mantine/core';
import { useForm } from '@mantine/form';
import { useEffect, useState } from 'react';
import { FiChevronRight, FiEdit3, FiEye, FiSave } from 'react-icons/fi';
import { Link, useParams } from 'react-router-dom';
import Infor from './Infor';
import Review from './Review';

interface ProductImage {
  file?: File;
  url: string;
  id?: string;
  type: 'image' | 'video';
}

// Đổi tên component để phù hợp với cả hai chức năng
const ProductForm = () => {
  const { id } = useParams(); // Lấy id từ URL nếu ở chế độ chỉnh sửa
  const isEditMode = !!id; // Kiểm tra xem đang ở chế độ chỉnh sửa hay không
  
  // Form instance shared between components
  const form = useForm({
    initialValues: {
      id: '',
      name: '',
      category_id: '',
      description: '',
      shortDescription: '',
      tags: [] as string[],
      sku: '',
      price: 0,
      comparePrice: 0,
      costPrice: 0,
      quantity: 0,
      isActive: true,
      isFeatured: false,
      weight: 0,
      length: 0,
      width: 0,
      height: 0,
      variants: [],
      seoTitle: '',
      seoDescription: '',
      seoKeywords: '',
      location: '',
    },
    validate: {
      name: (value) => (value.trim().length > 0 ? null : 'Tên sản phẩm là bắt buộc'),
      category_id: (value) => (value ? null : 'Vui lòng chọn danh mục'),
    }
  });

  const [media, setMedia] = useState<ProductImage[]>([]);
  const [isPreviewOpen, setIsPreviewOpen] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // Fetch product data if in edit mode
  useEffect(() => {
    if (isEditMode) {
      fetchProductData();
    }
  }, [id]);

  // Giả lập API call để lấy dữ liệu sản phẩm khi ở chế độ chỉnh sửa
  const fetchProductData = async () => {
    try {
      setIsLoading(true);
      
      // Giả lập gọi API - trong thực tế bạn sẽ gọi API thực
      await new Promise(resolve => setTimeout(resolve, 500)); // Giả lập delay API
      
      // Dữ liệu mẫu - thay bằng API call thực tế
      const productData = {
        id: id,
        name: 'Sản phẩm mẫu',
        category_id: 'cat123',
        description: '<p>Mô tả chi tiết sản phẩm</p>',
        shortDescription: 'Mô tả ngắn về sản phẩm',
        tags: ['thời trang', 'mới'],
        sku: 'SP-001',
        price: 150000,
        comparePrice: 200000,
        costPrice: 100000,
        quantity: 50,
        isActive: true,
        isFeatured: true,
        weight: 0.5,
        length: 30,
        width: 20,
        height: 10,
        variants: [],
        seoTitle: 'Tiêu đề SEO',
        seoDescription: 'Mô tả SEO',
        seoKeywords: 'từ khóa, seo, sản phẩm',
        location: 'Kho A',
      };
      
      // Dữ liệu ảnh mẫu
      const mediaData = [
        {
          id: 'img1',
          url: 'https://images.unsplash.com/photo-1576566588028-4147f3842f27?q=80&w=300',
          type: 'image' as const
        },
        {
          id: 'img2',
          url: 'https://images.unsplash.com/photo-1542272604-787c3835535d?q=80&w=300',
          type: 'image' as const
        }
      ];
      
      // Cập nhật form với dữ liệu sản phẩm
      form.setValues(productData);
      // Cập nhật media
      setMedia(mediaData);
      
      // Đánh dấu form là "không thay đổi" sau khi nạp dữ liệu ban đầu
      setIsDirty(false);
      
    } catch (error) {
      console.error('Error fetching product data:', error);
    } finally {
      setIsLoading(false);
    }
  };

  // Breadcrumb items
  const breadcrumbItems = [
    { title: 'Trang chủ', href: '/myshop' },
    { title: 'Quản lý sản phẩm', href: '/myshop/products' },
    { title: isEditMode ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới', href: '#' },
  ].map((item, index) => (
    <Anchor component={Link} to={item.href} key={index} size="sm">
      {item.title}
    </Anchor>
  ));

  // Track form changes
  useEffect(() => {
    if (Object.keys(form.values).some(key => form.isDirty(key))) {
      setIsDirty(true);
    }
  }, [form.values]);

  const handleSubmit = () => {
    const validation = form.validate();
    if (validation.hasErrors) {
      console.log('Form has errors:', validation.errors);
      return;
    }

    // Submit product to API
    console.log(`${isEditMode ? 'Updating' : 'Submitting'} product:`, form.values, media);

    // Giả lập API call
    console.log(`Product ${isEditMode ? 'updated' : 'created'} successfully`);
  };

  const openPreview = () => {
    setIsPreviewOpen(true);
  };

  const closePreview = () => {
    setIsPreviewOpen(false);
  };

  return (
    <Container fluid px="lg" py="md">
      {/* Preview Modal */}
      <Modal
        opened={isPreviewOpen}
        onClose={closePreview}
        size="85%"
        padding={0}
        centered
        styles={{
          header: { padding: '16px 24px', borderBottom: '1px solid #e9ecef' },
          body: { padding: 0 },
          content: {
            borderRadius: '8px',
            maxHeight: '90vh',
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
          maxHeight: 'calc(90vh - 60px)',
          padding: '0'
        }}>
          <Review
            form={form}
            media={media}
            onBack={closePreview}
            onSubmit={handleSubmit}
            isPreview={true}
          />
        </div>
      </Modal>

      {/* Page Header */}
      <Paper
        shadow="xs"
        p="md"
        mb="md"
        radius="md"
        className="border-b border-gray-200"
      >
        <Box mb="xs">
          <Breadcrumbs separator={<FiChevronRight size={14} />}>
            {breadcrumbItems}
          </Breadcrumbs>
        </Box>

        <Group justify="space-between" align="center">
          <Group>
            <FiEdit3 size={24} className="text-primary" />
            <Title order={2} size="h3">{isEditMode ? 'Chỉnh sửa sản phẩm' : 'Tạo sản phẩm mới'}</Title>
          </Group>
          <Text c="dimmed" size="sm">
            {isEditMode 
              ? 'Chỉnh sửa thông tin sản phẩm của bạn' 
              : 'Nhập thông tin để tạo sản phẩm mới của bạn'
            }
          </Text>
        </Group>
      </Paper>

      {/* Main Form Content - Hiển thị loading nếu đang tải dữ liệu */}
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
            media={media}
            setMedia={setMedia}
            isEditMode={isEditMode}
          />
        )}
      </Paper>

      {/* Action Buttons - Fixed at Bottom */}
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