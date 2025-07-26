import {
    ActionIcon,
    Group,
    NumberInput,
    Paper,
    SimpleGrid,
    Stack,
    Textarea,
    TextInput,
    Title,
    type AutocompleteProps,
    type NumberInputProps,
    type SelectProps,
    type TextareaProps,
    type TextInputProps
} from '@mantine/core';
import { memo, useState } from 'react';
import { FiChevronDown, FiChevronUp } from 'react-icons/fi';
import RichTextEditor from '../../../../RichText/RichTextEditor';
import CategoryInfo from './CategoryInfo';

interface BasicInforProps {
    isShowQuantity?: boolean;
    nameProps: TextInputProps;
    sortDescriptionProps: TextareaProps;
    priceProps: NumberInputProps;
    discountPriceProps: NumberInputProps;
    categoryIdProps: SelectProps;
    descriptionProps: TextInputProps;
    quantityProps: NumberInputProps;
}

const BasicInfor = memo(({
    isShowQuantity,
    nameProps,
    sortDescriptionProps,
    priceProps,
    discountPriceProps,
    categoryIdProps,
    descriptionProps,
    quantityProps,
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
                        {...nameProps}
                    />

                    <Textarea
                        label="Mô tả ngắn"
                        placeholder="Mô tả ngắn về sản phẩm"
                        required
                        minRows={3}
                        maxRows={5}
                        {...sortDescriptionProps}
                    />

                    <SimpleGrid cols={3} spacing="lg">
                        <NumberInput
                            label="Giá gốc"
                            placeholder="Nhập giá sản phẩm"
                            required
                            min={0}
                            {...priceProps}
                            thousandSeparator=",">
                        </NumberInput>

                        <NumberInput
                            label="Giá khuyến mãi"
                            placeholder="Nhập giá khuyến mãi"
                            min={0}
                            {...discountPriceProps}
                            thousandSeparator=",">
                        </NumberInput>

                        <NumberInput
                            label="Số lượng"
                            placeholder="Nhập số lượng sản phẩm"
                            min={0}
                            disabled={!isShowQuantity}
                            {...quantityProps}
                            thousandSeparator=",">
                        </NumberInput>
                    </SimpleGrid>

                    <CategoryInfo
                        categoryIdProps={{
                            ...categoryIdProps,
                            value: categoryIdProps.value ?? undefined 
                        } as AutocompleteProps}
                    />

                    <RichTextEditor
                        descriptionProps={{
                            ...descriptionProps}}
                    />
                </Stack>
            )}
        </Paper>
    );
});

export default BasicInfor;