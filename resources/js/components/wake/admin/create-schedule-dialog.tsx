import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
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
import { ScrollArea } from '@/components/ui/scroll-area';
import { Textarea } from '@/components/ui/textarea';
import type { WakePackage, WakeRoom, WakeService, InventoryItem } from '@/types/wake';

interface Beneficiary {
    id: number;
    name: string;
    relationship: string;
    contact: string;
    subscription?: { id: number };
}

interface Props {
    open: boolean;
    onClose: () => void;
    rooms: WakeRoom[];
    packages: WakePackage[];
    services: WakeService[];
    inventoryItems: InventoryItem[];
    beneficiaries: Beneficiary[];
}

export default function CreateScheduleDialog({
    open,
    onClose,
    rooms,
    packages,
    services,
    inventoryItems,
    beneficiaries,
}: Props) {
    const { data, setData, post, processing, errors, reset } = useForm({
        beneficiary_id: '',
        date_of_death: '',
        cause_of_death: '',
        room_id: '',
        package_id: '',
        date_start: '',
        date_end: '',
        notes: '',
        services: [] as { id: number; fee?: number }[],
        inventory_items: [] as { id: number; quantity: number }[],
        create_claim: false,
    });

    const [selectedPackage, setSelectedPackage] = useState<WakePackage | null>(null);
    const [selectedServiceIds, setSelectedServiceIds] = useState<Set<number>>(new Set());
    const [selectedItems, setSelectedItems] = useState<Map<number, number>>(new Map());

    // Pre-check package services when package changes
    useEffect(() => {
        if (selectedPackage?.services) {
            setSelectedServiceIds(new Set(selectedPackage.services.map((s) => s.id)));
        } else {
            setSelectedServiceIds(new Set());
        }
    }, [selectedPackage]);

    // Sync additional services (exclude package-included ones) to form data
    useEffect(() => {
        const additional = Array.from(selectedServiceIds)
            .filter((id) => !selectedPackage?.services?.some((s) => s.id === id))
            .map((id) => ({ id, fee: services.find((s) => s.id === id)?.price }));
        setData('services', additional);
    }, [selectedServiceIds, selectedPackage]);

    // Sync inventory items to form data
    useEffect(() => {
        setData(
            'inventory_items',
            Array.from(selectedItems.entries()).map(([id, quantity]) => ({ id, quantity })),
        );
    }, [selectedItems]);

    const handlePackageChange = (packageId: string) => {
        setData('package_id', packageId);
        setSelectedPackage(packages.find((p) => p.id === parseInt(packageId)) || null);
    };

    const toggleService = (serviceId: number) => {
        setSelectedServiceIds((prev) => {
            const next = new Set(prev);
            next.has(serviceId) ? next.delete(serviceId) : next.add(serviceId);
            return next;
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/wake-schedules', {
            onSuccess: () => {
                reset();
                setSelectedPackage(null);
                setSelectedServiceIds(new Set());
                setSelectedItems(new Map());
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-200 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Create Wake Schedule</DialogTitle>
                    <DialogDescription>Schedule a new wake service.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit}>
                    <div className="grid gap-6 py-4">
                        {/* Beneficiary */}
                        <div className="grid gap-2">
                            <Label htmlFor="beneficiary_id">Beneficiary</Label>
                            <select
                                id="beneficiary_id"
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                value={data.beneficiary_id}
                                onChange={(e) => setData('beneficiary_id', e.target.value)}
                                required
                            >
                                <option value="">Select Beneficiary...</option>
                                {beneficiaries.map((b) => (
                                    <option key={b.id} value={b.id}>
                                        {b.name} ({b.relationship})
                                    </option>
                                ))}
                            </select>
                            {errors.beneficiary_id && (
                                <p className="text-sm text-destructive">{errors.beneficiary_id}</p>
                            )}
                        </div>

                        {/* Deceased Info */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="date_of_death">Date of Death</Label>
                                <Input
                                    id="date_of_death"
                                    type="date"
                                    value={data.date_of_death}
                                    onChange={(e) => setData('date_of_death', e.target.value)}
                                    required
                                />
                                {errors.date_of_death && (
                                    <p className="text-sm text-destructive">{errors.date_of_death}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="cause_of_death">Cause of Death (Optional)</Label>
                                <Input
                                    id="cause_of_death"
                                    type="text"
                                    value={data.cause_of_death}
                                    onChange={(e) => setData('cause_of_death', e.target.value)}
                                    placeholder="e.g., Natural causes"
                                />
                                {errors.cause_of_death && (
                                    <p className="text-sm text-destructive">{errors.cause_of_death}</p>
                                )}
                            </div>
                        </div>

                        {/* Room */}
                        <div className="grid gap-2">
                            <Label htmlFor="room_id">Wake Room</Label>
                            <select
                                id="room_id"
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                value={data.room_id}
                                onChange={(e) => setData('room_id', e.target.value)}
                                required
                            >
                                <option value="">Select room...</option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name} (Capacity: {room.capacity})
                                    </option>
                                ))}
                            </select>
                            {errors.room_id && (
                                <p className="text-sm text-destructive">{errors.room_id}</p>
                            )}
                        </div>

                        {/* Date Range */}
                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="date_start">Start Date</Label>
                                <Input
                                    id="date_start"
                                    type="date"
                                    value={data.date_start}
                                    onChange={(e) => setData('date_start', e.target.value)}
                                    required
                                />
                                {errors.date_start && (
                                    <p className="text-sm text-destructive">{errors.date_start}</p>
                                )}
                            </div>
                            <div className="grid gap-2">
                                <Label htmlFor="date_end">End Date</Label>
                                <Input
                                    id="date_end"
                                    type="date"
                                    value={data.date_end}
                                    onChange={(e) => setData('date_end', e.target.value)}
                                    required
                                />
                                {errors.date_end && (
                                    <p className="text-sm text-destructive">{errors.date_end}</p>
                                )}
                            </div>
                        </div>

                        {/* Package */}
                        <div className="grid gap-2">
                            <Label htmlFor="package_id">Wake Package</Label>
                            <select
                                id="package_id"
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                value={data.package_id}
                                onChange={(e) => handlePackageChange(e.target.value)}
                                required
                            >
                                <option value="">Select package...</option>
                                {packages.map((pkg) => (
                                    <option key={pkg.id} value={pkg.id}>
                                        {pkg.name} — ₱{parseFloat(pkg.base_price.toString()).toLocaleString()}
                                    </option>
                                ))}
                            </select>
                            {errors.package_id && (
                                <p className="text-sm text-destructive">{errors.package_id}</p>
                            )}
                            {selectedPackage && (
                                <div className="p-3 bg-muted rounded-md text-sm space-y-1">
                                    <p className="font-medium">{selectedPackage.name}</p>
                                    <p className="text-muted-foreground">{selectedPackage.description}</p>
                                    <p className="font-semibold">
                                        Base Price: ₱{parseFloat(selectedPackage.base_price.toString()).toLocaleString()}
                                    </p>
                                </div>
                            )}
                        </div>

                        {/* Notes */}
                        <div className="grid gap-2">
                            <Label htmlFor="notes">Notes (Optional)</Label>
                            <Textarea
                                id="notes"
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Special instructions or notes..."
                                rows={3}
                            />
                            {errors.notes && (
                                <p className="text-sm text-destructive">{errors.notes}</p>
                            )}
                        </div>

                        {/* Services */}
                        <div className="grid gap-3">
                            <div>
                                <Label>Services</Label>
                                <p className="text-sm text-muted-foreground">
                                    Services included in the selected package are checked by default.
                                </p>
                            </div>
                            <ScrollArea className="h-64 rounded-lg border bg-muted/50">
                            <div className="grid gap-3 p-4">
                                {services.map((service) => {
                                    const inPackage = selectedPackage?.services?.some((s) => s.id === service.id);
                                    return (
                                        <div
                                            key={service.id}
                                            className="flex items-start space-x-3 p-3 rounded-md bg-background border"
                                        >
                                            <Checkbox
                                                id={`service-${service.id}`}
                                                checked={selectedServiceIds.has(service.id)}
                                                onCheckedChange={() => toggleService(service.id)}
                                                className="mt-1"
                                            />
                                            <div className="flex-1">
                                                <label
                                                    htmlFor={`service-${service.id}`}
                                                    className="text-sm font-medium cursor-pointer flex items-center gap-2"
                                                >
                                                    {service.name}
                                                    {inPackage && (
                                                        <span className="text-xs px-2 py-0.5 bg-primary/10 text-primary rounded-full">
                                                            Included in package
                                                        </span>
                                                    )}
                                                </label>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {service.description}
                                                </p>
                                                <p className="text-sm font-semibold mt-1">
                                                    ₱{parseFloat(service.price.toString()).toLocaleString()}
                                                </p>
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                            </ScrollArea>
                            {errors.services && (
                                <p className="text-sm text-destructive">{errors.services}</p>
                            )}
                        </div>

                        {/* Inventory Items */}
                        {inventoryItems.length > 0 && (
                            <div className="grid gap-3">
                                <div>
                                    <Label>Inventory Items</Label>
                                    <p className="text-sm text-muted-foreground">
                                        Select items to include with this wake schedule.
                                    </p>
                                </div>
                                <ScrollArea className="h-56 rounded-lg border bg-muted/50">
                                <div className="grid gap-2 p-4">
                                    {inventoryItems.map((item) => {
                                        const quantity = selectedItems.get(item.id) ?? 0;
                                        const isSelected = quantity > 0;
                                        return (
                                            <div
                                                key={item.id}
                                                className="flex items-center gap-3 p-3 rounded-md bg-background border"
                                            >
                                                <Checkbox
                                                    id={`item-${item.id}`}
                                                    checked={isSelected}
                                                    onCheckedChange={(checked) =>
                                                        setSelectedItems((prev) => {
                                                            const next = new Map(prev);
                                                            checked ? next.set(item.id, 1) : next.delete(item.id);
                                                            return next;
                                                        })
                                                    }
                                                />
                                                <div className="flex-1 min-w-0">
                                                    <label
                                                        htmlFor={`item-${item.id}`}
                                                        className="text-sm font-medium cursor-pointer"
                                                    >
                                                        {item.name}
                                                    </label>
                                                    <p className="text-sm text-muted-foreground">
                                                        ₱{parseFloat(item.price.toString()).toLocaleString()} /{' '}
                                                        {item.unit} · {item.stock} in stock
                                                    </p>
                                                </div>
                                                {isSelected && (
                                                    <Input
                                                        type="number"
                                                        min={1}
                                                        max={item.stock}
                                                        value={quantity}
                                                        onChange={(e) =>
                                                            setSelectedItems((prev) => {
                                                                const next = new Map(prev);
                                                                next.set(
                                                                    item.id,
                                                                    Math.max(1, Math.min(item.stock, Number(e.target.value))),
                                                                );
                                                                return next;
                                                            })
                                                        }
                                                        className="w-20 text-sm"
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                </ScrollArea>
                                {errors.inventory_items && (
                                    <p className="text-sm text-destructive">{errors.inventory_items}</p>
                                )}
                            </div>
                        )}

                        {/* Insurance Claim */}
                        <div className="flex items-center space-x-2">
                            <Checkbox
                                id="create_claim"
                                checked={data.create_claim}
                                onCheckedChange={(checked) => setData('create_claim', !!checked)}
                            />
                            <Label htmlFor="create_claim" className="cursor-pointer">
                                Create insurance claim for this wake schedule
                            </Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Creating...' : 'Create Schedule'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
