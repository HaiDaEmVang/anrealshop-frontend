import {
    Avatar,
    Badge,
    Button,
    Group,
    Paper,
    Text
} from '@mantine/core';
import { FaShopify } from 'react-icons/fa';
import { Link } from 'react-router-dom';

interface ShopInfoProps {
    id: string;
    url: string;
    name: string;
}

export const ShopInfo = ({ id, url, name }: ShopInfoProps) => {
    return (
        <Paper withBorder p="md" radius="md" className="mb-6">
            <Group>
                <Avatar src={url} radius="xl" size="lg">
                    {name.substring(0, 2)?.toUpperCase()}
                </Avatar>
                <div>
                    <Text fw={700}>{name}</Text>
                    <Group gap="xs">
                        <Badge color="blue" variant="light">Chính hãng</Badge>
                        <Badge color="green" variant="light">Phản hồi: N/A</Badge>
                    </Group>
                </div>
                <Group className="ml-auto" gap="xs">
                    <Link to={`/shop/${id}`}>
                        <Button variant="outline" color="blue" size="sm">
                            <FaShopify size={16} className="mr-2" /> Xem shop
                        </Button>
                    </Link>
                    <Button variant="outline" color="blue" size="sm">
                        Chat
                    </Button>
                </Group>
            </Group>
        </Paper>
    )
}
