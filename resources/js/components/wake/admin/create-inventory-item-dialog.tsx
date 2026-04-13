import { useForm } from '@inertiajs/react';
import { FormEventHandler, useRef, useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Checkbox } from '@/components/ui/checkbox';
import { ImagePlus, X } from 'lucide-react';
import type { InventoryCategory } from '@/types/wake';

interface Props {
    categories: InventoryCategory[];
    open: boolean;
    onClose: () => void;
}

export default function CreateInventoryItemDialog({ categories, open, onClose }: Props) {
    const fileInputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(null);

    const { data, setData, post, processing, errors, reset } = useForm<{
        category_id: string;
        name: string;
        description: string;
        price: string;
        stock: string;
        unit: string;
        available: boolean;
        image: File | null;
    }>({
        category_id: '',
        name: '',
        description: '',
        price: '',
        stock: '',
        unit: '',
        available: true,
        image: null,
    });

    const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const file = e.target.files?.[0] ?? null;
        setData('image', file);
        if (file) {
            setPreview(URL.createObjectURL(file));
        }
    };

    const clearImage = () => {
        setData('image', null);
        setPreview(null);
        if (fileInputRef.current) {
            fileInputRef.current.value = '';
        }
    };

    const handleClose = () => {
        reset();
        setPreview(null);
        onClose();
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/inventory-items', {
            forceFormData: true,
            onSuccess: () => {
                reset();
                setPreview(null);
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={handleClose}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>New Inventory Item</DialogTitle>
                    <DialogDescription>Add a new item to the inventory.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit} className="space-y-4 py-2">
                    <div className="grid gap-2">
                        <Label>Photo</Label>
                        {preview ? (
                            <div className="relative w-full overflow-hidden rounded-lg border">
                                <img
                                    src={preview}
                                    alt="Preview"
                                    className="h-40 w-full object-cover"
                                />
                                <Button
                                    type="button"
                                    size="icon"
                                    variant="secondary"
                                    className="absolute right-2 top-2 h-7 w-7"
                                    onClick={clearImage}
                                >
                                    <X className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        ) : (
                            <button
                                type="button"
                                onClick={() => fileInputRef.current?.click()}
                                className="flex h-32 w-full cursor-pointer flex-col items-center justify-center gap-2 rounded-lg border border-dashed text-sm text-muted-foreground transition-colors hover:border-foreground/40 hover:text-foreground"
                            >
                                <ImagePlus className="h-6 w-6" />
                                Click to upload a photo
                            </button>
                        )}
                        <input
                            ref={fileInputRef}
                            type="file"
                            accept="image/*"
                            className="hidden"
                            onChange={handleFileChange}
                        />
                        {errors.image && (
                            <p className="text-sm text-destructive">{errors.image}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="category_id">Category</Label>
                        <Select
                            value={data.category_id}
                            onValueChange={(v) => setData('category_id', v)}
                        >
                            <SelectTrigger>
                                <SelectValue placeholder="Select a category" />
                            </SelectTrigger>
                            <SelectContent>
                                {categories.map((cat) => (
                                    <SelectItem key={cat.id} value={cat.id.toString()}>
                                        {cat.name}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {errors.category_id && (
                            <p className="text-sm text-destructive">{errors.category_id}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="name">Name</Label>
                        <Input
                            id="name"
                            value={data.name}
                            onChange={(e) => setData('name', e.target.value)}
                            placeholder="e.g., Funeral Casket"
                        />
                        {errors.name && (
                            <p className="text-sm text-destructive">{errors.name}</p>
                        )}
                    </div>

                    <div className="grid gap-2">
                        <Label htmlFor="description">Description</Label>
                        <Textarea
                            id="description"
                            value={data.description}
                            onChange={(e) => setData('description', e.target.value)}
                            rows={2}
                        />
                        {errors.description && (
                            <p className="text-sm text-destructive">{errors.description}</p>
                        )}
                    </div>

                    <div className="grid grid-cols-3 gap-4">
                        <div className="grid gap-2">
                            <Label htmlFor="price">Price (₱)</Label>
                            <Input
                                id="price"
                                type="number"
                                min="0"
                                step="0.01"
                                value={data.price}
                                onChange={(e) => setData('price', e.target.value)}
                            />
                            {errors.price && (
                                <p className="text-sm text-destructive">{errors.price}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="stock">Stock</Label>
                            <Input
                                id="stock"
                                type="number"
                                min="0"
                                value={data.stock}
                                onChange={(e) => setData('stock', e.target.value)}
                            />
                            {errors.stock && (
                                <p className="text-sm text-destructive">{errors.stock}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="unit">Unit</Label>
                            <Input
                                id="unit"
                                value={data.unit}
                                onChange={(e) => setData('unit', e.target.value)}
                                placeholder="pcs, set..."
                            />
                            {errors.unit && (
                                <p className="text-sm text-destructive">{errors.unit}</p>
                            )}
                        </div>
                    </div>

                    <div className="flex items-center gap-3">
                        <Checkbox
                            id="available"
                            checked={data.available}
                            onCheckedChange={(checked) => setData('available', !!checked)}
                        />
                        <Label htmlFor="available">Available for scheduling</Label>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={handleClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Create Item'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
