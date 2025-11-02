import { Pagination as MantinePagination, Text } from '@mantine/core';

interface PaginationProps {
  currentPage: number;
  totalPages: number;
  totalItems: number;
  itemsPerPage: number;
  onPageChange: (page: number) => void;
}

const PaginationCustom = ({
  currentPage,
  totalPages,
  totalItems,
  itemsPerPage,
  onPageChange
}: PaginationProps) => {
  const startItem = (currentPage - 1) * itemsPerPage + 1;
  const endItem = Math.min(currentPage * itemsPerPage, totalItems);

  return (
    <div className="px-4">
      <div className="px-2 py-4 flex justify-between items-center border-t-2 border-gray-200">
        <Text size="sm" c="dimmed">
          Hiển thị {startItem} - {endItem} trên {totalItems} mục | Cập nhật lúc: {new Date().toLocaleTimeString('vi-VN')} - {new Date().toLocaleDateString('vi-VN')}
        </Text>
        <MantinePagination
          value={currentPage}
          onChange={onPageChange}
          total={totalPages}
          size="sm"
          radius="md"
        />
      </div>
    </div>
  );
};

export default PaginationCustom;