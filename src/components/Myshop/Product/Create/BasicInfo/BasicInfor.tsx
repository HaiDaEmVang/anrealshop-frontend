import {
    ActionIcon,
    Group,
    Paper,
    Stack,
    Textarea,
    TextInput,
    Title
} from '@mantine/core';
import type { useForm } from '@mantine/form';
import { useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import type { ProductCreateRequest } from '../../../../../types/ProductType';
import RichTextEditor from '../../../../RichText/RichTextEditor';
import CategoryInfo from './CategoryInfo';

type Props = {
    form: ReturnType<typeof useForm<ProductCreateRequest>>;
};

const BasicInfor = ({ form }: Props) => {
    const [collapsed, setCollapsed] = useState(false);

    const toggleSection = () => {
        setCollapsed(prev => !prev);
    };

    return (
        <Paper shadow="xs" p="md" mb="md" className="bg-white">
            <Group justify="space-between" mb={collapsed ? 0 : "md"}>
                <Title order={5}>Thông tin cơ bản</Title>
                <ActionIcon variant="subtle" onClick={toggleSection}>
                    {collapsed ? <FiChevronDown size={16} /> : <FiChevronUp size={16} />}
                </ActionIcon>
            </Group>

            {!collapsed && (
                <Stack>
                    <TextInput
                        label="Tên sản phẩm"
                        placeholder="Nhập tên sản phẩm"
                        required
                        {...form.getInputProps('name')}
                    />

                    <Textarea
                        label="Mô tả ngắn"
                        placeholder="Mô tả ngắn về sản phẩm"
                        required
                        minRows={3}
                        maxRows={5}
                        {...form.getInputProps('sortDescription')}
                    />

                    <CategoryInfo form={form} />
                    <RichTextEditor form={form} />
                </Stack>
            )}
        </Paper>
    );
};

export default BasicInfor;