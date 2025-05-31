import { useState, useEffect } from 'react';
import { Container, Paper, Title, Breadcrumbs, Anchor, Box, Text, Group, Modal, Button } from '@mantine/core';
import { useForm } from '@mantine/form';
import { FiEye, FiChevronRight, FiEdit3, FiSave } from 'react-icons/fi';
import Infor from './Infor';
import Review from './Review';
import { Link } from 'react-router-dom';

interface ProductImage {
  file?: File;
  url: string;
  id?: string;
  type: 'image' | 'video';
}

const CreateProduct = () => {
  // Form instance shared between components
  const form = useForm({
    initialValues: {
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

  // Breadcrumb items
  const breadcrumbItems = [
    { title: 'Trang chủ', href: '/myshop' },
    { title: 'Quản lý sản phẩm', href: '/myshop/product' },
    { title: 'Tạo sản phẩm mới', href: '#' },
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
    console.log('Submitting product:', form.values, media);
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
            <Title order={2} size="h3">Tạo sản phẩm mới</Title>
          </Group>
          <Text c="dimmed" size="sm">
            Nhập thông tin để tạo sản phẩm mới của bạn
          </Text>
        </Group>
      </Paper>

      {/* Main Form Content */}
      <Paper shadow="xs" p="md" radius="md" className="bg-white mb-20">
        <Infor
          form={form}
          media={media}
          setMedia={setMedia}
        />
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
              {isDirty ? 'Sản phẩm có thay đổi chưa được lưu' : 'Tạo và quản lý thông tin sản phẩm của bạn'}
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
                Đăng sản phẩm
              </Button>
            </Group>
          </Group>
        </Container>
      </Paper>
    </Container>
  );
};

export default CreateProduct;