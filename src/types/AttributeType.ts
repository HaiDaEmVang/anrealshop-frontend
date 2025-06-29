export interface AttributeRequest {
  id?: string;
  attributeKeyName: string;
  value: string[];
}

export interface BaseAttribute {
  attributeKeyName: string;
  attributeKeyDisplay: string;
  displayOrder: number;
  isDefault: boolean;
  isMultiSelect: boolean;
  value: string[];
}
