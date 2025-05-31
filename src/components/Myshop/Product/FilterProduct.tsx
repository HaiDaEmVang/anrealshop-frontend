import { useState } from 'react';
import { 
  TextInput, 
  Select, 
  Group, 
  Text, 
  ActionIcon, 
  Menu, 
} from '@mantine/core';
import { 
  FiSearch, 
  FiFilter,
  FiMoreVertical,
  FiEye,
  FiEyeOff,
  FiCopy,
  FiTrash2
} from 'react-icons/fi';

interface FilterProductProps {
  searchQuery: string;
  onSearchChange: (value: string) => void;
  category: string | null;
  onCategoryChange: (value: string | null) => void;
  sortBy: string | null;
  onSortChange: (value: string | null) => void;
  selectedProducts: string[];
  onBulkAction: (action: 'show' | 'hide' | 'duplicate' | 'delete') => void;
}

const FilterProduct = ({
  searchQuery,
  onSearchChange,
  category,
  onCategoryChange,
  sortBy,
  onSortChange,
  selectedProducts,
  onBulkAction
}: FilterProductProps) => {
  
  return (
    <div className="mb-4 bg-white p-4 rounded-md shadow-sm">
      <Group justify="space-between" mb="sm">
        <TextInput
          placeholder="Tìm kiếm sản phẩm theo tên..."
          leftSection={<FiSearch size={16} />}
          value={searchQuery}
          onChange={(e) => onSearchChange(e.currentTarget.value)}
          style={{ width: '320px' }}
        />
        
        <Group>
          <Select
            placeholder="Lọc theo danh mục"
            clearable
            leftSection={<FiFilter size={16} />}
            data={[
              { value: 'Thời trang nam', label: 'Thời trang nam' },
              { value: 'Thời trang nữ', label: 'Thời trang nữ' },
              { value: 'Giày dép', label: 'Giày dép' },
              { value: 'Phụ kiện', label: 'Phụ kiện' },
              { value: 'Điện tử', label: 'Điện tử' },
            ]}
            value={category}
            onChange={onCategoryChange}
          />
          
          <Select
            placeholder="Sắp xếp theo"
            clearable
            data={[
              { value: 'name-asc', label: 'Tên A-Z' },
              { value: 'name-desc', label: 'Tên Z-A' },
              { value: 'price-asc', label: 'Giá tăng dần' },
              { value: 'price-desc', label: 'Giá giảm dần' },
              { value: 'newest', label: 'Mới nhất' },
              { value: 'bestseller', label: 'Bán chạy nhất' },
            ]}
            value={sortBy}
            onChange={onSortChange}
          />
        </Group>
      </Group>
      
      {selectedProducts.length > 0 && (
        <Group className="p-2 bg-gray-50 rounded">
          <Text size="sm">{selectedProducts.length} sản phẩm được chọn</Text>
          <Menu shadow="md" position="bottom-start">
            <Menu.Target>
              <ActionIcon variant="light">
                <FiMoreVertical size={16} />
              </ActionIcon>
            </Menu.Target>
            <Menu.Dropdown>
              <Menu.Item 
                leftSection={<FiEye size={14} />}
                onClick={() => onBulkAction('show')}
              >
                Hiển thị đã chọn
              </Menu.Item>
              <Menu.Item 
                leftSection={<FiEyeOff size={14} />}
                onClick={() => onBulkAction('hide')}
              >
                Ẩn đã chọn
              </Menu.Item>
              <Menu.Item 
                leftSection={<FiCopy size={14} />}
                onClick={() => onBulkAction('duplicate')}
              >
                Nhân bản đã chọn
              </Menu.Item>
              <Menu.Divider />
              <Menu.Item 
                leftSection={<FiTrash2 size={14} />} 
                color="red"
                onClick={() => onBulkAction('delete')}
              >
                Xóa đã chọn
              </Menu.Item>
            </Menu.Dropdown>
          </Menu>
        </Group>
      )}
    </div>
  );
};

export default FilterProduct;