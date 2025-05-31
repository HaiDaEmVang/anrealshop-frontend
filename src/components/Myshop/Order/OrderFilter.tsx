import { Button, Card, Checkbox, Group, Menu, Select, Text, TextInput } from '@mantine/core';
import { FiCheckCircle, FiChevronDown, FiClock, FiEdit, FiEye, FiFilter, FiPackage, FiPrinter, FiSearch, FiShare2, FiTruck, FiX } from 'react-icons/fi';

interface OrderFilterProps {
  searchTerm: string;
  onSearchChange: (value: string) => void;
  categoryFilter: string | null;
  onCategoryChange: (value: string | null) => void;
  sortBy: string | null;
  onSortByChange: (value: string | null) => void;
  detailView: boolean;
  onDetailViewChange: (value: boolean) => void;
  selectedItems: string[];
  totalItems: number;
  onSelectAll: (checked: boolean) => void;
  onBulkStatusUpdate: (status: string) => void;
  onPrint: () => void;
  onExport: () => void;
  categories: { value: string; label: string }[];
}

const OrderFilter = ({
  searchTerm,
  onSearchChange,
  categoryFilter,
  onCategoryChange,
  sortBy,
  onSortByChange,
  detailView,
  onDetailViewChange,
  selectedItems,
  totalItems,
  onSelectAll,
  onBulkStatusUpdate,
  onPrint,
  onExport,
  categories
}: OrderFilterProps) => {
  return (
    <Card withBorder p="md" mb="md">
      {/* Dòng trên với các ô tìm kiếm và lọc */}
      <Group justify="apart" mb="md">
        <Group>
          <TextInput
            placeholder="Tìm kiếm sản phẩm, mã đơn hàng..."
            value={searchTerm}
            onChange={(e) => onSearchChange(e.currentTarget.value)}
            leftSection={<FiSearch size={16} />}
            style={{ width: 280 }}
          />
          <Select
            placeholder="Lọc theo danh mục"
            value={categoryFilter}
            onChange={onCategoryChange}
            data={categories}
            clearable
            leftSection={<FiFilter size={16} />}
            style={{ width: 200 }}
          />
        </Group>
        <Group>
          <Select
            placeholder="Sắp xếp theo"
            value={sortBy}
            onChange={onSortByChange}
            data={[
              { value: 'newest', label: 'Đơn hàng mới nhất' },
              { value: 'oldest', label: 'Đơn hàng cũ nhất' },
              { value: 'price-asc', label: 'Giá tăng dần' },
              { value: 'price-desc', label: 'Giá giảm dần' },
              { value: 'name-asc', label: 'Tên A-Z' },
              { value: 'name-desc', label: 'Tên Z-A' },
            ]}
            style={{ width: 200 }}
          />
          <Button 
            variant={detailView ? "filled" : "outline"} 
            leftSection={<FiEye size={16} />}
            onClick={() => onDetailViewChange(!detailView)}
          >
            Chế độ xem chi tiết
          </Button>
        </Group>
      </Group>
      
      {/* Dòng dưới với checkbox và các hành động hàng loạt */}
      <Group justify="apart">
        <Group>
          <Checkbox
            checked={selectedItems.length === totalItems && totalItems > 0}
            indeterminate={selectedItems.length > 0 && selectedItems.length < totalItems}
            onChange={(e) => onSelectAll(e.currentTarget.checked)}
            label={`Chọn tất cả (${totalItems})`}
          />
          {selectedItems.length > 0 && (
            <Text size="sm" c="dimmed">
              Đã chọn {selectedItems.length} sản phẩm
            </Text>
          )}
        </Group>
        
        {selectedItems.length > 0 && (
          <Group>
            <Menu shadow="md" width={200}>
              <Menu.Target>
                <Button 
                  variant="outline" 
                  leftSection={<FiEdit size={16} />}
                  rightSection={<FiChevronDown size={16} />}
                  size="xs"
                >
                  Cập nhật trạng thái
                </Button>
              </Menu.Target>
              <Menu.Dropdown>
                <Menu.Item
                  rightSection={<FiClock size={14} />}
                  onClick={() => onBulkStatusUpdate('pending')}
                >
                  Chờ xác nhận
                </Menu.Item>
                <Menu.Item
                  rightSection={<FiPackage size={14} />}
                  onClick={() => onBulkStatusUpdate('processing')}
                >
                  Đang xử lý
                </Menu.Item>
                <Menu.Item
                  rightSection={<FiTruck size={14} />}
                  onClick={() => onBulkStatusUpdate('shipping')}
                >
                  Đang giao hàng
                </Menu.Item>
                <Menu.Item
                  rightSection={<FiCheckCircle size={14} />}
                  onClick={() => onBulkStatusUpdate('completed')}
                >
                  Hoàn thành
                </Menu.Item>
                <Menu.Divider />
                <Menu.Item
                  rightSection={<FiX size={14} />}
                  color="red"
                  onClick={() => onBulkStatusUpdate('cancelled')}
                >
                  Đã hủy
                </Menu.Item>
              </Menu.Dropdown>
            </Menu>
            <Button 
              variant="outline"
              leftSection={<FiPrinter size={16} />}
              size="xs"
              onClick={onPrint}
            >
              In đơn hàng
            </Button>
            <Button 
              variant="outline"
              leftSection={<FiShare2 size={16} />}
              size="xs"
              onClick={onExport}
            >
              Xuất Excel
            </Button>
          </Group>
        )}
      </Group>
    </Card>
  );
};

export default OrderFilter;