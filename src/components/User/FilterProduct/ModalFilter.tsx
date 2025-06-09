import React, { useState, useEffect } from 'react';
import {
  Modal,
  RangeSlider,
  Checkbox,
  SimpleGrid,
  ScrollArea,
  Divider,
  Title,
  Text,
  Button,
  Group,
  Box,
  Chip,
  Stack,
  ActionIcon
} from '@mantine/core';
import { BRANDS, COLORS, ORIGINS, PRICE_SUGGESTIONS, SIZES, RATING_OPTIONS } from '../../../data/FilterData';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';

interface ModalFilterProps {
  opened: boolean;
  onClose: () => void;
  initialPriceRange: [number, number];
  initialSelectedBrands: string[];
  initialSelectedColors: string[];
  initialSelectedSizes: string[];
  initialSelectedOrigins: string[];
  initialSelectedRating: number | null;
  
  setPriceRange: (range: [number, number]) => void;
  setSelectedBrands: (brands: string[]) => void;
  setSelectedColors: (colors: string[]) => void;
  setSelectedSizes: (sizes: string[]) => void;
  setSelectedOrigins: (origins: string[]) => void;
  setSelectedRating: (rating: number | null) => void;
  
  onApplyFilters: () => void;
}

const ModalFilter: React.FC<ModalFilterProps> = ({
  opened,
  onClose,
  initialPriceRange,
  initialSelectedBrands,
  initialSelectedColors,
  initialSelectedSizes,
  initialSelectedOrigins,
  initialSelectedRating,
  setPriceRange: setParentPriceRange,
  setSelectedBrands: setParentSelectedBrands,
  setSelectedColors: setParentSelectedColors,
  setSelectedSizes: setParentSelectedSizes,
  setSelectedOrigins: setParentSelectedOrigins,
  setSelectedRating: setParentSelectedRating,
  onApplyFilters
}) => {
  const [localPriceRange, setLocalPriceRange] = useState<[number, number]>(initialPriceRange);
  const [localSelectedBrands, setLocalSelectedBrands] = useState<string[]>(initialSelectedBrands);
  const [localSelectedColors, setLocalSelectedColors] = useState<string[]>(initialSelectedColors);
  const [localSelectedSizes, setLocalSelectedSizes] = useState<string[]>(initialSelectedSizes);
  const [localSelectedOrigins, setLocalSelectedOrigins] = useState<string[]>(initialSelectedOrigins);
  const [localSelectedRating, setLocalSelectedRating] = useState<number | null>(initialSelectedRating);

  useEffect(() => {
    if (opened) {
      setLocalPriceRange(initialPriceRange);
      setLocalSelectedBrands(initialSelectedBrands);
      setLocalSelectedColors(initialSelectedColors);
      setLocalSelectedSizes(initialSelectedSizes);
      setLocalSelectedOrigins(initialSelectedOrigins);
      setLocalSelectedRating(initialSelectedRating);
    }
  }, [
    opened, 
    initialPriceRange, 
    initialSelectedBrands, 
    initialSelectedColors, 
    initialSelectedSizes, 
    initialSelectedOrigins, 
    initialSelectedRating
  ]);

  const [showAllBrands, setShowAllBrands] = useState(false);
  const [showAllOrigins, setShowAllOrigins] = useState(false);
  const [showAllColors, setShowAllColors] = useState(false);

  const VISIBLE_ITEMS_WHEN_COLLAPSED = 6;

  const visibleBrands = !showAllBrands
    ? BRANDS.filter(brand => localSelectedBrands.includes(brand.value) || BRANDS.slice(0, VISIBLE_ITEMS_WHEN_COLLAPSED).some(b => b.value === brand.value))
        .concat(BRANDS.filter(brand => !localSelectedBrands.includes(brand.value) && !BRANDS.slice(0, VISIBLE_ITEMS_WHEN_COLLAPSED).some(b => b.value === brand.value)).slice(0, Math.max(0, VISIBLE_ITEMS_WHEN_COLLAPSED - localSelectedBrands.length)))
        .filter((value, index, self) => self.findIndex(v => v.value === value.value) === index) 
        .slice(0, VISIBLE_ITEMS_WHEN_COLLAPSED)
    : BRANDS;
  
  const visibleOrigins = !showAllOrigins
    ? ORIGINS.filter(origin => localSelectedOrigins.includes(origin.value) || ORIGINS.slice(0, VISIBLE_ITEMS_WHEN_COLLAPSED).some(o => o.value === origin.value))
        .concat(ORIGINS.filter(origin => !localSelectedOrigins.includes(origin.value) && !ORIGINS.slice(0, VISIBLE_ITEMS_WHEN_COLLAPSED).some(o => o.value === origin.value)).slice(0, Math.max(0, VISIBLE_ITEMS_WHEN_COLLAPSED - localSelectedOrigins.length)))
        .filter((value, index, self) => self.findIndex(v => v.value === value.value) === index)
        .slice(0, VISIBLE_ITEMS_WHEN_COLLAPSED)
    : ORIGINS;

  const visibleColors = !showAllColors
    ? COLORS.filter(color => localSelectedColors.includes(color.value) || COLORS.slice(0, VISIBLE_ITEMS_WHEN_COLLAPSED).some(c => c.value === color.value))
        .concat(COLORS.filter(color => !localSelectedColors.includes(color.value) && !COLORS.slice(0, VISIBLE_ITEMS_WHEN_COLLAPSED).some(c => c.value === color.value)).slice(0, Math.max(0, VISIBLE_ITEMS_WHEN_COLLAPSED - localSelectedColors.length)))
        .filter((value, index, self) => self.findIndex(v => v.value === value.value) === index)
        .slice(0, VISIBLE_ITEMS_WHEN_COLLAPSED)
    : COLORS;

  const handleApply = () => {
    setParentPriceRange(localPriceRange);
    setParentSelectedBrands(localSelectedBrands);
    setParentSelectedColors(localSelectedColors);
    setParentSelectedSizes(localSelectedSizes);
    setParentSelectedOrigins(localSelectedOrigins);
    setParentSelectedRating(localSelectedRating);
    onApplyFilters(); 
  };
  
  const handleClose = () => {
    setLocalPriceRange(initialPriceRange);
    setLocalSelectedBrands(initialSelectedBrands);
    setLocalSelectedColors(initialSelectedColors);
    setLocalSelectedSizes(initialSelectedSizes);
    setLocalSelectedOrigins(initialSelectedOrigins);
    setLocalSelectedRating(initialSelectedRating);
    onClose();
  };

  return (
    <Modal
      opened={opened}
      onClose={handleClose} 
      title={<Text size="lg" fw={600}>Tất cả bộ lọc</Text>}
      size="lg"
      styles={{
        content: { 
          height: '90vh',
          display: 'flex',
          flexDirection: 'column',
        },
        body: { 
          flex: 1, // Hoặc flexGrow: 1
          display: 'flex',
          flexDirection: 'column',
          minHeight: 0, // Cho phép body co lại nếu cần
          // overflow: 'hidden', // Có thể không cần nếu cấu trúc flex đã đúng
        }
      }}
    >
      <ScrollArea 
        style={{ 
            flex: 1, // Hoặc flexGrow: 1, cho phép ScrollArea chiếm không gian
            minHeight: 0, // Cho phép ScrollArea co lại
        }} 
        offsetScrollbars
      >
        <Stack gap="xl" pb="md">
          {/* Phần giá */}
          <Box className="bg-gray-50 p-4 rounded-lg">
            <Group justify="apart" mb="md">
              <Title order={5}>Giá</Title>
            </Group>
            <Group mb="md">
              {PRICE_SUGGESTIONS.map((suggestion, index) => (
                <Button
                  key={index}
                  size="xs"
                  variant={
                    localPriceRange[0] === suggestion.min && localPriceRange[1] === suggestion.max
                      ? "filled"
                      : "light"
                  }
                  color={
                    localPriceRange[0] === suggestion.min && localPriceRange[1] === suggestion.max
                      ? "blue" 
                      : "gray"
                  }
                  onClick={() => setLocalPriceRange([suggestion.min, suggestion.max])}
                  radius="md"
                >
                  {suggestion.label}
                </Button>
              ))}
            </Group>
            <RangeSlider
              min={0}
              max={5000000}
              step={50000}
              minRange={100000}
              value={localPriceRange}
              onChange={setLocalPriceRange}
              label={(value) => `${value.toLocaleString()}₫`}
              mb="sm"
              color="blue"
              thumbSize={16}
              styles={{
                thumb: { borderWidth: 2, height: 16, width: 16, boxShadow: '0 2px 4px rgba(0, 0, 0, 0.1)' },
                track: { height: 6 },
                bar: { height: 6 }
              }}
            />
            <Group justify="space-between">
              <Text size="sm" fw={500}>{localPriceRange[0].toLocaleString()}₫</Text>
              <Text size="sm" fw={500}>{localPriceRange[1].toLocaleString()}₫</Text>
            </Group>
          </Box>
          
          <Divider />

          {/* Phần thương hiệu */}
          <Box className="bg-gray-50 p-4 rounded-lg">
            <Group justify="apart" mb="md">
              <Title order={5}>Thương hiệu</Title>
              <ActionIcon size="sm" variant="subtle" onClick={() => setShowAllBrands(!showAllBrands)} title={showAllBrands ? "Thu gọn" : "Xem thêm"}>
                {showAllBrands ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </ActionIcon>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
              {(showAllBrands ? BRANDS : visibleBrands).map((brand) => (
                <Checkbox
                  key={brand.value}
                  label={brand.label}
                  checked={localSelectedBrands.includes(brand.value)}
                  onChange={(event) => {
                    const checked = event.currentTarget.checked;
                    setLocalSelectedBrands(
                      checked
                        ? [...localSelectedBrands, brand.value]
                        : localSelectedBrands.filter((b) => b !== brand.value)
                    );
                  }}
                  styles={{ input: { cursor: 'pointer' }, label: { cursor: 'pointer' } }}
                />
              ))}
            </SimpleGrid>
            {!showAllBrands && BRANDS.length > VISIBLE_ITEMS_WHEN_COLLAPSED && (
              <Button variant="subtle" size="xs" mt="sm" onClick={() => setShowAllBrands(true)} rightSection={<FiChevronDown size={14} />} color="gray">
                Xem thêm {BRANDS.length - visibleBrands.length} thương hiệu
              </Button>
            )}
          </Box>

          <Divider />

          {/* Phần màu sắc */}
          <Box className="bg-gray-50 p-4 rounded-lg">
            <Group justify="apart" mb="md">
              <Title order={5}>Màu sắc</Title>
              <ActionIcon size="sm" variant="subtle" onClick={() => setShowAllColors(!showAllColors)} title={showAllColors ? "Thu gọn" : "Xem thêm"}>
                {showAllColors ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </ActionIcon>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
              {(showAllColors ? COLORS : visibleColors).map((color) => (
                <Checkbox
                  key={color.value}
                  label={color.label}
                  checked={localSelectedColors.includes(color.value)}
                  onChange={(event) => {
                    const checked = event.currentTarget.checked;
                    setLocalSelectedColors(
                      checked
                        ? [...localSelectedColors, color.value]
                        : localSelectedColors.filter(c => c !== color.value)
                    );
                  }}
                  styles={{ input: { cursor: 'pointer' }, label: { cursor: 'pointer' } }}
                />
              ))}
            </SimpleGrid>
            {!showAllColors && COLORS.length > VISIBLE_ITEMS_WHEN_COLLAPSED && (
              <Button variant="subtle" size="xs" mt="sm" onClick={() => setShowAllColors(true)} rightSection={<FiChevronDown size={14} />} color="gray">
                Xem thêm {COLORS.length - visibleColors.length} màu sắc
              </Button>
            )}
          </Box>

          <Divider />

          {/* Phần kích thước */}
          <Box className="bg-gray-50 p-4 rounded-lg">
            <Title order={5} mb="md">Kích thước</Title>
            <Group gap="xs">
              {SIZES.map((size) => (
                <Chip
                  key={size.value}
                  checked={localSelectedSizes.includes(size.value)}
                  onChange={() => {
                    setLocalSelectedSizes(prevSizes => 
                      prevSizes.includes(size.value)
                        ? prevSizes.filter(s => s !== size.value)
                        : [...prevSizes, size.value]
                    );
                  }}
                  size="sm"
                  radius="sm"
                  variant={localSelectedSizes.includes(size.value) ? "filled" : "outline"}
                  color={localSelectedSizes.includes(size.value) ? "blue" : "gray"}
                >
                  {size.label}
                </Chip>
              ))}
            </Group>
          </Box>

          <Divider />

          {/* Phần xuất xứ */}
          <Box className="bg-gray-50 p-4 rounded-lg">
            <Group justify="apart" mb="md">
              <Title order={5}>Xuất xứ</Title>
              <ActionIcon size="sm" variant="subtle" onClick={() => setShowAllOrigins(!showAllOrigins)} title={showAllOrigins ? "Thu gọn" : "Xem thêm"}>
                {showAllOrigins ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              </ActionIcon>
            </Group>
            <SimpleGrid cols={{ base: 1, sm: 2, md: 3 }}>
              {(showAllOrigins ? ORIGINS : visibleOrigins).map((origin) => (
                <Checkbox
                  key={origin.value}
                  label={origin.label}
                  checked={localSelectedOrigins.includes(origin.value)}
                  onChange={(event) => {
                    const checked = event.currentTarget.checked;
                    setLocalSelectedOrigins(
                      checked
                        ? [...localSelectedOrigins, origin.value]
                        : localSelectedOrigins.filter((o) => o !== origin.value)
                    );
                  }}
                  styles={{ input: { cursor: 'pointer' }, label: { cursor: 'pointer' } }}
                />
              ))}
            </SimpleGrid>
            {!showAllOrigins && ORIGINS.length > VISIBLE_ITEMS_WHEN_COLLAPSED && (
              <Button variant="subtle" size="xs" mt="sm" onClick={() => setShowAllOrigins(true)} rightSection={<FiChevronDown size={14} />} color="gray">
                Xem thêm {ORIGINS.length - visibleOrigins.length} xuất xứ
              </Button>
            )}
          </Box>

          <Divider />

          {/* Rating Filter Section */}
          <Box className="bg-gray-50 p-4 rounded-lg">
            <Title order={5} mb="md">Đánh giá</Title>
            <Group gap="xs">
              {RATING_OPTIONS.map((rateOpt) => (
                <Chip
                  key={`modal-rate-${rateOpt.value}`}
                  checked={localSelectedRating === rateOpt.value}
                  onChange={() => { 
                    setLocalSelectedRating(prevRating =>
                      prevRating === rateOpt.value ? null : rateOpt.value
                    );
                  }}
                  size="sm"
                  radius="sm"
                  variant={localSelectedRating === rateOpt.value ? "filled" : "outline"}
                  color={localSelectedRating === rateOpt.value ? "blue" : "gray"}
                >
                  {rateOpt.label}
                </Chip>
              ))}
            </Group>
          </Box>
        </Stack>
      </ScrollArea>
      
      <Divider my="md" />
      <Group justify="flex-end">
        <Button variant="subtle" onClick={handleClose} color="gray">
          Hủy
        </Button>
        <Button onClick={handleApply} color="blue">
          Áp dụng bộ lọc
        </Button>
      </Group>
    </Modal>
  );
};

export default ModalFilter;