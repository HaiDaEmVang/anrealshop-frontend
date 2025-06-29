import {
    Button,
    Collapse,
    Group,
    Stack
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useState } from 'react';
import { FiChevronDown, FiChevronUp, FiPlus } from 'react-icons/fi';
import type { BaseAttribute } from '../../../../../types/AttributeType';
import type { ProductCreateRequest } from '../../../../../types/ProductType';
import AttributeDrawer from './AttributeDrawer';
import AttributeField from './AttributeField';

interface AttributeSectionProps {
  attributes: BaseAttribute[];
  form: UseFormReturnType<ProductCreateRequest>;
  showMore: boolean;
  onToggleMore: () => void;
}

const AttributeSection = ({ attributes, form, showMore, onToggleMore }: AttributeSectionProps) => {
  const [drawerOpened, setDrawerOpened] = useState(false);
  const [customAttributes, setCustomAttributes] = useState<BaseAttribute[]>([]);

  const allAttributes = [...attributes, ...customAttributes];

  const handleAddCustomAttribute = (newAttribute: any) => {
    const customAttribute: BaseAttribute = {
      ...newAttribute,
      displayOrder: 999 + customAttributes.length,
      isDefault: false
    };
    
    setCustomAttributes(prev => [...prev, customAttribute]);
  };

  const renderGrid = (attributeList: BaseAttribute[]) => {
    const pairs = [];
    for (let i = 0; i < attributeList.length; i += 2) {
      pairs.push(attributeList.slice(i, i + 2));
    }

    return pairs.map((pair, index) => (
      <Group key={index} grow align="flex-start">
        {pair.map(attribute => (
          <AttributeField 
            key={attribute.attributeKeyName}
            attribute={attribute} 
            form={form} 
          />
        ))}
      </Group>
    ));
  };

  return (
    <>
      <Stack>
        {renderGrid(allAttributes.slice(0, 4))}

        <Collapse in={showMore}>
          <Stack gap="md">
            {renderGrid(allAttributes.slice(4))}
          </Stack>
        </Collapse>

        <Group justify='space-between' gap={"md"}>
          {allAttributes.length > 4 && (
            <Button 
              variant="light" 
              color="gray" 
              rightSection={showMore ? <FiChevronUp size={16} /> : <FiChevronDown size={16} />}
              onClick={onToggleMore}
              style={{ flex: 1}}
            >
              {showMore ? 'Ẩn bớt' : 'Hiển thị thêm'}
            </Button>
          )}

          {showMore && (
            <Button
              variant="outline"
              leftSection={<FiPlus size={16} />}
              onClick={() => setDrawerOpened(true)}
              style={{ flex: 1}}
            >
              Thêm thuộc tính
            </Button>
          )}
        </Group>
      </Stack>

      <AttributeDrawer
        opened={drawerOpened}
        onClose={() => setDrawerOpened(false)}
        onAdd={handleAddCustomAttribute}
      />
    </>
  );
};

export default AttributeSection;
