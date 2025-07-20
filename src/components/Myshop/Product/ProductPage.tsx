
import { useState, useEffect, useCallback } from 'react';
import { Anchor, Box, Breadcrumbs, Container, Group, Paper, Text, Title } from '@mantine/core';
import { FiChevronRight, FiShoppingBag } from 'react-icons/fi';
import FilterByStatus from './Managerment/Filter/FilterByStatus';
import OptionConfig from './Managerment/OptionConfig/OptionConfig';
import FilterProduct from './Managerment/Filter/FilterProduct';
import ListView from './Managerment/ProductView/ListView/ListView';
import GridView from './Managerment/ProductView/GridView/GridView';
import type { MyShopProductDto, ProductStatus } from '../../../types/ProductType';
import { useProduct } from '../../../hooks/useProduct';
import type { BaseCategoryDto } from '../../../types/CategoryType';
import Pagination from './Managerment/ProductView/Pagination';
import NonProductFound from './Managerment/ProductView/NonProductFound';
import CheckboxSelected from './Managerment/ProductView/CheckboxSelected';

const ProductPage = () => {
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid');

  // State cho filters
  const [searchQuery, setSearchQuery] = useState('');
  const [category, setCategory] = useState<BaseCategoryDto | null>(null);
  const [sortBy, setSortBy] = useState<string | null>(null);
  const [status, setStatus] = useState<ProductStatus>('ALL');

  // State cho selected products
  const [selectedProductIds, setSelectedProductIds] = useState<string[]>([]);
  const [activePage, setActivePage] = useState(1);


  const {
    products,
    totalCount,
    totalPages,
    currentPage,
    isLoading,
    error,
    isEmpty,
    fetchProducts,
    updateVisibility,
    refresh
  } = useProduct({
    autoFetch: false,
    initialParams: {
      page: 0,
      limit: viewMode === 'list' ? 10 : 12,
      status: status !== 'ALL' ? status : undefined
    }
  });

  // Unified function to fetch products with current filters
  const loadProducts = useCallback(() => {
    fetchProducts({
      page: activePage - 1,
      limit: viewMode === 'list' ? 10 : 12,
      status: status !== 'ALL' ? status : undefined,
      search: searchQuery || undefined,
      categoryId: category?.urlSlug || category?.id || undefined,
      sortBy: sortBy || undefined
    });
  }, [activePage, viewMode, status, searchQuery, category, sortBy, fetchProducts]);

  useEffect(() => {
    loadProducts();
  }, [status, activePage])

  const handleStatusChange = useCallback((newStatus: ProductStatus) => {
    setStatus(newStatus);
    setActivePage(1);
  }, [loadProducts]);

  const onFetchWithParam = useCallback(() => {
    loadProducts();
  }, [loadProducts]);


  // Handler functions for product selection
  const handleSelectAll = (checked: boolean) => {
    if (checked) {
      setSelectedProductIds(products.map(p => p.id));
    } else {
      setSelectedProductIds([]);
    }
  };

  const handleSelectProduct = (productId: string, checked: boolean) => {
    if (checked) {
      setSelectedProductIds(prev => [...prev, productId]);
    } else {
      setSelectedProductIds(prev => prev.filter(id => id !== productId));
    }
  };

  const handleToggleStatus = useCallback((productId: string, visible: boolean) => {
    updateVisibility(productId, visible)
      .then(() => {
        loadProducts();
      })
  }, [loadProducts, updateVisibility]);



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
        <OptionConfig
          viewMode={viewMode}
          onViewModeChange={setViewMode}
        />
      </Paper>

      {/* Filters */}
      <Paper
        shadow="xs"
        mb="md"
        radius="md"
        className="bg-white"
      >
        <FilterByStatus
          selectedStatus={status}
          onStatusChange={handleStatusChange}
        />
        <FilterProduct
          searchQuery={searchQuery}
          onSearchChange={setSearchQuery}
          category={category}
          onCategoryChange={setCategory}
          sortBy={sortBy}
          onSortChange={setSortBy}
          onFetchWithParam={onFetchWithParam}
        />

        {isEmpty && (
          <NonProductFound
            searchQuery={searchQuery}
            category={category}
          />
        )}

        {!isEmpty && (
          <div className={viewMode === 'list' ? 'pl-8 pr-4' : 'pl-6 pr-4'}>
            <CheckboxSelected
              selectedCount={selectedProductIds.length}
              totalCount={products.length}
              onSelectAll={handleSelectAll}
            />
          </div>
        )}

        {viewMode === 'list' && !isEmpty ? (
          <ListView
            products={products}
            isLoading={isLoading}
            selectedProducts={selectedProductIds}
            onSelectAll={handleSelectAll}
            onSelectProduct={handleSelectProduct}
            onToggleStatus={handleToggleStatus}
          />
        ) : (
          <GridView
            products={products}
            isLoading={isLoading}
            selectedProducts={selectedProductIds}
            onSelectAll={handleSelectAll}
            onSelectProduct={handleSelectProduct}
            onToggleStatus={handleToggleStatus}
          />
        )}

        <Pagination
          currentPage={activePage}
          totalPages={totalPages}
          totalItems={totalCount}
          itemsPerPage={viewMode === 'list' ? 10 : 12}
          onPageChange={setActivePage}
        />
      </Paper>

      
    </Container>
  );
};

export default ProductPage;