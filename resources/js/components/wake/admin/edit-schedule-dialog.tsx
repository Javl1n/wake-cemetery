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
import type { WakeSchedule, WakePackage, WakeRoom, WakeService } from '@/types/wake';

interface Props {
    schedule: WakeSchedule;
    open: boolean;
    onClose: () => void;
    rooms: WakeRoom[];
    packages: WakePackage[];
    services: WakeService[];
}

export default function EditScheduleDialog({ schedule, open, onClose, rooms, packages, services }: Props) {
    const toDateInput = (value: string) => value?.slice(0, 10) ?? '';

    const { data, setData, put, processing, errors, reset } = useForm({
        room_id: schedule.room_id,
        package_id: schedule.package_id,
        date_start: toDateInput(schedule.date_start),
        date_end: toDateInput(schedule.date_end),
        notes: schedule.notes ?? '',
        status: schedule.status,
        services: [] as { id: number; fee?: number; status?: string }[],
    });

    const [selectedPackage, setSelectedPackage] = useState<WakePackage | null>(
        packages.find((p) => p.id === schedule.package_id) || null,
    );

    const [selectedServiceIds, setSelectedServiceIds] = useState<Set<number>>(
        new Set(schedule.services?.map((s) => s.id) ?? []),
    );

    // Re-sync when schedule changes (different record opened)
    useEffect(() => {
        setData({
            room_id: schedule.room_id,
            package_id: schedule.package_id,
            date_start: toDateInput(schedule.date_start),
            date_end: toDateInput(schedule.date_end),
            notes: schedule.notes ?? '',
            status: schedule.status,
            services: [],
        });
        setSelectedPackage(packages.find((p) => p.id === schedule.package_id) || null);
        setSelectedServiceIds(new Set(schedule.services?.map((s) => s.id) ?? []));
    }, [schedule.id]);

    // Sync all selected services (with existing fee/status) to form data
    useEffect(() => {
        setData(
            'services',
            Array.from(selectedServiceIds).map((serviceId) => {
                const existing = schedule.services?.find((s) => s.id === serviceId);
                const service = services.find((s) => s.id === serviceId);
                return {
                    id: serviceId,
                    fee: existing?.pivot?.fee ?? service?.price,
                    status: existing?.pivot?.status ?? 'pending',
                };
            }),
        );
    }, [selectedServiceIds]);

    const handlePackageChange = (packageId: string) => {
        const id = parseInt(packageId);
        setData('package_id', id);
        setSelectedPackage(packages.find((p) => p.id === id) || null);
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
        put(`/wake-schedules/${schedule.id}`, {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-200 max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>Edit Wake Schedule</DialogTitle>
                    <DialogDescription>Update the wake schedule details below.</DialogDescription>
                </DialogHeader>

                <form onSubmit={submit}>
                    <div className="grid gap-6 py-4">
                        {/* Room */}
                        <div className="grid gap-2">
                            <Label htmlFor="room_id">Wake Room</Label>
                            <select
                                id="room_id"
                                className="w-full rounded-md border border-input bg-background px-3 py-2"
                                value={data.room_id}
                                onChange={(e) => setData('room_id', parseInt(e.target.value))}
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

                        {/* Status */}
                        <div className="grid gap-2">
                            <Label htmlFor="status">Status</Label>
                            <select
                                id="status"
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={data.status}
                                onChange={(e) => setData('status', e.target.value)}
                            >
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
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
                                    const existing = schedule.services?.find((s) => s.id === service.id);
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
                                                    {existing?.pivot?.status === 'completed' && (
                                                        <span className="text-xs px-2 py-0.5 bg-green-500/10 text-green-700 rounded-full">
                                                            Completed
                                                        </span>
                                                    )}
                                                </label>
                                                <p className="text-sm text-muted-foreground mt-1">
                                                    {service.description}
                                                </p>
                                                <p className="text-sm font-semibold mt-1">
                                                    ₱{parseFloat((existing?.pivot?.fee ?? service.price).toString()).toLocaleString()}
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
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Update Schedule'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
