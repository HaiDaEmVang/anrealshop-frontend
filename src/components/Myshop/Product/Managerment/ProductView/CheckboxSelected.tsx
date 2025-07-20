import { Checkbox, Group, Text } from '@mantine/core';

interface CheckboxSelectedProps {
  selectedCount: number;
  totalCount: number;
  onSelectAll: (checked: boolean) => void;
}

const CheckboxSelected = ({ 
  selectedCount, 
  totalCount, 
  onSelectAll 
}: CheckboxSelectedProps) => {
  const allSelected = selectedCount === totalCount && totalCount > 0;
  const someSelected = selectedCount > 0 && selectedCount < totalCount;
  
  return (
    <Group justify="space-between" >
      <Checkbox
        checked={allSelected}
        indeterminate={someSelected}
        onChange={(e) => onSelectAll(e.currentTarget.checked)}
        label={`Chọn tất cả (${totalCount})`}
      />
      {selectedCount > 0 && (
        <Text size="sm" fw={500} c="blue">
          Đã chọn {selectedCount} sản phẩm
        </Text>
      )}
    </Group>
  );
};

export default CheckboxSelected;