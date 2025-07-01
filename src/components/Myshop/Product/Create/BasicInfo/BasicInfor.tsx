import {
    ActionIcon,
    Group,
    NumberInput,
    Paper,
    Stack,
    Textarea,
    TextInput,
    Title
} from '@mantine/core';
import { memo, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import type { ReactNode } from 'react';
import RichTextEditor from '../../../../RichText/RichTextEditor';
import CategoryInfo from './CategoryInfo';

interface BasicInforProps {
    name: string;
    sortDescription: string;
    price: number;
    discountPrice: number;
    categoryId: string;
    description: string;
    nameError?: ReactNode;
    sortDescriptionError?: ReactNode;
    priceError?: ReactNode;
    discountPriceError?: ReactNode;
    categoryIdError?: ReactNode;
    onNameChange: (value: string) => void;
    onSortDescriptionChange: (value: string) => void;
    onPriceChange: (value: number | string) => void;
    onDiscountPriceChange: (value: number | string) => void;
    onCategoryIdChange: (value: string) => void;
    onDescriptionChange: (value: string) => void;
}

const BasicInfor = memo(({ 
    name,
    sortDescription,
    price,
    discountPrice,
    categoryId,
    description,
    nameError,
    sortDescriptionError,
    priceError,
    discountPriceError,
    categoryIdError,
    onNameChange,
    onSortDescriptionChange,
    onPriceChange,
    onDiscountPriceChange,
    onCategoryIdChange,
    onDescriptionChange
}: BasicInforProps) => {
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
                        value={name}
                        onChange={(event) => onNameChange(event.currentTarget.value)}
                        error={nameError}
                    />

                    <Textarea
                        label="Mô tả ngắn"
                        placeholder="Mô tả ngắn về sản phẩm"
                        required
                        minRows={3}
                        maxRows={5}
                        value={sortDescription}
                        onChange={(event) => onSortDescriptionChange(event.currentTarget.value)}
                        error={sortDescriptionError}
                    />

                    <Group grow>
                        <NumberInput
                            label="Giá gốc"
                            placeholder="Nhập giá sản phẩm"
                            required
                            min={0}
                            value={price}
                            onChange={onPriceChange}
                            error={priceError}
                            thousandSeparator=",">
                        </NumberInput>

                        <NumberInput
                            label="Giá khuyến mãi"
                            placeholder="Nhập giá khuyến mãi"
                            min={0}
                            value={discountPrice}
                            onChange={onDiscountPriceChange}
                            error={discountPriceError}
                            thousandSeparator=",">
                        </NumberInput>
                    </Group>

                    <CategoryInfo 
                        categoryId={categoryId}
                        categoryIdError={categoryIdError}
                        onCategoryIdChange={onCategoryIdChange}
                    />
                    
                    <RichTextEditor 
                        value={description}
                        onChange={onDescriptionChange}
                    />
                </Stack>
            )}
        </Paper>
    );
});

export default BasicInfor;