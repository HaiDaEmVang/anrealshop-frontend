import {
  ActionIcon,
  Box,
  Button,
  Chip,
  Flex,
  Group,
  Paper,
  Select,
  Stack,
  Text
} from '@mantine/core';
import React, { useMemo } from 'react';
import {
  FiChevronRight,
  FiFilter,
  FiTrash2
} from 'react-icons/fi';
import { BRANDS, ORIGINS, SIZES, SORT_OPTIONS } from '../../../data/FilterData';

interface FilterProps {
  selectedBrands: string[];
  selectedOrigins: string[];
  selectedSizes: string[];
  sortBy: string;
  onOpenAllFilters: () => void;
  onResetFilters: () => void;
  onRemoveFilter: (type: string, value: string) => void;
  onAddFilter: (type: string, value: string) => void;
  onSortChange: (value: string) => void;
}

const Filter: React.FC<FilterProps> = ({ 
  selectedBrands,
  selectedOrigins,
  selectedSizes,
  sortBy,
  onOpenAllFilters,
  onResetFilters,
  onRemoveFilter,
  onAddFilter,
  onSortChange,
}) => {
  const hasActiveFilters = selectedBrands.length > 0 || 
                           selectedOrigins.length > 0 || 
                           selectedSizes.length > 0;
  
  const displayBrands = useMemo(() => {
    return BRANDS.slice(0, 3).map(brand => ({
      ...brand,
      selected: selectedBrands.includes(brand.value)
    }));
  }, [selectedBrands]);
  
  const displayOrigins = useMemo(() => {
    return ORIGINS.slice(0, 3).map(origin => ({
      ...origin,
      selected: selectedOrigins.includes(origin.value)
    }));
  }, [selectedOrigins]);

  const displaySizes = useMemo(() => {
    return SIZES.slice(0, 3).map(size => ({
      ...size,
      selected: selectedSizes.includes(size.value)
    }));
  }, [selectedSizes]);
  
  const showMoreBrands = BRANDS.length > 5;
  const showMoreOrigins = ORIGINS.length > 5;

  const handleBrandToggle = (value: string) => {
    if (selectedBrands.includes(value)) {
      onRemoveFilter('brand', value);
    } else {
      onAddFilter('brand', value);
    }
  };

  const handleOriginToggle = (value: string) => {
    if (selectedOrigins.includes(value)) {
      onRemoveFilter('origin', value);
    } else {
      onAddFilter('origin', value);
    }
  };

  const handleSizeToggle = (value: string) => {
    if (selectedSizes.includes(value)) {
      onRemoveFilter('size', value);
    } else {
      onAddFilter('size', value);
    }
  };

  return (
    <Paper p="xs" radius="md" shadow="sm" className="mb-6">
      <Flex
        wrap="wrap"
        justify="space-between"
        align="start" // Giữ align="start" để các mục con canh lề trên
        gap="xs"
      >
        <Box className="flex-1 min-w-0 flex flex-wrap items-center gap-2 mr-2">
          <Group gap="xs" wrap="wrap" className="items-center">
            <Text fw={500} size="sm" className="whitespace-nowrap !font-semibold">Thương hiệu:</Text>
            {displayBrands.map((brand) => (
              <Chip 
                key={brand.value} 
                checked={brand.selected}
                variant={brand.selected ? "filled" : "outline"}
                color={brand.selected ? "blue" : "gray"}
                size="sm"
                radius="lg"
                onClick={() => handleBrandToggle(brand.value)}
              >
                {brand.label}
              </Chip>
            ))}
            {showMoreBrands && (
              <Button 
                variant="subtle" 
                size="sm" 
                rightSection={<FiChevronRight size={14} />} 
                onClick={onOpenAllFilters} 
                px={3}
              >
                Xem thêm
              </Button>
            )}

            <Text color="dimmed" size="sm" className="mx-2">|</Text>
            <Text fw={500} size="sm" className="whitespace-nowrap !font-semibold">Xuất xứ:</Text>
            {displayOrigins.map((origin) => (
              <Chip 
                key={origin.value} 
                checked={origin.selected}
                variant={origin.selected ? "filled" : "outline"}
                color={origin.selected ? "blue" : "gray"}
                size="sm"
                radius="lg"
                onClick={() => handleOriginToggle(origin.value)}
              >
                {origin.label}
              </Chip>
            ))}
            {showMoreOrigins && (
              <Button 
                variant="subtle" 
                size="sm" 
                rightSection={<FiChevronRight size={14} />} 
                onClick={onOpenAllFilters}
                px={3}
              >
                Xem thêm
              </Button>
            )}

            <Text color="dimmed" size="sm" className="mx-2">|</Text>
            <Text fw={500} size="sm" className="whitespace-nowrap !font-semibold">Kích thước:</Text>
            {displaySizes.map((size) => (
              <Chip 
                key={size.value} 
                checked={size.selected}
                variant={size.selected ? "filled" : "outline"}
                color={size.selected ? "blue" : "gray"}
                size="sm"
                radius="lg"
                onClick={() => handleSizeToggle(size.value)}
              >
                {size.label}
              </Chip>
            ))}
            {/* {showMoreSizes && (
              <Button 
                variant="subtle" 
                size="xs" 
                rightSection={<FiChevronRight size={14} />} 
                onClick={onOpenAllFilters}
                px={3}
              >
                Xem thêm
              </Button>
            )} */}
          </Group>
        </Box>
        
        {/* Thay đổi Group thành Stack ở đây */}
        <Stack gap="xs" className="flex-shrink-0" align="flex-end">
          <Group gap="xs"> {/* Nhóm các nút Xóa và Tất cả */}
            {hasActiveFilters && (
              <ActionIcon
                color="red"
                variant="subtle"
                size="lg"
                onClick={onResetFilters}
                title="Xóa tất cả bộ lọc"
              >
                <FiTrash2 size={18} />
              </ActionIcon>
            )}
            
            <Button 
              variant="light" 
              size="sm" 
              leftSection={<FiFilter size={14} />}
              onClick={onOpenAllFilters}
              className="whitespace-nowrap"
            >
              Tất cả
            </Button>
          </Group>

          {/* Select sắp xếp nằm dưới nhóm nút */}
          <Select
            size="xs"
            placeholder="Sắp xếp theo"
            data={SORT_OPTIONS}
            value={sortBy}
            onChange={(val) => {
              if (val) onSortChange(val);
            }}
            className="min-w-[150px]" // Đảm bảo Select có chiều rộng tối thiểu
          />
        </Stack>
      </Flex>
    </Paper>
  );
};

export default Filter;