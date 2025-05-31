import { useState } from 'react';
import { Tabs, Badge } from '@mantine/core';
import { FiCheckCircle, FiAlertTriangle, FiClock, FiEyeOff, FiGrid } from 'react-icons/fi';

type ProductStatus = 'all' | 'active' | 'violation' | 'pending' | 'hidden';

const statusCounts = {
  all: 142,
  active: 98,
  violation: 5,
  pending: 12,
  hidden: 27
};

const FilterByStatus = () => {
  const [activeStatus, setActiveStatus] = useState<ProductStatus>('all');

  const handleStatusChange = (value: string | null) => {
    setActiveStatus(value as ProductStatus);
    // Thêm logic lọc sản phẩm theo trạng thái ở đây
  };

  return (
    <div className="mb-6 border-b border-gray-200">
      <Tabs 
        value={activeStatus} 
        onChange={handleStatusChange}
        classNames={{
          list: "border-b-0",
          tab: "px-4 py-2 font-medium",
          tabLabel: "flex items-center"
        }}
      >
        <Tabs.List>
          <Tabs.Tab
            value="all"
            leftSection={<FiGrid size={16} />}
          >
            <div className="flex items-center gap-2">
              Tất cả
              <Badge size="sm" variant="light" color="gray">
                {statusCounts.all}
              </Badge>
            </div>
          </Tabs.Tab>
          
          <Tabs.Tab
            value="active"
            leftSection={<FiCheckCircle size={16} style={{ color: '#22c55e' }} />}
          >
            <div className="flex items-center gap-2">
              Đang hoạt động
              <Badge size="sm" variant="light" color="green">
                {statusCounts.active}
              </Badge>
            </div>
          </Tabs.Tab>
          
          <Tabs.Tab
            value="violation"
            leftSection={<FiAlertTriangle size={16} style={{ color: '#ef4444' }} />}
          >
            <div className="flex items-center gap-2">
              Vi phạm
              <Badge size="sm" variant="light" color="red">
                {statusCounts.violation}
              </Badge>
            </div>
          </Tabs.Tab>
          
          <Tabs.Tab
            value="pending"
            leftSection={<FiClock size={16} style={{ color: '#eab308' }} />}
          >
            <div className="flex items-center gap-2">
              Chờ duyệt
              <Badge size="sm" variant="light" color="yellow">
                {statusCounts.pending}
              </Badge>
            </div>
          </Tabs.Tab>
          
          <Tabs.Tab
            value="hidden"
            leftSection={<FiEyeOff size={16} style={{ color: '#6b7280' }} />}
          >
            <div className="flex items-center gap-2">
              Đang ẩn
              <Badge size="sm" variant="light" color="gray">
                {statusCounts.hidden}
              </Badge>
            </div>
          </Tabs.Tab>
        </Tabs.List>
      </Tabs>
    </div>
  );
};

export default FilterByStatus;