import {
  ActionIcon,
  Group,
  Paper,
  Title
} from '@mantine/core';
import { memo, useMemo, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import { attributeDatas } from '../../../../../data/AttributeData';
import AttributeSection from './AttributeSection';
import type { ProductAttribute } from '../../../../../types/AttributeType';

interface AttributeInforProps {
  attributes: ProductAttribute[];
  onAttributesChange: (attributes: ProductAttribute[]) => void;
}

const AttributeInfor = memo(({ attributes, onAttributesChange }: AttributeInforProps) => {
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
          formAttributes={attributes}
          onAttributesChange={onAttributesChange}
          showMore={showMore}
          onToggleMore={() => setShowMore(!showMore)}
        />
      )}
    </Paper>
  );
});

export default AttributeInfor;