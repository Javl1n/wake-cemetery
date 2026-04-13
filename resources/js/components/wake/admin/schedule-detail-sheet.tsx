import { router } from '@inertiajs/react';
import { format, parseISO } from 'date-fns';
import {
    Calendar,
    CheckCircle,
    Edit,
    Package,
    PlayCircle,
    ShieldCheck,
    ThumbsUp,
    XCircle,
} from 'lucide-react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Checkbox } from '@/components/ui/checkbox';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Separator } from '@/components/ui/separator';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerFooter,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import type { WakeSchedule } from '@/types/wake';

interface ScheduleDetailSheetProps {
    schedule: WakeSchedule | null;
    onClose: () => void;
    onEdit: () => void;
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    confirmed: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    in_progress: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    completed: 'bg-green-500/10 text-green-700 border-green-500/20',
    cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const serviceStatusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-700',
    completed: 'bg-green-500/10 text-green-700',
    cancelled: 'bg-gray-500/10 text-gray-500',
};

const claimStatusColors: Record<string, string> = {
    filed: 'bg-blue-500/10 text-blue-700',
    pending: 'bg-yellow-500/10 text-yellow-700',
    approved: 'bg-green-500/10 text-green-700',
    rejected: 'bg-red-500/10 text-red-700',
    paid: 'bg-emerald-500/10 text-emerald-700',
};

function getDeceasedName(schedule: WakeSchedule): string {
    if (schedule.deceased.member) return schedule.deceased.member.user.name;
    if (schedule.deceased.beneficiary) return schedule.deceased.beneficiary.name;
    return 'Unknown';
}

function InfoRow({ label, value }: { label: string; value: React.ReactNode }) {
    return (
        <div className="flex justify-between gap-4 text-sm">
            <span className="text-muted-foreground shrink-0">{label}</span>
            <span className="font-medium text-right">{value}</span>
        </div>
    );
}

