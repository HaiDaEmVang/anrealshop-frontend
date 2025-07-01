import {
    Button,
    Group,
    Paper,
    Text
} from '@mantine/core';
import { memo, useState } from 'react';
import { FiGrid } from 'react-icons/fi';
import type { ReactNode } from 'react';
import { categories } from '../../../../../data/CategoryPageData';
import AutoComplateCustome from './AutoComplateCustome';
import ModalCategorySelected from './ModalCategorySelected';

interface CategoryInfoProps {
    categoryId: string;
    categoryIdError?: ReactNode;
    onCategoryIdChange: (value: string) => void;
}

const CategoryInfo = memo(({ categoryId, categoryIdError, onCategoryIdChange }: CategoryInfoProps) => {
    const [modalOpened, setModalOpened] = useState(false);

    const handleCategoryChange = (categoryIdValue: string) => {
        onCategoryIdChange(categoryIdValue);
    };

    const handleClearCategory = () => {
        onCategoryIdChange('');
    };

    const handleModalSelect = (categoryIdValue: string) => {
        onCategoryIdChange(categoryIdValue);
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
                value={categoryId}
                onChange={handleCategoryChange}
                onClear={handleClearCategory}
                placeholder="Nhập để tìm kiếm danh mục..."
                required
            />

            {categoryIdError && (
                <Text size="xs" c="red" mt={5}>
                    {categoryIdError}
                </Text>
            )}

            <ModalCategorySelected
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onSelect={handleModalSelect}
                categories={categories}
                selectedCategoryId={categoryId}
            />
        </Paper>
    );
});

export default CategoryInfo;