import React from 'react';
import { Box, Divider, Group, Paper, Text, Title } from '@mantine/core';
import { FiUser, FiPhone, FiMapPin } from 'react-icons/fi';

interface AddressInfoProps {
    name: string;
    phone: string;
    address: string;
    title?: string;
    shippingCarrier?: string;
    trackingNumber?: string;
}

const AddressInfo: React.FC<AddressInfoProps> = ({
    name,
    phone,
    address,
    title = 'Thông tin giao hàng',
    shippingCarrier,
    trackingNumber
}) => {
    return (
        <Paper withBorder p="md" radius="md">
            <Title order={4} mb="md">{title}</Title>

            <Box mb="md">
                <Group gap="xs" mb="xs">
                    <FiUser size={16} className="text-gray-500" />
                    <Text size="sm" fw={500}>{name}</Text>
                </Group>

                <Group gap="xs" mb="xs">
                    <FiPhone size={16} className="text-gray-500" />
                    <Text size="sm">{phone}</Text>
                </Group>

                <div className='flex flex-nowrap gap-3'>
                    <FiMapPin size={60} className="text-gray-500 -mt-5 self-start" />
                    <Text size="sm">
                        {address}
                    </Text>
                </div>
            </Box>

            {(shippingCarrier || trackingNumber) && (
                <>
                    <Divider my="md" />

                    <Box>
                        {shippingCarrier && (
                            <Group mb="sm">
                                <Text size="sm" fw={500}>Đơn vị vận chuyển:</Text>
                                <Text size="sm">{shippingCarrier}</Text>
                            </Group>
                        )}

                        {trackingNumber && (
                            <Group>
                                <Text size="sm" fw={500}>Mã vận đơn:</Text>
                                <Text size="sm">{trackingNumber}</Text>
                            </Group>
                        )}
                    </Box>
                </>
            )}
        </Paper>
    );
};

export default AddressInfo;
