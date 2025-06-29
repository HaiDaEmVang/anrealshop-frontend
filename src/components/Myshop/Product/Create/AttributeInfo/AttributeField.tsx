import { Select } from '@mantine/core';
import type { UseFormReturnType } from '@mantine/form';
import { useCallback, useMemo } from 'react';
import type { BaseAttribute } from '../../../../../types/AttributeType';
import type { ProductCreateRequest } from '../../../../../types/ProductType';
import { MultiSelectCreatable } from './MultiSelectedCreateable';

interface AttributeFieldProps {
    attribute: BaseAttribute;
    form: UseFormReturnType<ProductCreateRequest>;
}

const AttributeField = ({ attribute, form }: AttributeFieldProps) => {
    const { attributeKeyName, attributeKeyDisplay, value, isDefault, isMultiSelect } = attribute;

    const currentValue = useMemo(() => {
        const attr = form.values.attributes.find(a => a.attributeKeyName === attributeKeyName);
        return attr?.value || [];
    }, [form.values.attributes, attributeKeyName]);

    const updateForm = useCallback((values: string[]) => {
        const attributes = form.values.attributes.filter(a => a.attributeKeyName !== attributeKeyName);

        if (values.length > 0) {
            attributes.push({ attributeKeyName, value: values });
        }
        form.setFieldValue('attributes', attributes);
    }, [form, attributeKeyName]);

    const handleMultiChange = useCallback((values: string[]) => {
        updateForm(values);
    }, [updateForm]);

    const handleSingleChange = useCallback((selectedValue: string | null) => {
        updateForm(selectedValue ? [selectedValue] : []);
    }, [updateForm]);

    if (isMultiSelect) {
        return (
            <MultiSelectCreatable
                options={value}
                value={currentValue}
                onChange={handleMultiChange}
                placeholder={`Chọn ${attributeKeyDisplay.toLowerCase()}`}
                canCreate={!isDefault}
                label={attributeKeyDisplay}
            />
        );
    }

    return (
        <Select
            label={attributeKeyDisplay}
            placeholder={`Chọn ${attributeKeyDisplay.toLowerCase()}`}
            data={value.map(val => ({ value: val, label: val }))}
            searchable
            clearable
            value={currentValue[0] || null}
            onChange={handleSingleChange}
        />
    );
};

export default AttributeField;