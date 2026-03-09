import { useQuery, keepPreviousData } from '@tanstack/react-query';
import { type ProductsQueryResult } from '@/types/types';

const apiUrl = 'https://dummyjson.com/products';

export const useProducts = (
    pageIndex: number,
    pageSize: number,
    search: string,
    sortBy: string | null,
    order: 'asc' | 'desc'
) => {
    return useQuery<ProductsQueryResult>({
        queryKey: ['products', pageIndex, pageSize, search, sortBy, order],
        queryFn: async () => {
            const params = new URLSearchParams({
                skip: String(pageIndex * pageSize),
                limit: String(pageSize),
            });
            if (sortBy) {
                params.set('sortBy', sortBy);
                params.set('order', order);
            }
            if (search) {
                params.set('q', search);
                const response = await fetch(`${apiUrl}/search?${params}`);
                if (!response.ok) throw new Error(`HTTP ${response.status}`);
                return response.json();
            }
            const response = await fetch(`${apiUrl}?${params}`);
            if (!response.ok) throw new Error(`HTTP ${response.status}`);
            return response.json();
        },
        placeholderData: keepPreviousData,
    });
};
