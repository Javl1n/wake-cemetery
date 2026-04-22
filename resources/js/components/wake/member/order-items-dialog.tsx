import { router } from '@inertiajs/react';
import { useState } from 'react';
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
import { Badge } from '@/components/ui/badge';
import { Minus, Plus, ShoppingCart, Trash2 } from 'lucide-react';
import type { InventoryItem, WakeSchedule } from '@/types/wake';

interface Props {
    open: boolean;
    onClose: () => void;
    schedule: WakeSchedule;
    inventoryItems: InventoryItem[];
}

interface CartItem {
    item: InventoryItem;
    quantity: number;
}

export default function OrderItemsDialog({ open, onClose, schedule, inventoryItems }: Props) {
    const [cart, setCart] = useState<CartItem[]>([]);
    const [search, setSearch] = useState('');
    const [notes, setNotes] = useState('');
    const [processing, setProcessing] = useState(false);
    const [errors, setErrors] = useState<{ notes?: string; items?: string }>({});

    const filteredItems = inventoryItems.filter(
        (item) =>
            item.name.toLowerCase().includes(search.toLowerCase()) ||
            item.description?.toLowerCase().includes(search.toLowerCase()),
    );

    const addToCart = (item: InventoryItem) => {
        setCart((prev) => {
            const existing = prev.find((c) => c.item.id === item.id);
            if (existing) {
                return prev.map((c) => (c.item.id === item.id ? { ...c, quantity: c.quantity + 1 } : c));
            }
            return [...prev, { item, quantity: 1 }];
        });
    };

    const updateQuantity = (itemId: number, quantity: number) => {
        if (quantity < 1) {
            removeFromCart(itemId);
            return;
        }
        setCart((prev) => prev.map((c) => (c.item.id === itemId ? { ...c, quantity } : c)));
    };

    const removeFromCart = (itemId: number) => {
        setCart((prev) => prev.filter((c) => c.item.id !== itemId));
    };

    const cartTotal = cart.reduce((sum, c) => sum + c.item.price * c.quantity, 0);

    const handleSubmit = () => {
        setProcessing(true);
        router.post(
            `/member/wake-schedules/${schedule.id}/orders`,
            {
                items: cart.map((c) => ({ id: c.item.id, quantity: c.quantity })),
                notes,
            },
            {
                onSuccess: () => {
                    setCart([]);
                    setNotes('');
                    setErrors({});
                    onClose();
                },
                onError: (errs) => setErrors(errs as { notes?: string; items?: string }),
                onFinish: () => setProcessing(false),
            },
        );
    };

    const handleClose = () => {
        setCart([]);
        setNotes('');
        setErrors({});
        setSearch('');
        onClose();
    };

    return (
        <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
            <DialogContent className="max-w-2xl max-h-[90vh] flex flex-col overflow-hidden p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center gap-2">
                        <ShoppingCart className="h-5 w-5" />
                        Order Items
                    </DialogTitle>
                    <DialogDescription>
                        Add items to your wake schedule. Orders are subject to staff review.
                    </DialogDescription>
                </DialogHeader>

                <div className="overflow-y-auto p-6 flex flex-col gap-4">
                    {/* Cart Summary */}
                    {cart.length > 0 && (
                        <div className="rounded-lg border bg-muted/40 p-3 space-y-2">
                            <p className="text-sm font-semibold">Your Order ({cart.length} item{cart.length !== 1 ? 's' : ''})</p>
                            <div className="max-h-32 overflow-y-auto space-y-1.5">
                                {cart.map((c) => (
                                    <div key={c.item.id} className="flex items-center gap-2 text-sm">
                                        <span className="flex-1 truncate">{c.item.name}</span>
                                        <div className="flex items-center gap-1">
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => updateQuantity(c.item.id, c.quantity - 1)}
                                            >
                                                <Minus className="h-3 w-3" />
                                            </Button>
                                            <span className="w-6 text-center">{c.quantity}</span>
                                            <Button
                                                type="button"
                                                variant="outline"
                                                size="icon"
                                                className="h-6 w-6"
                                                onClick={() => updateQuantity(c.item.id, c.quantity + 1)}
                                            >
                                                <Plus className="h-3 w-3" />
                                            </Button>
                                        </div>
                                        <span className="w-24 text-right font-medium">
                                            ₱{(c.item.price * c.quantity).toLocaleString()}
                                        </span>
                                        <Button
                                            type="button"
                                            variant="ghost"
                                            size="icon"
                                            className="h-6 w-6 text-destructive hover:text-destructive"
                                            onClick={() => removeFromCart(c.item.id)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                ))}
                            </div>
                            <div className="flex justify-between text-sm font-bold border-t pt-2">
                                <span>Order Total</span>
                                <span>₱{cartTotal.toLocaleString()}</span>
                            </div>
                        </div>
                    )}

                    {/* Search */}
                    <Input
                        placeholder="Search items..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />

                    {/* Items List */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                            {filteredItems.map((item) => {
                                const inCart = cart.find((c) => c.item.id === item.id);
                                return (
                                    <div
                                        key={item.id}
                                        className={`rounded-lg border p-3 space-y-1 transition-colors ${inCart ? 'border-primary bg-primary/5' : 'bg-background'}`}
                                    >
                                        <div className="flex items-start justify-between gap-2">
                                            <div className="flex-1 min-w-0">
                                                <p className="text-sm font-medium truncate">{item.name}</p>
                                                {item.description && (
                                                    <p className="text-xs text-muted-foreground truncate">{item.description}</p>
                                                )}
                                            </div>
                                            <Badge variant="outline" className="shrink-0 text-xs">
                                                {item.unit}
                                            </Badge>
                                        </div>
                                        <div className="flex items-center justify-between">
                                            <span className="text-sm font-bold">₱{item.price.toLocaleString()}</span>
                                            <Button
                                                type="button"
                                                size="sm"
                                                variant={inCart ? 'default' : 'outline'}
                                                className="h-7 text-xs"
                                                onClick={() => addToCart(item)}
                                            >
                                                <Plus className="h-3 w-3 mr-1" />
                                                {inCart ? `Add (${inCart.quantity})` : 'Add'}
                                            </Button>
                                        </div>
                                    </div>
                                );
                            })}
                            {filteredItems.length === 0 && (
                                <p className="text-sm text-muted-foreground col-span-2 text-center py-6">
                                    No items found
                                </p>
                            )}
                    </div>

                    {/* Notes */}
                    <div className="space-y-1">
                        <Label className="text-sm">Notes (optional)</Label>
                        <Textarea
                            placeholder="Any special instructions for this order..."
                            rows={2}
                            value={notes}
                            onChange={(e) => setNotes(e.target.value)}
                        />
                        {errors.notes && <p className="text-xs text-destructive">{errors.notes}</p>}
                    </div>
                </div>

                <DialogFooter className="px-6 pb-6 gap-2">
                    <Button type="button" variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        disabled={cart.length === 0 || processing}
                        onClick={handleSubmit}
                    >
                        {processing ? 'Placing Order...' : `Place Order (₱${cartTotal.toLocaleString()})`}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
