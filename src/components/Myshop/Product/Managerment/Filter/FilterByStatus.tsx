import { Badge, Tabs } from '@mantine/core';
import { useCallback, useEffect, useState } from 'react';
import { productStatusDefaultData } from '../../../../../data/ProductData';
import { useProductStatusColor, useProductStatusIcon } from '../../../../../hooks/useProductStatus';
import ProductsService from '../../../../../service/ProductsService';
import type { ProductStatus, ProductStatusDto } from '../../../../../types/ProductType';

interface FilterByStatusProps {
  selectedStatus: ProductStatus;
  onStatusChange: (status: ProductStatus) => void;
}

const FilterByStatus = ({ selectedStatus, onStatusChange }: FilterByStatusProps) => {
  const { getStatusIcon } = useProductStatusIcon();
  const { getStatusColor, getStatusIconColor } = useProductStatusColor();

  const handleStatusChange = (value: string | null) => {
    onStatusChange(value as ProductStatus);
  };

  const [productStatusData, setStatusMetadata] = useState<ProductStatusDto[]>(productStatusDefaultData);
  const fetchStatusMetadata = useCallback(async () => {
    try {
      const metadata = await ProductsService.getProductStatusMetadata();
      setStatusMetadata(metadata);
      return metadata;
    } catch (err: any) {
      setStatusMetadata(productStatusDefaultData);
      throw err;
    }
  }, []);

  useEffect(() => {
    fetchStatusMetadata();
  }, [fetchStatusMetadata]);

  return (
    <div className="p-4 pb-0">
      <Tabs
        value={selectedStatus}
        onChange={handleStatusChange}
        classNames={{
          list: "border-b-0",
          tab: "px-4 py-2 font-medium data-[active]:bg-blue-50 data-[active]:text-blue-600 data-[active]:border-blue-200",
          tabLabel: "flex items-center"
        }}
      >
        <Tabs.List>
          {productStatusData.map((status) => {
            const IconComponent = getStatusIcon(status.id);
            const iconColor = getStatusIconColor(status.id);
            const badgeColor = getStatusColor(status.id);
            const isActive = selectedStatus === status.id;

            return (
              <Tabs.Tab
                key={status.id}
                value={status.id}
                leftSection={<IconComponent size={16} style={{ color: iconColor }} />}
                className={`!py-3 !px-4 cursor-pointer transition-colors duration-200 ${isActive
                    ? 'bg-primary !text-primary border-b-2 !border-primary'
                    : 'hover:bg-gray-100'
                  }`}
              >
                <div className="flex items-center gap-2">
                  {status.name}
                  <Badge
                    size="sm"
                    variant="light"
                    color={badgeColor}
                  >
                    {status.count}
                  </Badge>
                </div>
              </Tabs.Tab>
            );
          })}
        </Tabs.List>
      </Tabs>
    </div>
  );
};

export default FilterByStatus;