import {
    type ColumnDef,
    type SortingState,
    type RowSelectionState,
    flexRender,
    getCoreRowModel,
    useReactTable,
} from '@tanstack/react-table';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { useEffect, useState } from 'react';
import { useProducts } from './useProducts';
import { type Product } from '@/types/types';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProductsTableProps {
    columns: ColumnDef<Product>[];
    search: string;
}

export function ProductsTable({ columns, search }: ProductsTableProps) {
    const [pagination, setPagination] = useState({ pageIndex: 0, pageSize: 20 });
    const { pageIndex, pageSize } = pagination;

    const [rowSelection, setRowSelection] = useState<RowSelectionState>({});

    const [sorting, setSorting] = useState<SortingState>(() => {
        try {
            const saved = localStorage.getItem('products-sorting');
            return saved ? JSON.parse(saved) : [];
        } catch {
            return [];
        }
    });

    useEffect(() => {
        localStorage.setItem('products-sorting', JSON.stringify(sorting));
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [sorting]);

    useEffect(() => {
        setPagination(prev => ({ ...prev, pageIndex: 0 }));
    }, [search]);

    const sortBy = sorting[0]?.id ?? null;
    const order: 'asc' | 'desc' = sorting[0]?.desc ? 'desc' : 'asc';

    const { data, isPending, isFetching, isError, error } = useProducts(pageIndex, pageSize, search, sortBy, order);

    // eslint-disable-next-line react-hooks/incompatible-library
    const table = useReactTable<Product>({
        data: data?.products ?? [],
        columns,
        getCoreRowModel: getCoreRowModel(),
        rowCount: data?.total ?? 0,
        manualPagination: true,
        manualSorting: true,
        enableRowSelection: true,
        onPaginationChange: setPagination,
        onSortingChange: setSorting,
        onRowSelectionChange: setRowSelection,
        state: {
            pagination: { pageIndex, pageSize },
            sorting,
            rowSelection,
        },
    });

    const totalPages = Math.ceil((data?.total ?? 0) / pageSize);
    const maxVisiblePages = 5;
    let startPage = Math.max(0, pageIndex - Math.floor(maxVisiblePages / 2));
    const endPage = Math.min(totalPages, startPage + maxVisiblePages);
    if (endPage - startPage < maxVisiblePages) {
        startPage = Math.max(0, endPage - maxVisiblePages);
    }
    const visiblePages = Array.from({ length: endPage - startPage }, (_, i) => startPage + i);

    return (
        <div className="h-full flex flex-col gap-3">
            <div className="flex-1 min-h-0 flex flex-col bg-white rounded-lg">
                <div className="h-0.5 w-full overflow-hidden shrink-0">
                    {isFetching && (
                        <div className="h-full w-1/3 bg-primary animate-[indeterminate_1.2s_ease-in-out_infinite]" />
                    )}
                </div>

                {isError ? (
                    <div className="flex-1 flex items-center justify-center text-destructive">
                        Ошибка загрузки: {error?.message ?? 'Неизвестная ошибка'}
                    </div>
                ) : isPending ? (
                    <div className="flex-1 flex items-center justify-center text-muted-foreground">Загрузка...</div>
                ) : (
                    <div className="flex-1 overflow-auto min-h-0">
                        <Table className="table-fixed w-full">
                            <TableHeader className="sticky top-0 bg-white z-10 ">
                                {table.getHeaderGroups().map(headerGroup => (
                                    <TableRow key={headerGroup.id}>
                                        {headerGroup.headers.map(header => (
                                            <TableHead
                                                key={header.id}
                                                className='sticky top-0 bg-white z-10 text-muted-foreground/50'
                                                style={{ width: header.getSize() }}>
                                                {header.isPlaceholder
                                                    ? null
                                                    : flexRender(header.column.columnDef.header, header.getContext())}
                                            </TableHead>
                                        ))}
                                    </TableRow>
                                ))}
                            </TableHeader>
                            <TableBody>
                                {table.getRowModel().rows.length ? (
                                    table.getRowModel().rows.map(row => (
                                        <TableRow
                                            key={row.id}
                                            data-state={row.getIsSelected() && 'selected'}>
                                            {row.getVisibleCells().map(cell => (
                                                <TableCell key={cell.id}>
                                                    {flexRender(cell.column.columnDef.cell, cell.getContext())}
                                                </TableCell>
                                            ))}
                                        </TableRow>
                                    ))
                                ) : (
                                    <TableRow>
                                        <TableCell
                                            colSpan={columns.length}
                                            className="h-24 text-center">
                                            Ничего не найдено.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>
            {!isPending && !isError && (
                <div className="shrink-0 flex items-center justify-between px-2">
                    <span className="text-sm text-muted-foreground">
                        Показано{' '}
                        <span className="text-black">
                            {pageIndex * pageSize + 1}–{Math.min((pageIndex + 1) * pageSize, data?.total ?? 0)}
                        </span>{' '}
                        из <span className="text-black">{data?.total ?? 0}</span>
                    </span>
                    <div className="flex items-center gap-1">
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => table.previousPage()}
                            disabled={!table.getCanPreviousPage()}
                            className="h-8 w-8 p-0">
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        {visiblePages.map(page => (
                            <Button
                                key={page}
                                variant={pageIndex === page ? 'secondary' : 'outline'}
                                size="sm"
                                onClick={() => setPagination({ pageIndex: page, pageSize })}
                                className={cn('h-8 w-8 p-0', pageIndex === page ? 'text-white' : 'text-gray-400')}>
                                {page + 1}
                            </Button>
                        ))}
                        <Button
                            variant="ghost"
                            size="sm"
                            onClick={() => table.nextPage()}
                            disabled={!table.getCanNextPage()}
                            className="h-8 w-8 p-0">
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            )}
        </div>
    );
}
