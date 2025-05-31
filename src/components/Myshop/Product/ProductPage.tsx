import { useState } from 'react';
import { Anchor, Box, Breadcrumbs, Container, Group, Paper, Text, Title } from '@mantine/core';
import { FiChevronRight, FiShoppingBag } from 'react-icons/fi';
import FilterByStatus from './FilterByStatus';
import OptionConfig from './OptionConfig';
import ProductList from './ProductList';

const ProductPage = () => {
  // State cho chế độ xem (grid/list) để chia sẻ giữa OptionConfig và ProductList
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');
  
  // Breadcrumb items
  const breadcrumbItems = [
    { title: 'Trang chủ', href: '/myshop' },
    { title: 'Quản lý sản phẩm', href: '#' },
  ].map((item, index) => (
    <Anchor href={item.href} key={index} size="sm">
      {item.title}
    </Anchor>
  ));

  return (
    <Container fluid px="lg" py="md">
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
            <FiShoppingBag size={24} className="text-primary" />
            <Title order={2} size="h3">Quản lý sản phẩm</Title>
          </Group>
          <Text c="dimmed" size="sm">
            Quản lý và tổ chức toàn bộ danh sách sản phẩm của bạn
          </Text>
        </Group>
      </Paper>

      {/* Options and Configs */}
      <Paper 
        shadow="xs" 
        p="md" 
        mb="md"
        radius="md"
        className="bg-white"
      >
        {/* Truyền viewMode và setViewMode vào OptionConfig */}
        <OptionConfig 
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </Paper>

      {/* Filters and Product List */}
      <Paper 
        shadow="xs" 
        radius="md" 
        className="bg-white"
      >
        {/* Filter Tabs */}
        <Box className="border-b border-gray-200">
          <FilterByStatus />
        </Box>
        
        {/* Product List - Truyền viewMode cho ProductList */}
        <Box p="md">
          <ProductList viewMode={viewMode} />
        </Box>
      </Paper>

      {/* Summary Stats (Optional) */}
      <Paper shadow="xs" p="md" mt="md" radius="md" className="bg-white">
        <Group justify="space-between" align="center">
          <Text size="sm" c="dimmed">Tổng số sản phẩm: 142</Text>
          <Group>
            <Text size="sm" c="dimmed">Lưu gần nhất: 12:45 PM - 24/05/2023</Text>
          </Group>
        </Group>
      </Paper>
    </Container>
  );
};

export default ProductPage;