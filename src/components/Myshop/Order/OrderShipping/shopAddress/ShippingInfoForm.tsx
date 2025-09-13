import { Button, Card, Divider, Group, Select, Text, Textarea } from '@mantine/core';
import { FiPackage } from 'react-icons/fi';
import type { OrderItemDto } from '../../../../../types/OrderType';
import type { AddressDto } from '../../../../../types/AddressType';


interface ShippingInfoFormProps {
    pickupDate: string;
    note: string;
    shopAddress: AddressDto | undefined;
    selectedOrders: OrderItemDto[];
    isSubmitting: boolean;
    onPickupDateChange: (value: string | null) => void;
    onNoteChange: (value: string) => void;
    onSubmit: () => void;
}

const ShippingInfoForm = ({
    pickupDate,
    note,
    shopAddress,
    selectedOrders,
    isSubmitting,
    onPickupDateChange,
    onNoteChange,
    onSubmit
}: ShippingInfoFormProps) => {

    const countOrderItems = selectedOrders.reduce((acc, order) => acc + order.productOrderItemDtoSet.length, 0);
    return (
        <Card shadow="xs" p="md" radius="md" withBorder >
            <Text fw={500} size="lg" mb="md">
                Thông tin vận chuyển
            </Text>
            <Text size="sm" c="dimmed" mb="md">
                <span className="font-bold text-blue-500">{countOrderItems}</span> sản phẩm đã chọn
            </Text>
            <div className="space-y-4">
                <Card withBorder px="md" py="sm" radius="md">
                    <Group justify="space-between" mb="xs">
                        <Text fw={500} size="sm">Địa chỉ lấy hàng</Text>
                        <Button variant="subtle" size="xs">Đổi</Button>
                    </Group>

                    <Group mb="xs" gap="xs">
                        <Text size="sm" fw={500}>{shopAddress?.receiverOrSenderName}</Text>
                        <Text size="sm">{shopAddress?.phoneNumber}</Text>
                    </Group>

                    <Text size="sm">{shopAddress?.detailAddress}</Text>
                    <Text size="sm">{shopAddress?.wardName}</Text>
                    <Text size="sm">{shopAddress?.districtName}</Text>
                    <Text size="sm" mb="md">{shopAddress?.provinceName}</Text>

                    <Divider my="xs" />

                    <Group justify="space-between">
                        <Text size="sm" fw={500}>Ngày lấy hàng:</Text>
                        <Select
                            value={pickupDate}
                            onChange={onPickupDateChange}
                            data={[
                                { value: new Date().toISOString().split('T')[0], label: 'Hôm nay' },
                                { value: new Date(Date.now() + 86400000).toISOString().split('T')[0], label: 'Ngày mai' }
                            ]}
                            size="xs"
                            style={{ width: 120 }}
                        />
                    </Group>
                </Card>

                <Textarea
                    label="Ghi chú"
                    placeholder="Nhập ghi chú cho đơn hàng (nếu có)"
                    value={note}
                    onChange={(e) => onNoteChange(e.currentTarget.value)}
                    minRows={3}
                />

                <Divider my="md" />

                <Button
                    fullWidth
                    size="md"
                    leftSection={isSubmitting ? null : <FiPackage size={16} />}
                    onClick={onSubmit}
                    loading={isSubmitting}
                    disabled={
                        countOrderItems === 0 ||
                        isSubmitting
                    }
                >
                    {isSubmitting ? 'Đang xử lý...' : 'Tạo đơn giao hàng'}
                </Button>
            </div>
        </Card>
    );
};

export default ShippingInfoForm;