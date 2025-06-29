import {
    ActionIcon,
    Autocomplete,
    Box,
    Text
} from '@mantine/core';
import { useCallback, useMemo, useState } from 'react';
import { FiX } from 'react-icons/fi';
import type { BaseCategoryDto } from '../../../../../types/CategoryType';

interface CategoryOption {
    value: string;
    label: string;
    category: BaseCategoryDto;
    fullPath: string;
}

interface AutoComplateCustomeProps {
    categories: BaseCategoryDto[];
    value?: string;
    onChange: (value: string) => void;
    onClear: () => void;
    placeholder?: string;
    error?: string;
    required?: boolean;
}

const AutoComplateCustome = ({
    categories,
    value,
    onChange,
    onClear,
    placeholder = "Nhập để tìm kiếm...",
    error
}: AutoComplateCustomeProps) => {
    const [searchValue, setSearchValue] = useState('');

    const buildCategoryPath = useCallback((categoryId: string): string => {
        const category = categories.find(cat => cat.id === categoryId);
        if (!category) return '';

        if (category.parentId) {
            const parentPath = buildCategoryPath(category.parentId);
            return parentPath ? `${parentPath} > ${category.name}` : category.name;
        }
        return category.name;
    }, [categories]);

    const selectedCategoryDisplay = useMemo(() => {
        if (!value) return '';
        return buildCategoryPath(value);
    }, [value, buildCategoryPath]);

    const categoryOptions = useMemo((): CategoryOption[] => {
        return categories
            .filter(cat => !cat.hasChildren) 
            .map(category => ({
                value: category.id,
                label: category.name,
                category,
                fullPath: buildCategoryPath(category.id)
            }));
    }, [categories, buildCategoryPath]);

    const filteredOptions = useMemo(() => {
        if (!searchValue) return categoryOptions;
        
        const query = searchValue.toLowerCase();
        return categoryOptions.filter(option => 
            option.fullPath.toLowerCase().includes(query) ||
            option.label.toLowerCase().includes(query)
        );
    }, [categoryOptions, searchValue]);

    const handleCategorySelect = (selectedValue: string) => {
        const selectedOption = categoryOptions.find(option => option.value === selectedValue);
        if (selectedOption) {
            onChange(selectedOption.value);
            setSearchValue('');
        }
    };

    const handleClear = () => {
        onClear();
        setSearchValue('');
    };

    const handleSearchChange = (newSearchValue: string) => {
        setSearchValue(newSearchValue);
        if (value && newSearchValue !== selectedCategoryDisplay) {
            onClear();
        }
    };

    return (
        <Autocomplete
            value={value ? selectedCategoryDisplay : searchValue}
            onChange={handleSearchChange}
            onOptionSubmit={handleCategorySelect}
            data={filteredOptions.map(option => ({
                value: option.value,
                label: option.fullPath
            }))}
            placeholder={placeholder}
            limit={5}
            maxDropdownHeight={300}
            error={error}
            rightSection={
                value ? (
                    <ActionIcon
                        size="sm"
                        variant="subtle"
                        color="gray"
                        onClick={handleClear}
                    >
                        <FiX size={14} />
                    </ActionIcon>
                ) : null
            }
            comboboxProps={{
                transitionProps: { transition: 'pop', duration: 200 },
                shadow: 'md'
            }}
            renderOption={({ option }) => {
                const categoryOption = filteredOptions.find(opt => opt.value === option.value);
                if (!categoryOption) return null;
                
                return (
                    <Box>
                        <Text size="sm" className="text-contentText">
                            {categoryOption.fullPath}
                        </Text>
                    </Box>
                );
            }}
            filter={({ options }) => {
                return options;
            }}
            styles={{
                input: {
                    fontSize: '14px',
                    minHeight: '36px'
                },
                dropdown: {
                    border: '1px solid #e5e7eb',
                    borderRadius: '8px'
                },
                option: {
                    padding: '8px 12px',
                    borderRadius: '4px',
                    margin: '2px 4px'
                }
            }}
        />
    );
};

export default AutoComplateCustome;
