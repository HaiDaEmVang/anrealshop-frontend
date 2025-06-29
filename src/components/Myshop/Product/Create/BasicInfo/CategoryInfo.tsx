import {
    Button,
    Group,
    Paper,
    Text
} from '@mantine/core';
import type { useForm } from '@mantine/form';
import { useState } from 'react';
import { FiGrid } from 'react-icons/fi';
import { categories } from '../../../../../data/CategoryPageData';
import type { ProductCreateRequest } from '../../../../../types/ProductType';
import AutoComplateCustome from './AutoComplateCustome';
import ModalCategorySelected from './ModalCategorySelected';

type Props = {
    form: ReturnType<typeof useForm<ProductCreateRequest>>;
};

const CategoryInfo = ({ form }: Props) => {
    const [modalOpened, setModalOpened] = useState(false);
    const selectedCategoryId = form.values.categoryId;

    const handleCategoryChange = (categoryId: string) => {
        form.setFieldValue('categoryId', categoryId);
    };

    const handleClearCategory = () => {
        form.setFieldValue('categoryId', '');
    };

    const handleModalSelect = (categoryId: string) => {
        form.setFieldValue('categoryId', categoryId);
    };

    return (
        <Paper className="!bg-transparent" shadow="none" mb={10}>
            <Group mb={5} justify="space-between">
                <label className="text-sm font-medium">
                    Danh mục <span className="text-red-500">*</span>
                </label>
                <Button
                    variant="subtle"
                    size="xs"
                    leftSection={<FiGrid size={14} />}
                    onClick={() => setModalOpened(true)}
                >
                    Chọn từ danh sách
                </Button>
            </Group>

            <AutoComplateCustome
                categories={categories}
                value={selectedCategoryId}
                onChange={handleCategoryChange}
                onClear={handleClearCategory}
                placeholder="Nhập để tìm kiếm danh mục..."
                required
            />

            {form.errors.categoryId && (
                <Text size="xs" c="red" mt={5}>
                    {form.errors.categoryId}
                </Text>
            )}

            <ModalCategorySelected
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onSelect={handleModalSelect}
                categories={categories}
                selectedCategoryId={selectedCategoryId}
            />
        </Paper>
    );
};

export default CategoryInfo;
