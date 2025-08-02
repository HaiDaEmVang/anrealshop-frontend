import { ActionIcon, CheckIcon, Group, Stack, Tabs, Text, TextInput, Title, Tooltip } from '@mantine/core';
import { DatePickerInput } from '@mantine/dates';
import '@mantine/dates/styles.css';
import { FiCalendar, FiCheck, FiCheckCircle, FiClock, FiFilter, FiRefreshCcw, FiSearch, FiX } from 'react-icons/fi';
import type { Product } from '../../../types/AdminProductType';

interface FilterProps {
  date: [Date | null, Date | null];
  searchTerm: string;
  activeTab: string;
  products: Product[];
  onDateChange: (date: [Date | null, Date | null]) => void;
  onSearchChange: (term: string) => void;
  onTabChange: (tab: string | null) => void;
  onResetFilters: () => void;
}

const Filter: React.FC<FilterProps> = ({
  date,
  searchTerm,
  activeTab,
  products,
  onDateChange,
  onSearchChange,
  onTabChange,
  onResetFilters
}) => {
  return (
    <>
      <Group justify="space-between" align="flex-start" mb="md">
        <Stack gap="xs">
          <Title order={3} size="h4">Xác nhận sản phẩm</Title>
          <Text size="sm" c="dimmed">
            Xem xét và phê duyệt các sản phẩm mới được đăng ký bởi người bán.
          </Text>
        </Stack>

        <Stack gap="xs">
          <Group>
            <DatePickerInput
              type="range"
              placeholder="Chọn khoảng thời gian"
              value={date}
              onChange={onDateChange}
              clearable
              valueFormat="DD/MM/YYYY"
              locale="vi"
              leftSection={<FiCalendar size={16} />}
              rightSection={date ? (
                <ActionIcon size="sm" variant="subtle" onClick={() => onDateChange([null, null])}>
                  <FiX size={14} />
                </ActionIcon>
              ) : null}
              style={{ minWidth: '300px' }}
            />
            <TextInput
              placeholder="Tìm kiếm theo tên, ID, cửa hàng..."
              value={searchTerm}
              onChange={(e) => onSearchChange(e.currentTarget.value)}
              leftSection={<FiSearch size={16} />}
              style={{ minWidth: '300px' }}
            />

            <Tooltip label="Reset bộ lọc">
              <ActionIcon
                variant="light"
                color="gray"
                onClick={onResetFilters}
                disabled={!date && activeTab === 'pending'}
              >
                <FiRefreshCcw size={16} />
              </ActionIcon>
            </Tooltip>
            <Tooltip label="Áp dụng bộ lọc">
              <ActionIcon
                variant="light"
                color="blue"
                onClick={onResetFilters}
                disabled={!date && activeTab === 'pending'}
              >
                <FiCheck size={16} />
              </ActionIcon>
            </Tooltip>
          </Group>
        </Stack>
      </Group>

      <Tabs value={activeTab} onChange={onTabChange} mb="md">
        <Tabs.List>
          <Tabs.Tab value="pending" leftSection={<FiClock size={14} />}>
            Chờ duyệt ({products.filter(p => p.status === 'pending').length})
          </Tabs.Tab>
          <Tabs.Tab value="approved" leftSection={<FiCheckCircle size={14} />}>
            Đã duyệt ({products.filter(p => p.status === 'approved').length})
          </Tabs.Tab>
          <Tabs.Tab value="rejected" leftSection={<FiX size={14} />}>
            Đã từ chối ({products.filter(p => p.status === 'rejected').length})
          </Tabs.Tab>
          <Tabs.Tab value="all" leftSection={<FiFilter size={14} />}>
            Tất cả ({products.length})
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </>
  );
};

export default Filter;