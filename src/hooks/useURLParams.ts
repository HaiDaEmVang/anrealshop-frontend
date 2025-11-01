import { useCallback } from 'react';
import { useSearchParams } from 'react-router-dom';

export const useURLParams = () => {
    const [searchParams, setSearchParams] = useSearchParams();

    const getParam = useCallback(
        <T extends string>(key: string, defaultValue?: T): string => {
            const value = searchParams.get(key);
            return value || defaultValue || '';
        },
        [searchParams]
    );

    const updateParams = useCallback(
        (
            updates: Record<string, string | number | null | undefined>,
            options: { replace?: boolean; preserveOthers?: boolean } = { replace: true, preserveOthers: true }
        ) => {
            const newParams = options.preserveOthers ? new URLSearchParams(searchParams) : new URLSearchParams();

            Object.entries(updates).forEach(([key, value]) => {
                if (value === null || value === undefined || value === '' || value === 'all') {
                    newParams.delete(key);
                } else {
                    newParams.set(key, String(value));
                }
            });

            setSearchParams(newParams, { replace: options.replace });
        },
        [searchParams, setSearchParams]
    );

    const clearParams = useCallback(
        (keys?: string[]) => {
            if (!keys || keys.length === 0) {
                setSearchParams({}, { replace: true });
                return;
            }

            const newParams = new URLSearchParams(searchParams);
            keys.forEach(key => newParams.delete(key));
            setSearchParams(newParams, { replace: true });
        },
        [searchParams, setSearchParams]
    );

    const setPageParam = useCallback(
        (page: number, resetParams?: string[]) => {
            const updates: Record<string, string | null> = {};

            if (resetParams && resetParams.length > 0) {
                resetParams.forEach(param => {
                    updates[param] = null;
                });
            }

            updates.page = page > 1 ? String(page) : null;

            updateParams(updates);
        },
        [updateParams]
    );

    return {
        getParam,
        updateParams,
        clearParams,
        setPageParam,
        searchParams,
    };
};
