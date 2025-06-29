import {
  ActionIcon,
  Group,
  Paper,
  Title
} from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useMemo, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { attributeDatas } from '../../../../../data/AttributeData';
import type { ProductCreateRequest } from '../../../../../types/ProductType';
import AttributeSection from './AttributeSection';

interface AttributeInforProps {
  form: UseFormReturnType<ProductCreateRequest>;
}

const AttributeInfor = ({ form }: AttributeInforProps) => {
  const [collapsed, setCollapsed] = useState(false);
  const [showMore, setShowMore] = useState(false);

  const sortedAttributes = useMemo(() => 
    [...attributeDatas].sort((a, b) => a.displayOrder - b.displayOrder), []
  );

  return (
    <Paper shadow="xs" p="md" mb="md" className="bg-white">
      <Group justify="space-between" mb={collapsed ? 0 : "md"}>
        <Title order={5}>Thông tin thuộc tính</Title>
        <ActionIcon variant="subtle" onClick={() => setCollapsed(!collapsed)}>
          {collapsed ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
        </ActionIcon>
      </Group>
      
      {!collapsed && (
        <AttributeSection
          attributes={sortedAttributes}
          form={form}
          showMore={showMore}
          onToggleMore={() => setShowMore(!showMore)}
        />
      )}
    </Paper>
  );
};

export default AttributeInfor;