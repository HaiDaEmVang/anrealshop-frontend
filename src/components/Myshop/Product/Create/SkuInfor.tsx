import {
  ActionIcon,
  Button,
  Collapse,
  Drawer,
  Group,
  MultiSelect,
  Paper,
  Select,
  Stack,
  TextInput,
  Title,
  Tooltip
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiPlus, FiSettings } from 'react-icons/fi';

interface SkuAttribute {
  key: string;
  value: string;
  id?: string;
}

interface SkuInforProps {
  form: UseFormReturnType<any>;
}

// Sample data for each attribute type
const SAMPLE_MATERIALS = [
  { value: 'cotton', label: 'Cotton' },
  { value: 'polyester', label: 'Polyester' },
  { value: 'leather', label: 'Da' },
  { value: 'nylon', label: 'Nylon' },
  { value: 'denim', label: 'Denim' },
  { value: 'wool', label: 'Len' },
  { value: 'silk', label: 'Lụa' },
];

const SAMPLE_STYLES = [
  { value: 'casual', label: 'Thường ngày' },
  { value: 'formal', label: 'Trang trọng' },
  { value: 'streetwear', label: 'Đường phố' },
  { value: 'sporty', label: 'Thể thao' },
  { value: 'vintage', label: 'Cổ điển' },
  { value: 'minimalist', label: 'Tối giản' },
];

const SAMPLE_PATTERNS = [
  { value: 'solid', label: 'Trơn' },
  { value: 'stripe', label: 'Sọc' },
  { value: 'floral', label: 'Hoa' },
  { value: 'check', label: 'Caro' },
  { value: 'plaid', label: 'Kẻ ô' },
  { value: 'dotted', label: 'Chấm bi' },
  { value: 'geometric', label: 'Hình học' },
];

const SAMPLE_TARGET_AUDIENCES = [
  { value: 'men', label: 'Nam' },
  { value: 'women', label: 'Nữ' },
  { value: 'unisex', label: 'Unisex' },
  { value: 'kids', label: 'Trẻ em' },
  { value: 'teenagers', label: 'Thanh thiếu niên' },
  { value: 'adults', label: 'Người lớn' },
];

const SAMPLE_BRANDS = [
  { value: 'nike', label: 'Nike' },
  { value: 'adidas', label: 'Adidas' },
  { value: 'zara', label: 'Zara' },
  { value: 'hm', label: 'H&M' },
  { value: 'levis', label: 'Levi\'s' },
  { value: 'uniqlo', label: 'Uniqlo' },
];

const SAMPLE_ORIGINS = [
  { value: 'vietnam', label: 'Việt Nam' },
  { value: 'china', label: 'Trung Quốc' },
  { value: 'japan', label: 'Nhật Bản' },
  { value: 'korea', label: 'Hàn Quốc' },
  { value: 'usa', label: 'Mỹ' },
  { value: 'italy', label: 'Ý' },
  { value: 'france', label: 'Pháp' },
  { value: 'thailand', label: 'Thái Lan' },
];

const ATTRIBUTE_MAP = {
  material: {
    label: 'Chất liệu',
    placeholder: 'Chọn chất liệu',
    data: SAMPLE_MATERIALS,
    tooltip: 'Thêm chất liệu mới'
  },
  style: {
    label: 'Phong cách',
    placeholder: 'Chọn phong cách',
    data: SAMPLE_STYLES,
    tooltip: 'Thêm phong cách mới'
  },
  pattern: {
    label: 'Mẫu',
    placeholder: 'Chọn mẫu',
    data: SAMPLE_PATTERNS,
    tooltip: 'Thêm mẫu mới'
  },
  targetAudience: {
    label: 'Đối tượng',
    placeholder: 'Chọn đối tượng',
    data: SAMPLE_TARGET_AUDIENCES,
    tooltip: 'Thêm đối tượng mới'
  },
  brand: {
    label: 'Thương hiệu',
    placeholder: 'Chọn thương hiệu',
    data: SAMPLE_BRANDS,
    tooltip: 'Thêm thương hiệu mới'
  },
  origin: {
    label: 'Xuất xứ',
    placeholder: 'Chọn xuất xứ',
    data: SAMPLE_ORIGINS,
    tooltip: 'Thêm xuất xứ mới'
  },
};

type AttributeKey = keyof typeof ATTRIBUTE_MAP;

