import {
  Box,
  Center,
  Group,
  LoadingOverlay,
  Pagination,
  Paper,
  SimpleGrid,
  Stack,
  Text
} from '@mantine/core';
import React from 'react';
import { type Product } from '../../../data/FilterData';

interface ProductListProps {
  products: Product[];
  loading: boolean;
  totalProducts?: number;
  currentPage?: number;
  onPageChange?: (page: number) => void;
  itemsPerPage?: number;
  onItemsPerPageChange?: (value: string | null) => void;
}

const ProductList: React.FC<ProductListProps> = ({
  products,
  loading,
  totalProducts = 0,
  currentPage = 1,
  onPageChange = () => { },
  itemsPerPage = 5,
  // onItemsPerPageChange = () => {}
}) => {
  // Tính toán tổng số trang
  const totalPages = Math.ceil(totalProducts / itemsPerPage) || 1;

  return (
    <Box pos="relative">
      <LoadingOverlay visible={loading} />

      {products.length > 0 ? (
        <Stack gap="lg">
          {/* Danh sách sản phẩm */}
          <SimpleGrid cols={{ base: 2, sm: 3, md: 4 }} spacing="md">
            {products.map(product => (
              // <ProductCard
              //   key={product.id}
              //   product={product}
              // />
              <div key={product.id}>fix no nghe hai </div>
            ))}
          </SimpleGrid>

          {/* Phân trang */}
          {totalProducts > itemsPerPage && (
            <Box className="bg-white p-4 rounded-lg shadow-sm flex items-center justify-between">
              <Group justify="apart">
                <Text size="sm" color="dimmed">
                  Hiển thị {Math.min((currentPage - 1) * itemsPerPage + 1, totalProducts)} - {Math.min(currentPage * itemsPerPage, totalProducts)} trong tổng số {totalProducts} sản phẩm
                </Text>
              </Group>

              <Center >
                <Pagination
                  value={currentPage}
                  onChange={onPageChange}
                  total={totalPages}
                  siblings={1}
                  boundaries={1}
                />
              </Center>
            </Box>
          )}
        </Stack>
      ) : (
        <Paper p="xl" withBorder>
          <Text ta="center" size="lg">
            Không có sản phẩm nào trong danh mục này
          </Text>
        </Paper>
      )}
    </Box>
  );
};

export default ProductList;