export default function ScheduleDetailSheet({ schedule, onClose, onEdit }: ScheduleDetailSheetProps) {
    if (!schedule) return null;

    const deceasedName = getDeceasedName(schedule);
    const canEdit = schedule.status !== 'completed' && schedule.status !== 'cancelled';

    const handleStatusUpdate = (status: string) => {
        router.put(`/wake-schedules/${schedule.id}`, { status });
    };

    const handleComplete = () => {
        if (confirm('Mark this wake schedule as completed and assign cemetery plot?')) {
            router.post(`/wake-schedules/${schedule.id}/complete`);
        }
    };

    const handleCancel = () => {
        if (confirm('Are you sure you want to cancel this wake schedule?')) {
            router.delete(`/wake-schedules/${schedule.id}`);
        }
    };

    return (
        <Drawer open={!!schedule} onOpenChange={(open) => !open && onClose()} direction="right">
            <DrawerContent className="sm:max-w-lg p-0 flex flex-col h-full">
                <DrawerHeader className="p-6 pb-4">
                    <div className="flex items-start justify-between gap-3">
                        <div className="flex-1 min-w-0">
                            <DrawerTitle className="text-lg truncate">{deceasedName}</DrawerTitle>
                            <DrawerDescription className="mt-1">{schedule.room.name}</DrawerDescription>
                        </div>
                        <Badge className={statusColors[schedule.status]} variant="outline">
                            {schedule.status.replace('_', ' ')}
                        </Badge>
                    </div>
                </DrawerHeader>

                <ScrollArea className="flex-1 min-h-0">
                    <div className="px-6 pb-6 space-y-6">
                        {/* Deceased Info */}
                        <section className="space-y-2">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Deceased
                            </h3>
                            <div className="space-y-1.5">
                                <InfoRow
                                    label="Date of Death"
                                    value={format(parseISO(schedule.deceased.date_of_death), 'MMM dd, yyyy')}
                                />
                                {schedule.deceased.cause_of_death && (
                                    <InfoRow label="Cause" value={schedule.deceased.cause_of_death} />
                                )}
                                {schedule.deceased.beneficiary && (
                                    <InfoRow
                                        label="Filed by"
                                        value={`${schedule.deceased.beneficiary.name} (${schedule.deceased.beneficiary.relationship})`}
                                    />
                                )}
                            </div>
                        </section>

                        <Separator />

                        {/* Wake Info */}
                        <section className="space-y-2">
                            <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                Schedule
                            </h3>
                            <div className="space-y-1.5">
                                <InfoRow label="Room" value={schedule.room.name} />
                                <InfoRow
                                    label="Dates"
                                    value={
                                        <span className="flex items-center gap-1">
                                            <Calendar className="h-3.5 w-3.5 text-muted-foreground" />
                                            {format(parseISO(schedule.date_start), 'MMM dd')} –{' '}
                                            {format(parseISO(schedule.date_end), 'MMM dd, yyyy')}
                                        </span>
                                    }
                                />
                                <InfoRow
                                    label="Package"
                                    value={
                                        <span className="flex items-center gap-1">
                                            <Package className="h-3.5 w-3.5 text-muted-foreground" />
                                            {schedule.package.name}
                                        </span>
                                    }
                                />
                                <InfoRow
                                    label="Base Price"
                                    value={`₱${parseFloat(schedule.package.base_price.toString()).toLocaleString()}`}
                                />
                                <InfoRow
                                    label="Total"
                                    value={
                                        <span className="text-base font-bold">
                                            ₱{parseFloat(schedule.total_amount.toString()).toLocaleString()}
                                        </span>
                                    }
                                />
                            </div>
                            {schedule.notes && (
                                <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3 mt-2">
                                    {schedule.notes}
                                </p>
                            )}
                        </section>

                        {/* Services */}
                        {schedule.services && schedule.services.length > 0 && (
                            <>
                                <Separator />
                                <section className="space-y-2">
                                    <div className="flex items-center justify-between">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                            Services ({schedule.services.filter((s) => s.pivot?.status === 'completed').length}/{schedule.services.length})
                                        </h3>
                                    </div>
                                    <div className="space-y-1.5">
                                        {schedule.services.map((service) => {
                                            const isCompleted = service.pivot?.status === 'completed';
                                            return (
                                                <div
                                                    key={service.id}
                                                    className="flex items-center gap-3 p-2 rounded-md border bg-background"
                                                >
                                                    <Checkbox
                                                        checked={isCompleted}
                                                        onCheckedChange={() =>
                                                            router.patch(
                                                                `/wake-schedules/${schedule.id}/services/${service.id}/complete`,
                                                                {},
                                                                { preserveState: true, preserveScroll: true, only: ['schedules'] },
                                                            )
                                                        }
                                                    />
                                                    <span className={`flex-1 text-sm ${isCompleted ? 'line-through text-muted-foreground' : ''}`}>
                                                        {service.name}
                                                    </span>
                                                    <span className="text-sm font-medium">
                                                        ₱{parseFloat((service.pivot?.fee ?? service.price).toString()).toLocaleString()}
                                                    </span>
                                                </div>
                                            );
                                        })}
                                    </div>
                                </section>
                            </>
                        )}

                        {/* Inventory Orders */}
                        {schedule.orders && schedule.orders.length > 0 && (
                            <>
                                <Separator />
                                <section className="space-y-2">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Inventory Orders
                                    </h3>
                                    {schedule.orders.map((order) => (
                                        <div key={order.id} className="space-y-1">
                                            {order.items.map((item) => (
                                                <div
                                                    key={item.id}
                                                    className="flex items-center justify-between text-sm"
                                                >
                                                    <span>
                                                        {item.name}
                                                        <span className="text-muted-foreground ml-1">
                                                            × {item.pivot?.quantity ?? 1}
                                                        </span>
                                                    </span>
                                                    <span className="font-medium">
                                                        ₱
                                                        {parseFloat(
                                                            (
                                                                (item.pivot?.unit_price ?? item.price) *
                                                                (item.pivot?.quantity ?? 1)
                                                            ).toString(),
                                                        ).toLocaleString()}
                                                    </span>
                                                </div>
                                            ))}
                                        </div>
                                    ))}
                                </section>
                            </>
                        )}

                        {/* Insurance Claim */}
                        {schedule.claims && (
                            <>
                                <Separator />
                                <section className="space-y-2">
                                    <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                        Insurance Claim
                                    </h3>
                                    <div className="flex items-center justify-between text-sm">
                                        <span className="text-muted-foreground">Status</span>
                                        <span
                                            className={`text-xs px-2 py-0.5 rounded-full font-medium ${claimStatusColors[schedule.claims.status] ?? ''}`}
                                        >
                                            <ShieldCheck className="inline h-3 w-3 mr-1" />
                                            {schedule.claims.status}
                                        </span>
                                    </div>
                                    {schedule.claims.approved_amount && (
                                        <InfoRow
                                            label="Approved Amount"
                                            value={`₱${parseFloat(schedule.claims.approved_amount.toString()).toLocaleString()}`}
                                        />
                                    )}
                                </section>
                            </>
                        )}
                    </div>
                </ScrollArea>

                <DrawerFooter className="border-t">
                    {/* Status transition buttons */}
                    <div className="flex gap-2">
                        {schedule.status === 'pending' && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleStatusUpdate('confirmed')}
                            >
                                <ThumbsUp className="h-4 w-4 mr-1" />
                                Confirm
                            </Button>
                        )}
                        {schedule.status === 'confirmed' && (
                            <Button
                                size="sm"
                                variant="outline"
                                className="flex-1"
                                onClick={() => handleStatusUpdate('in_progress')}
                            >
                                <PlayCircle className="h-4 w-4 mr-1" />
                                Start Wake
                            </Button>
                        )}
                        {schedule.status === 'in_progress' && (
                            <Button
                                size="sm"
                                variant="default"
                                className="flex-1"
                                onClick={handleComplete}
                            >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Complete
                            </Button>
                        )}
                        {canEdit && (
                            <Button
                                size="sm"
                                variant="destructive"
                                className="flex-1"
                                onClick={handleCancel}
                            >
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancel
                            </Button>
                        )}
                    </div>

                    {/* Edit button */}
                    {canEdit && (
                        <Button size="sm" variant="outline" className="w-full" onClick={onEdit}>
                            <Edit className="h-4 w-4 mr-1" />
                            Edit Schedule
                        </Button>
                    )}
                </DrawerFooter>
            </DrawerContent>
        </Drawer>
    );
}
