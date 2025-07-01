import { Select } from '@mantine/core';
import { memo, useCallback, useMemo } from 'react';
import type { BaseAttribute, AttributeRequest } from '../../../../../types/AttributeType';
import { MultiSelectCreatable } from './MultiSelectedCreateable';

interface AttributeFieldProps {
    attribute: BaseAttribute;
    formAttributes: AttributeRequest[];
    onAttributesChange: (attributes: AttributeRequest[]) => void;
}

const AttributeField = memo(({ attribute, formAttributes, onAttributesChange }: AttributeFieldProps) => {
    const { attributeKeyName, attributeKeyDisplay, value, isDefault, isMultiSelect } = attribute;

    const currentValue = useMemo(() => {
        const attr = formAttributes.find(a => a.attributeKeyName === attributeKeyName);
        return attr?.value || [];
    }, [formAttributes, attributeKeyName]);

    const updateForm = useCallback((values: string[]) => {
        const attributes = formAttributes.filter(a => a.attributeKeyName !== attributeKeyName);

        if (values.length > 0) {
            attributes.push({ attributeKeyName, value: values });
        }
        onAttributesChange(attributes);
    }, [formAttributes, onAttributesChange, attributeKeyName]);

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
});

export default AttributeField;