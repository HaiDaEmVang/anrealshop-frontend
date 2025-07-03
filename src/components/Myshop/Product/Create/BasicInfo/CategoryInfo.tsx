
import {
    Button,
    Group,
    Paper,
    type AutocompleteProps
} from '@mantine/core';
import { memo, useState } from 'react';
import { FiGrid } from 'react-icons/fi';
import { categories } from '../../../../../data/CategoryPageData';
import AutoComplateCustome from './AutoComplateCustome';
import ModalCategorySelected from './ModalCategorySelected';

interface CategoryInfoProps {
    categoryIdProps: AutocompleteProps;
}

const CategoryInfo = memo(({ categoryIdProps }: CategoryInfoProps) => {
    const [modalOpened, setModalOpened] = useState(false);

    const handleModalSelect = (categoryIdValue: string) => {
        const formOnChange = categoryIdProps.onChange as (value: string | null) => void;
        if (formOnChange) {
            formOnChange(categoryIdValue);
        }
        setModalOpened(false); 
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
                value={categoryIdProps.value}
                onChange={categoryIdProps.onChange as (value: string | null) => void}
                error={categoryIdProps.error}
                placeholder="Nhập để tìm kiếm danh mục..."
                required={categoryIdProps.required}
                onClear={() => categoryIdProps.onChange && (categoryIdProps.onChange as (value: string | null) => void)('')}
                description={categoryIdProps.error ? undefined : ''}
            />

            <ModalCategorySelected
                opened={modalOpened}
                onClose={() => setModalOpened(false)}
                onSelect={handleModalSelect}
                categories={categories}
                selectedCategoryId={categoryIdProps.value as string} 
            />
        </Paper>
    );
});

export default CategoryInfo;