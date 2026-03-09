import type { Product } from '@/types/types';
import type { ColumnDef } from '@tanstack/react-table';
import { ArrowUpDown, ArrowUp, ArrowDown, MoreHorizontal, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { DropdownMenu, DropdownMenuTrigger } from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';

function SortIcon({ sorted }: { sorted: false | 'asc' | 'desc' }) {
    if (sorted === 'asc') return <ArrowUp className="ml-2 h-4 w-4" />;
    if (sorted === 'desc') return <ArrowDown className="ml-2 h-4 w-4" />;
    return <ArrowUpDown className="ml-2 h-4 w-4 opacity-40" />;
}

const priceFormatter = new Intl.NumberFormat('ru-RU', {
    minimumFractionDigits: 2,
    maximumFractionDigits: 2,
});

export const createColumns = (onAdd: () => void): ColumnDef<Product>[] => [
    {
        id: 'select',
        size: 48,
        header: ({ table }) => (
            <Checkbox
                checked={table.getIsAllPageRowsSelected()}
                onCheckedChange={value => table.toggleAllPageRowsSelected(!!value)}
                aria-label="Выбрать все"
            />
        ),
        cell: ({ row }) => (
            <Checkbox
                checked={row.getIsSelected()}
                onCheckedChange={value => row.toggleSelected(!!value)}
                aria-label="Выбрать строку"
            />
        ),
        enableSorting: false,
    },
    {
        accessorKey: 'title',
        size: 300,
        header: 'Наименование',
        cell: ({ row }) => {
            const { title, category, thumbnail } = row.original;
            return (
                <div className="flex items-center gap-3">
                    <img
                        src={thumbnail}
                        alt={title}
                        className="h-12 w-12 rounded-md object-cover bg-muted shrink-0"
                    />
                    <div>
                        <div className="font-medium text-sm leading-tight">{title}</div>
                        <div className="text-xs text-muted-foreground/70 mt-0.5">{category}</div>
                    </div>
                </div>
            );
        },
    },
    {
        accessorKey: 'brand',
        size: 150,
        header: 'Вендор',
        cell: ({ row }) => <span className="font-semibold">{row.getValue('brand')}</span>,
    },
    {
        accessorKey: 'sku',
        size: 150,
        header: 'Артикул',
    },
    {
        accessorKey: 'rating',
        size: 120,
        enableSorting: true,
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="-ml-3"
                onClick={() => {
                    const sorted = column.getIsSorted();
                    if (sorted === 'desc') column.clearSorting();
                    else column.toggleSorting(sorted === 'asc');
                }}>
                Оценка
                <SortIcon sorted={column.getIsSorted()} />
            </Button>
        ),
        cell: ({ row }) => {
            const rating = row.getValue<number>('rating');
            return (
                <>
                    <span className={cn(rating < 3 && 'text-destructive')}>{rating}</span>
                    <span>/5</span>
                </>
            );
        },
    },
    {
        accessorKey: 'price',
        size: 140,
        enableSorting: true,
        header: ({ column }) => (
            <Button
                variant="ghost"
                className="-ml-3"
                onClick={() => {
                    const sorted = column.getIsSorted();
                    if (sorted === 'desc') column.clearSorting();
                    else column.toggleSorting(sorted === 'asc');
                }}>
                Цена, ₽
                <SortIcon sorted={column.getIsSorted()} />
            </Button>
        ),
        cell: ({ row }) => {
            const price = priceFormatter.format(row.getValue<number>('price'))
            const [integerPart, decimalPart] = price.split(',')

            return (
                <span className="font-mono">
                    <span>{integerPart}</span>
                    <span className="text-muted-foreground/70">,{decimalPart}</span>
                </span>
            );
        },
    },
    {
        id: 'actions',
        size: 110,
        cell: () => (
            <div className="flex items-center gap-8">
                <Button
                    size="lg"
                    onClick={onAdd}>
                    <Plus className="h-4 w-4" />
                </Button>
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="outline"
                            className="rounded-full"
                            size="icon-xs">
                            <MoreHorizontal className="h-4 w-4" />
                        </Button>
                    </DropdownMenuTrigger>
                </DropdownMenu>
            </div>
        ),
    },
];
