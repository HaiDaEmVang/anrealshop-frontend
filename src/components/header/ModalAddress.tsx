import React, { useState } from 'react';
import {
    Modal,
    Radio,
    Group,
    Box,
    Text,
    Stack,
    UnstyledButton,
    Button,
    TextInput,
    Select,
    Textarea
} from '@mantine/core';
import { FiEdit, FiCheck, FiPlus } from 'react-icons/fi';

// Định nghĩa kiểu dữ liệu cho địa chỉ
export interface Address {
    id: string;
    name: string;
    phone: string;
    address: string;
    ward: string;
    district: string;
    city: string;
    isDefault?: boolean;
}

interface ModalAddressProps {
    opened: boolean;
    onClose: () => void;
    addresses: Address[];
    selectedAddressId: string;
    onSelectAddress: (id: string) => void;
    onApplyAddress: () => void;
    isLoggedIn: boolean;
}

const ModalAddress: React.FC<ModalAddressProps> = ({
    opened,
    onClose,
    addresses,
    selectedAddressId,
    onSelectAddress,
    onApplyAddress,
    isLoggedIn
}) => {
    const [selectedTabValue, setSelectedTabValue] = useState<string>('saved');
    
    // Form state cho địa chỉ mới
    const [newAddressForm, setNewAddressForm] = useState({
        name: '',
        phone: '',
        city: '',
        district: '',
        ward: '',
        address: '',
        isDefault: false
    });

    const handleFormChange = (field: string, value: string | boolean) => {
        setNewAddressForm(prev => ({
            ...prev,
            [field]: value
        }));
    };

    return (
        <Modal
            opened={opened}
            onClose={onClose}
            title="Chọn địa chỉ giao hàng"
            size="lg"
        >
            <Radio.Group
                value={selectedTabValue}
                onChange={setSelectedTabValue}
                name="addressTab"
                className="mb-4"
            >
                <Group>
                    <Radio value="saved" label="Địa chỉ đã lưu" />
                    <Radio value="new" label="Địa chỉ mới" />
                </Group>
            </Radio.Group>

            {selectedTabValue === 'saved' ? (
                <Stack>
                    {addresses.map((address) => (
                        <Box 
                            key={address.id}
                            className={`border rounded-md p-4 ${selectedAddressId === address.id ? 'border-primary bg-blue-50' : 'border-gray-300'}`}
                            onClick={() => onSelectAddress(address.id)}
                        >
                            <Group justify="apart">
                                <Group>
                                    <Radio 
                                        checked={selectedAddressId === address.id}
                                        onChange={() => onSelectAddress(address.id)}
                                        size="sm"
                                    />
                                    <div>
                                        <Group gap="xs">
                                            <Text size="sm" fw={600}>{address.name}</Text>
                                            <Text size="sm" color="dimmed">{address.phone}</Text>
                                            {address.isDefault && (
                                                <Text size="xs" className="bg-blue-100 text-blue-800 px-2 py-1 rounded">Mặc định</Text>
                                            )}
                                        </Group>
                                        <Text size="sm" className="mt-1">{address.address}, {address.ward}</Text>
                                        <Text size="sm">{address.district}, {address.city}</Text>
                                    </div>
                                </Group>
                                <UnstyledButton className="text-primary hover:underline">
                                    <Group gap="xs">
                                        <FiEdit size={14} />
                                        <Text size="sm">Sửa</Text>
                                    </Group>
                                </UnstyledButton>
                            </Group>
                        </Box>
                    ))}

                    {isLoggedIn && (
                        <Button 
                            variant="outline" 
                            leftSection={<FiPlus size={16} />}
                            onClick={() => setSelectedTabValue('new')}
                            className="mt-2"
                        >
                            Thêm địa chỉ mới
                        </Button>
                    )}
                </Stack>
            ) : (
                <Stack>
                    <Group grow>
                        <TextInput 
                            label="Họ tên" 
                            placeholder="Nhập họ tên người nhận" 
                            value={newAddressForm.name}
                            onChange={(e) => handleFormChange('name', e.currentTarget.value)}
                        />
                        <TextInput 
                            label="Số điện thoại" 
                            placeholder="Nhập số điện thoại" 
                            value={newAddressForm.phone}
                            onChange={(e) => handleFormChange('phone', e.currentTarget.value)}
                        />
                    </Group>
                    <Select
                        label="Tỉnh/Thành phố"
                        placeholder="Chọn tỉnh/thành phố"
                        data={[
                            { value: 'hcm', label: 'TP. Hồ Chí Minh' },
                            { value: 'hn', label: 'Hà Nội' }
                        ]}
                        value={newAddressForm.city}
                        onChange={(value) => handleFormChange('city', value || '')}
                    />
                    <Group grow>
                        <Select
                            label="Quận/Huyện"
                            placeholder="Chọn quận/huyện"
                            data={[
                                { value: 'q7', label: 'Quận 7' },
                                { value: 'q1', label: 'Quận 1' }
                            ]}
                            value={newAddressForm.district}
                            onChange={(value) => handleFormChange('district', value || '')}
                        />
                        <Select
                            label="Phường/Xã"
                            placeholder="Chọn phường/xã"
                            data={[
                                { value: 'tp', label: 'Phường Tân Phú' },
                                { value: 'th', label: 'Phường Tân Hưng' }
                            ]}
                            value={newAddressForm.ward}
                            onChange={(value) => handleFormChange('ward', value || '')}
                        />
                    </Group>
                    <Textarea
                        label="Địa chỉ cụ thể"
                        placeholder="Số nhà, tên đường, tòa nhà, etc."
                        autosize
                        minRows={2}
                        maxRows={4}
                        value={newAddressForm.address}
                        onChange={(e) => handleFormChange('address', e.currentTarget.value)}
                    />
                    {isLoggedIn && (
                        <Radio
                            label="Đặt làm địa chỉ mặc định"
                            checked={newAddressForm.isDefault}
                            onChange={(e) => handleFormChange('isDefault', e.currentTarget.checked)}
                            className="mt-2"
                        />
                    )}
                </Stack>
            )}

            <Group justify="flex-end" mt="xl">
                <Button variant="outline" onClick={onClose}>
                    Hủy
                </Button>
                <Button onClick={onApplyAddress} leftSection={<FiCheck size={16} />}>
                    Xác nhận
                </Button>
            </Group>
        </Modal>
    );
};

export default ModalAddress;