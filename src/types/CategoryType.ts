
export interface BaseCategoryDto {
    id: string;
    name: string;
    parentId?: string | null;
    level?: number;
    urlPath?: string;
    hasChildren?: boolean;
}

export interface FullCategoryDto extends BaseCategoryDto {
    slug: string;
    description?: string;
    imageUrl?: string;
    productCount?: number;
}