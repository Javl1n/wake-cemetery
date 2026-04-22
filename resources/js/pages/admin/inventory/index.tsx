import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent } from '@/components/ui/card';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Package, ImageOff } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import CreateInventoryItemDialog from '@/components/wake/admin/create-inventory-item-dialog';
import EditInventoryItemDialog from '@/components/wake/admin/edit-inventory-item-dialog';
import type { InventoryItem, InventoryCategory } from '@/types/wake';

interface Props {
    items: InventoryItem[];
    categories: InventoryCategory[];
}

export default function InventoryIndex({ items, categories }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [filterCategory, setFilterCategory] = useState('all');
    const [filterAvailable, setFilterAvailable] = useState('all');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingItem, setEditingItem] = useState<InventoryItem | null>(null);
    const [deletingItem, setDeletingItem] = useState<InventoryItem | null>(null);

    const filteredItems = useMemo(() => {
        return items.filter((item) => {
            const matchesSearch = item.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesCategory =
                filterCategory === 'all' || item.category_id === parseInt(filterCategory);
            const matchesAvailable =
                filterAvailable === 'all' ||
                (filterAvailable === 'available' ? item.available : !item.available);

            return matchesSearch && matchesCategory && matchesAvailable;
        });
    }, [items, searchQuery, filterCategory, filterAvailable]);

    const handleEdit = (item: InventoryItem, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingItem(item);
    };

    const handleDelete = (item: InventoryItem, e: React.MouseEvent) => {
        e.stopPropagation();
        setDeletingItem(item);
    };

    const confirmDelete = () => {
        if (!deletingItem) return;
        router.delete(`/inventory-items/${deletingItem.id}`, {
            onFinish: () => setDeletingItem(null),
        });
    };

    const categoryName = (categoryId: number) =>
        categories.find((c) => c.id === categoryId)?.name ?? 'Uncategorized';

    return (
        <AppLayout breadcrumbs={[{ title: 'Inventory', href: '/inventory-items' }]}>
            <Head title="Inventory" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Inventory</h1>
                        <p className="text-sm text-muted-foreground">
                            {items.length} item{items.length !== 1 ? 's' : ''} total
                        </p>
                    </div>
                    <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Item
                    </Button>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap gap-3">
                    <Input
                        placeholder="Search items..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64"
                    />
                    <Select value={filterCategory} onValueChange={setFilterCategory}>
                        <SelectTrigger className="w-48">
                            <SelectValue placeholder="All categories" />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All categories</SelectItem>
                            {categories.map((cat) => (
                                <SelectItem key={cat.id} value={cat.id.toString()}>
                                    {cat.name}
                                </SelectItem>
                            ))}
                        </SelectContent>
                    </Select>
                    <Select value={filterAvailable} onValueChange={setFilterAvailable}>
                        <SelectTrigger className="w-40">
                            <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="all">All items</SelectItem>
                            <SelectItem value="available">Available</SelectItem>
                            <SelectItem value="unavailable">Unavailable</SelectItem>
                        </SelectContent>
                    </Select>
                </div>

                {/* Items grid */}
                {filteredItems.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                        <Package className="mb-3 h-10 w-10 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">No items found</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredItems.map((item) => (
                            <Card key={item.id} className="relative flex flex-col overflow-hidden pt-0">
                                {item.image ? (
                                    <img
                                        src={`/storage/${item.image}`}
                                        alt={item.name}
                                        className="h-36 w-full object-cover"
                                    />
                                ) : (
                                    <div className="flex h-36 w-full items-center justify-center bg-muted">
                                        <ImageOff className="h-8 w-8 text-muted-foreground/40" />
                                    </div>
                                )}
                                <CardContent className="flex flex-1 flex-col justify-between p-4">
                                    <div>
                                        <div className="mb-3 flex items-start justify-between gap-2">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate font-medium">{item.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {categoryName(item.category_id)}
                                                </p>
                                            </div>
                                            <Badge
                                                variant={item.available ? 'default' : 'secondary'}
                                                className="shrink-0 text-xs"
                                            >
                                                {item.available ? 'Available' : 'Unavailable'}
                                            </Badge>
                                        </div>

                                        <p className="mb-3 line-clamp-2 text-sm text-muted-foreground">
                                            {item.description}
                                        </p>

                                        <div className="mb-4 flex items-center justify-between text-sm">
                                            <span className="font-semibold">
                                                ₱{parseFloat(item.price.toString()).toLocaleString()}
                                            </span>
                                            <span className="text-muted-foreground">
                                                {item.stock} {item.unit}
                                            </span>
                                        </div>
                                    </div>

                                    <div className="flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={(e) => handleEdit(item, e)}
                                        >
                                            <Edit className="mr-1 h-3 w-3" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-destructive hover:text-destructive"
                                            onClick={(e) => handleDelete(item, e)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <CreateInventoryItemDialog
                categories={categories}
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
            />

            {editingItem && (
                <EditInventoryItemDialog
                    item={editingItem}
                    categories={categories}
                    open={!!editingItem}
                    onClose={() => setEditingItem(null)}
                />
            )}

            <Dialog open={!!deletingItem} onOpenChange={() => setDeletingItem(null)}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete item?</DialogTitle>
                        <DialogDescription>
                            This will permanently delete <strong>{deletingItem?.name}</strong>. This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingItem(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