const SkuInfor = ({ form }: SkuInforProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [priceCollapsed, setPriceCollapsed] = useState(false);
  const [attributeDrawerOpen, setAttributeDrawerOpen] = useState(false);
  const [newAttributeType, setNewAttributeType] = useState<AttributeKey | ''>('');
  const [newAttributeValue, setNewAttributeValue] = useState('');
  const [showMoreAttributes, setShowMoreAttributes] = useState(false);

  const toggleSection = () => {
    setCollapsed(prev => !prev);
  };

  const toggleMoreAttributes = () => {
    setShowMoreAttributes(prev => !prev);
  };

  const handleAddNewAttribute = () => {
    if (!newAttributeType || !newAttributeValue) return;
    
    if (newAttributeType === 'brand' || newAttributeType === 'origin') {
      // Single select fields
      const newItem = { value: newAttributeValue.toLowerCase(), label: newAttributeValue };
      form.setFieldValue(newAttributeType, newItem.value);
    } else {
      // Multi-select fields
      form.setFieldValue(
        newAttributeType, 
        [...(form.values[newAttributeType] || []), newAttributeValue.toLowerCase()]
      );
    }
    
    setNewAttributeType('');
    setNewAttributeValue('');
    setAttributeDrawerOpen(false);
  };

  // Helper function to create attribute fields
  const createAttributeField = (attributeKey: AttributeKey) => {
    const attr = ATTRIBUTE_MAP[attributeKey];
    const isMulti = attributeKey !== 'brand' && attributeKey !== 'origin';
    
    if (isMulti) {
      return (
        <MultiSelect
          label={attr.label}
          placeholder={attr.placeholder}
          data={attr.data}
          searchable
          clearable
          value={form.values[attributeKey] || []}
          onChange={(value) => form.setFieldValue(attributeKey, value)}
          rightSection={
            <Tooltip label={attr.tooltip}>
              <ActionIcon 
                size="sm" 
                onClick={() => {
                  setNewAttributeType(attributeKey);
                  setAttributeDrawerOpen(true);
                }}
              >
                <FiPlus size={16} />
              </ActionIcon>
            </Tooltip>
          }
        />
      );
    } else {
      return (
        <Select
          label={attr.label}
          placeholder={attr.placeholder}
          data={attr.data}
          searchable
          clearable
          value={form.values[attributeKey] || ''}
          onChange={(value) => form.setFieldValue(attributeKey, value)}
          rightSection={
            <Tooltip label={attr.tooltip}>
              <ActionIcon 
                size="sm" 
                onClick={() => {
                  setNewAttributeType(attributeKey);
                  setAttributeDrawerOpen(true);
                }}
              >
                <FiPlus size={16} />
              </ActionIcon>
            </Tooltip>
          }
        />
      );
    }
  };

  return (
    <>
      <Paper shadow="xs" p="md" mb="md" className="bg-white">
        {/* Header */}
        <Group justify="space-between" mb={collapsed ? 0 : "md"}>
          <Title order={5}>Thông tin chi tiết</Title>
          <ActionIcon variant="subtle" onClick={toggleSection}>
            {collapsed ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
          </ActionIcon>
        </Group>
        
        {!collapsed && (
          <Stack>
            {/* Main attributes: Brand and Origin */}
            <Group grow align="flex-start">
              {createAttributeField('brand')}
              {createAttributeField('origin')}
            </Group>
            
            {/* Collapsible additional attributes */}
            <Collapse in={showMoreAttributes}>
              <Stack gap="md" mt="xs">
                {/* Row 1: Material and Style */}
                <Group grow align="flex-start">
                  {createAttributeField('material')}
                  {createAttributeField('style')}
                </Group>
                
                {/* Row 2: Pattern and Target Audience */}
                <Group grow align="flex-start">
                  {createAttributeField('pattern')}
                  {createAttributeField('targetAudience')}
                </Group>
              </Stack>
            </Collapse>

             {/* Show more button */}
            <Button 
              variant="light" 
              color="gray" 
              leftSection={<FiSettings size={16} />} 
              rightSection={showMoreAttributes ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              onClick={toggleMoreAttributes}
              fullWidth
              mt="xs"
            >
              {showMoreAttributes ? 'Ẩn thuộc tính thêm' : 'Hiển thị thêm thuộc tính'}
            </Button>
            
          </Stack>
        )}
      </Paper>
      
      {/* Drawer for adding new attributes */}
      <Drawer
        opened={attributeDrawerOpen}
        onClose={() => setAttributeDrawerOpen(false)}
        title={newAttributeType ? `Thêm ${ATTRIBUTE_MAP[newAttributeType as AttributeKey]?.label.toLowerCase() || 'thuộc tính'} mới` : 'Thêm thuộc tính mới'}
        padding="md"
        position="right"
      >
        <Stack>
          <TextInput
            label={newAttributeType ? `Tên ${ATTRIBUTE_MAP[newAttributeType as AttributeKey]?.label.toLowerCase()}` : 'Tên thuộc tính'}
            placeholder={newAttributeType ? `Nhập ${ATTRIBUTE_MAP[newAttributeType as AttributeKey]?.label.toLowerCase()}` : 'Nhập tên thuộc tính'}
            value={newAttributeValue}
            onChange={(event) => setNewAttributeValue(event.currentTarget.value)}
            required
          />
          
          <Button onClick={handleAddNewAttribute} disabled={!newAttributeValue}>
            Thêm
          </Button>
        </Stack>
      </Drawer>
    </>
  );
};

export default SkuInfor;