import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState } from 'react';
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
import type { WakeSchedule, WakeRoom, WakePackage, WakeService, InventoryItem } from '@/types/wake';

interface Deceased {
    id: number;
    date_of_death: string;
    member?: {
        id: number;
        user: {
            name: string;
        };
    };
    beneficiary?: {
        id: number;
        name: string;
    };
}

interface ScheduleFormDialogProps {
    schedule?: WakeSchedule;
    open: boolean;
    onClose: () => void;
    rooms: WakeRoom[];
    packages: WakePackage[];
    services: WakeService[];
    inventoryItems: InventoryItem[];
    deceaseds: Deceased[];
}

export default function ScheduleFormDialog({
    schedule,
    open,
    onClose,
    rooms,
    packages,
    services,
    inventoryItems,
    deceaseds,
}: ScheduleFormDialogProps) {
    const { data, setData, post, put, processing, errors, reset } = useForm({
        deceased_id: schedule?.deceased_id || '',
        room_id: schedule?.room_id || '',
        package_id: schedule?.package_id || '',
        date_start: schedule?.date_start || '',
        date_end: schedule?.date_end || '',
        notes: schedule?.notes || '',
        services: [] as { id: number; fee?: number }[],
        inventory_items: [] as { id: number; quantity: number; notes?: string }[],
        create_claim: false,
        subscription_id: '',
    });

    const [selectedPackage, setSelectedPackage] = useState<WakePackage | null>(
        schedule ? packages.find((p) => p.id === schedule.package_id) || null : null
    );

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (schedule) {
            put(`/wake-schedules/${schedule.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post('/wake-schedules', {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    const handlePackageChange = (packageId: string) => {
        setData('package_id', packageId);
        const pkg = packages.find((p) => p.id === parseInt(packageId));
        setSelectedPackage(pkg || null);
    };

    const getDeceasedName = (deceased: Deceased) => {
        if (deceased.member) {
            return deceased.member.user.name;
        }
        if (deceased.beneficiary) {
            return deceased.beneficiary.name;
        }
        return `Deceased #${deceased.id}`;
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[800px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {schedule ? 'Edit Wake Schedule' : 'Create Wake Schedule'}
                    </DialogTitle>
                    <DialogDescription>
                        {schedule
                            ? 'Update the wake schedule details below.'
                            : 'Schedule a new wake service.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit}>
                    <div className="grid gap-6 py-4">
                        {/* Deceased Selection */}
                        <div className="grid gap-2">
                            <Label htmlFor="deceased_id">Deceased</Label>
                            <select
                                id="deceased_id"
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                value={data.deceased_id}
                                onChange={(e) => setData('deceased_id', e.target.value)}
                                required
                            >
                                <option value="">Select deceased...</option>
                                {deceaseds.map((deceased) => (
                                    <option key={deceased.id} value={deceased.id}>
                                        {getDeceasedName(deceased)} (†{' '}
                                        {new Date(deceased.date_of_death).toLocaleDateString()})
                                    </option>
                                ))}
                            </select>
                            {errors.deceased_id && (
                                <p className="text-sm text-destructive">{errors.deceased_id}</p>
                            )}
                        </div>

                        {/* Room Selection */}
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

                        {/* Package Selection */}
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
                                        {pkg.name} - ₱{parseFloat(pkg.base_price.toString()).toLocaleString()}
                                    </option>
                                ))}
                            </select>
                            {errors.package_id && (
                                <p className="text-sm text-destructive">{errors.package_id}</p>
                            )}

                            {selectedPackage && (
                                <div className="mt-2 p-3 bg-muted rounded-md">
                                    <p className="text-sm font-medium">{selectedPackage.name}</p>
                                    <p className="text-sm text-muted-foreground">
                                        {selectedPackage.description}
                                    </p>
                                    <p className="text-sm font-semibold mt-2">
                                        Base Price: ₱
                                        {parseFloat(selectedPackage.base_price.toString()).toLocaleString()}
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

                        {/* Additional Services - Simplified */}
                        <div className="grid gap-2">
                            <Label>Additional Services (Optional)</Label>
                            <p className="text-sm text-muted-foreground">
                                Additional services beyond the package can be added here.
                            </p>
                            {/* Simplified - will be enhanced in future iteration */}
                        </div>

                        {/* Insurance Claim */}
                        <div className="flex items-center space-x-2">
                            <input
                                type="checkbox"
                                id="create_claim"
                                checked={data.create_claim}
                                onChange={(e) => setData('create_claim', e.target.checked)}
                                className="rounded border-gray-300"
                            />
                            <Label htmlFor="create_claim" className="cursor-pointer">
                                Create insurance claim for this wake schedule
                            </Label>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing
                                ? 'Saving...'
                                : schedule
                                  ? 'Update Schedule'
                                  : 'Create Schedule'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
