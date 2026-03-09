import { useState } from 'react';
import { toast } from 'sonner';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
    DialogFooter,
} from '@/components/ui/dialog';

interface AddProductDialogProps {
    open: boolean;
    onOpenChange: (open: boolean) => void;
}

interface FormData {
    title: string;
    price: string;
    brand: string;
    sku: string;
}

const initialFormData: FormData = { title: '', price: '', brand: '', sku: '' };

export const AddProductDialog = ({ open, onOpenChange }: AddProductDialogProps) => {
    const [formData, setFormData] = useState<FormData>(initialFormData);
    const [errors, setErrors] = useState<Partial<FormData>>({});

    const validate = (): boolean => {
        const newErrors: Partial<FormData> = {};
        if (!formData.title.trim()) newErrors.title = 'Обязательное поле';
        if (!formData.price.trim()) {
            newErrors.price = 'Обязательное поле';
        } else if (isNaN(Number(formData.price)) || Number(formData.price) <= 0) {
            newErrors.price = 'Введите корректную цену';
        }
        if (!formData.brand.trim()) newErrors.brand = 'Обязательное поле';
        if (!formData.sku.trim()) newErrors.sku = 'Обязательное поле';
        setErrors(newErrors);
        return Object.keys(newErrors).length === 0;
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (!validate()) return;
        toast.success('Товар успешно добавлен');
        setFormData(initialFormData);
        setErrors({});
        onOpenChange(false);
    };

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData(prev => ({ ...prev, [name]: value }));
        if (errors[name as keyof FormData]) {
            setErrors(prev => ({ ...prev, [name]: undefined }));
        }
    };

    const handleOpenChange = (open: boolean) => {
        if (!open) {
            setFormData(initialFormData);
            setErrors({});
        }
        onOpenChange(open);
    };

    return (
        <Dialog open={open} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>Добавить товар</DialogTitle>
                </DialogHeader>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div className="space-y-2">
                        <Label htmlFor="title">Наименование</Label>
                        <Input
                            id="title"
                            name="title"
                            value={formData.title}
                            onChange={handleChange}
                            placeholder="Введите наименование"
                        />
                        {errors.title && <p className="text-sm text-destructive">{errors.title}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="price">Цена</Label>
                        <Input
                            id="price"
                            name="price"
                            value={formData.price}
                            onChange={handleChange}
                            placeholder="0.00"
                        />
                        {errors.price && <p className="text-sm text-destructive">{errors.price}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="brand">Вендор</Label>
                        <Input
                            id="brand"
                            name="brand"
                            value={formData.brand}
                            onChange={handleChange}
                            placeholder="Введите вендора"
                        />
                        {errors.brand && <p className="text-sm text-destructive">{errors.brand}</p>}
                    </div>
                    <div className="space-y-2">
                        <Label htmlFor="sku">Артикул</Label>
                        <Input
                            id="sku"
                            name="sku"
                            value={formData.sku}
                            onChange={handleChange}
                            placeholder="Введите артикул"
                        />
                        {errors.sku && <p className="text-sm text-destructive">{errors.sku}</p>}
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={() => handleOpenChange(false)}>
                            Отмена
                        </Button>
                        <Button type="submit">Добавить</Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
};
