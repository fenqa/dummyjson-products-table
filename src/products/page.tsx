import { useMemo, useState } from 'react';
import { createColumns } from './columns';
import { ProductsTable } from './products-table';
import { Button } from '@/components/ui/button';
import { Plus, RefreshCw } from 'lucide-react';
import { AddProductDialog } from './add-product-dialog';

const Products = ({ search }: { search: string }) => {
    const [addOpen, setAddOpen] = useState(false);
    const columns = useMemo(() => createColumns(() => setAddOpen(true)), []);

    return (
        <div className="h-full flex flex-col px-8 py-8">
            <div className="mb-6 shrink-0 flex items-center justify-between">
                <h2 className="font-semibold text-base">Все позиции</h2>
                <div className="flex items-center gap-2">
                    <Button variant="outline" size="icon">
                        <RefreshCw className="h-4 w-4" />
                    </Button>
                    <Button onClick={() => setAddOpen(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        Добавить
                    </Button>
                </div>
            </div>
            <div className="flex-1 min-h-0">
                <ProductsTable columns={columns} search={search} />
            </div>
            <AddProductDialog open={addOpen} onOpenChange={setAddOpen} />
        </div>
    );
};

export default Products;
