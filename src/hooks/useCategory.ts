import { useCallback, useEffect, useState } from 'react';
import showErrorNotification from '../components/Toast/NotificationError';
import showSuccessNotification from '../components/Toast/NotificationSuccess';
import { CategoryService } from '../service/CategoryService';
import type { AdminCategoryDto, CategoryRequestDto } from '../types/CategoryType';

interface UseCategoryParams {
    autoFetch?: boolean;
}

export const useCategory = ({ autoFetch = false }: UseCategoryParams = {}) => {
    const [categories, setCategories] = useState<AdminCategoryDto[]>([]);
    const [disabledCategories, setDisabledCategories] = useState<AdminCategoryDto[]>([]);
    const [isLoading, setIsLoading] = useState(false);
    const [isLoadingDisabled, setIsLoadingDisabled] = useState(false);
    const [isSubmitting, setIsSubmitting] = useState(false);

    const fetchCategories = useCallback(async () => {
        setIsLoading(true);
        try {
            const response = await CategoryService.getCategoryForAdmin();
            setCategories(response);
            return response;
        } catch (error) {
            showErrorNotification('Không thể tải danh sách danh mục');
            return [];
        } finally {
            setIsLoading(false);
        }
    }, []);

    const fetchDisabledCategories = useCallback(async () => {
        setIsLoadingDisabled(true);
        try {
            const response = await CategoryService.getCategoryDisabledForAdmin();
            setDisabledCategories(response);
            return response;
        } catch (error) {
            showErrorNotification('Không thể tải danh sách danh mục bị ẩn');
            return [];
        } finally {
            setIsLoadingDisabled(false);
        }
    }, []);

    const addCategory = useCallback(async (categoryData: CategoryRequestDto) => {
        setIsSubmitting(true);
        try {
            const response = await CategoryService.addCategory(categoryData);
            showSuccessNotification('Thêm danh mục thành công');
            if (categoryData.visible === false) {
                await fetchDisabledCategories();
            } else {
                await fetchCategories();
            }
            return response;
        } catch (error) {
            showErrorNotification('Không thể thêm danh mục');
            return null;
        } finally {
            setIsSubmitting(false);
        }
    }, [fetchCategories]);

    const updateCategory = useCallback(async (categoryId: string, categoryData: CategoryRequestDto) => {
        setIsSubmitting(true);
        try {
            const response = await CategoryService.updateCategory(categoryId, categoryData);
            showSuccessNotification('Cập nhật danh mục thành công');
            if (categoryData.visible === false) {
                await fetchDisabledCategories();
            } else {
                await fetchCategories();
            }
            return response;
        } catch (error) {
            showErrorNotification('Không thể cập nhật danh mục');
            return null;
        } finally {
            setIsSubmitting(false);
        }
    }, [fetchCategories]);

    const toggleCategoryStatus = useCallback(async (categoryId: string, includeChildren: boolean = false) => {
        setIsSubmitting(true);
        try {
            await CategoryService.toggleCategoryStatus(categoryId, includeChildren);
            showSuccessNotification('Đã cập nhật trạng thái danh mục');
            await fetchCategories();
            await fetchDisabledCategories();
            return true;
        } catch (error) {
            showErrorNotification('Không thể cập nhật trạng thái danh mục');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [fetchCategories, fetchDisabledCategories]);

    const deleteCategory = useCallback(async (categoryId: string, includeChildren: boolean = false) => {
        setIsSubmitting(true);
        try {
            await CategoryService.deleteCategory(categoryId, includeChildren);
            showSuccessNotification('Xóa danh mục thành công');
            await fetchCategories();
            await fetchDisabledCategories();
            return true;
        } catch (error) {
            showErrorNotification('Không thể xóa danh mục');
            return false;
        } finally {
            setIsSubmitting(false);
        }
    }, [fetchCategories, fetchDisabledCategories]);

    useEffect(() => {
        if (autoFetch) {
            fetchCategories();
            fetchDisabledCategories();
        }
    }, [autoFetch, fetchCategories, fetchDisabledCategories]);

    return {
        categories,
        disabledCategories,
        isLoading,
        isLoadingDisabled,
        isSubmitting,
        fetchCategories,
        fetchDisabledCategories,
        addCategory,
        updateCategory,
        toggleCategoryStatus,
        deleteCategory,
    };
};
