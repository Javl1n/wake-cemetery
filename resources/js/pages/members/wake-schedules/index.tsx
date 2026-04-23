import { useState } from 'react';
import { format, parseISO } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Drawer,
    DrawerContent,
    DrawerDescription,
    DrawerHeader,
    DrawerTitle,
} from '@/components/ui/drawer';
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import MemberLayout from '@/layouts/member-layout';
import OrderItemsDialog from '@/components/wake/member/order-items-dialog';
import ReservePlotDialog from '@/components/wake/member/reserve-plot-dialog';
import { Calendar, Package, ShoppingCart, ShieldCheck, Users, BookHeart, QrCode, ExternalLink, Copy, Check, MapPin } from 'lucide-react';
import { Link } from '@inertiajs/react';
import { QRCodeSVG } from 'qrcode.react';
import type { WakeSchedule, InventoryItem } from '@/types/wake';

interface AvailablePlot {
    id: number;
    plot_number: string;
}

interface SectionWithPlots {
    id: number;
    name: string;
    code: string;
    color: string;
    plots: AvailablePlot[];
}

interface Props {
    schedules: WakeSchedule[];
    inventoryItems: InventoryItem[];
    availableSections: SectionWithPlots[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    confirmed: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    in_progress: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    completed: 'bg-green-500/10 text-green-700 border-green-500/20',
    cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

const statusLabels: Record<string, string> = {
    pending: 'Pending',
    confirmed: 'Confirmed',
    in_progress: 'In Progress',
    completed: 'Completed',
    cancelled: 'Cancelled',
};

const claimStatusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-700',
    approved: 'bg-green-500/10 text-green-700',
    rejected: 'bg-red-500/10 text-red-700',
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

export default function MemberWakeSchedulesIndex({ schedules, inventoryItems, availableSections }: Props) {
    const [selected, setSelected] = useState<WakeSchedule | null>(null);
    const [orderOpen, setOrderOpen] = useState(false);
    const [reservePlotOpen, setReservePlotOpen] = useState(false);
    const [qrOpen, setQrOpen] = useState(false);
    const [copied, setCopied] = useState(false);

    const tributeUrl = selected?.deceased.obituary
        ? `${window.location.origin}/tribute/${selected.deceased.obituary.tribute_token}`
        : null;

    const handleCopy = () => {
        if (!tributeUrl) return;
        navigator.clipboard.writeText(tributeUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
    };

    const canOrder = selected
        ? ['confirmed', 'in_progress'].includes(selected.status)
        : false;

    const canReservePlot = selected
        ? ['confirmed', 'in_progress'].includes(selected.status)
        : false;

    const hasReservedPlot = selected ? !!selected.deceased.cemetery_plot : false;

    return (
        <MemberLayout title="Wake Schedules">
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">Wake Schedules</h1>
                <p className="text-muted-foreground mt-1">
                    View and manage wake arrangements for your loved ones.
                </p>
            </div>

            {schedules.length === 0 ? (
                <Card>
                    <CardContent className="py-16 text-center">
                        <Calendar className="h-12 w-12 text-muted-foreground mx-auto mb-4" />
                        <p className="text-lg font-medium">No wake schedules found</p>
                        <p className="text-sm text-muted-foreground mt-1">
                            Wake arrangements will appear here once they are created by our staff.
                        </p>
                    </CardContent>
                </Card>
            ) : (
                <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
                    {schedules.map((schedule) => (
                        <Card
                            key={schedule.id}
                            className={`cursor-pointer hover:shadow-md transition-shadow ${selected?.id === schedule.id ? 'ring-2 ring-primary' : ''}`}
                            onClick={() => setSelected(schedule)}
                        >
                            <CardContent className="p-4 space-y-3">
                                <div className="flex items-start justify-between gap-2">
                                    <div className="min-w-0">
                                        <p className="font-semibold truncate">{getDeceasedName(schedule)}</p>
                                        <p className="text-sm text-muted-foreground">{schedule.room.name}</p>
                                    </div>
                                    <Badge className={statusColors[schedule.status]} variant="outline">
                                        {statusLabels[schedule.status]}
                                    </Badge>
                                </div>

                                <div className="space-y-1 text-sm">
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Calendar className="h-3.5 w-3.5" />
                                        <span>
                                            {format(parseISO(schedule.date_start), 'MMM dd')} –{' '}
                                            {format(parseISO(schedule.date_end), 'MMM dd, yyyy')}
                                        </span>
                                    </div>
                                    <div className="flex items-center gap-2 text-muted-foreground">
                                        <Package className="h-3.5 w-3.5" />
                                        <span className="truncate">{schedule.package.name}</span>
                                    </div>
                                </div>

                                <div className="flex justify-between items-center border-t pt-2">
                                    <span className="text-xs text-muted-foreground">Total</span>
                                    <span className="font-bold">
                                        ₱{parseFloat(schedule.total_amount.toString()).toLocaleString()}
                                    </span>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </div>
            )}

            {/* Detail Drawer */}
            <Drawer open={!!selected} onOpenChange={(open) => !open && setSelected(null)} direction="right">
                <DrawerContent className="sm:max-w-lg p-0 flex flex-col h-full">
                    {selected && (
                        <>
                            <DrawerHeader className="p-6 pb-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0">
                                        <DrawerTitle className="text-lg truncate">
                                            {getDeceasedName(selected)}
                                        </DrawerTitle>
                                        <DrawerDescription className="mt-1">{selected.room.name}</DrawerDescription>
                                    </div>
                                    <Badge className={statusColors[selected.status]} variant="outline">
                                        {statusLabels[selected.status]}
                                    </Badge>
                                </div>
                            </DrawerHeader>

                            <ScrollArea className="flex-1 min-h-0">
                                <div className="px-6 pb-6 space-y-6">
                                    {/* Deceased Info */}
                                    <section className="space-y-2">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                            <Users className="h-3.5 w-3.5" />
                                            Deceased
                                        </h3>
                                        <div className="space-y-1.5">
                                            <InfoRow
                                                label="Date of Death"
                                                value={format(parseISO(selected.deceased.date_of_death), 'MMMM dd, yyyy')}
                                            />
                                            {selected.deceased.cause_of_death && (
                                                <InfoRow label="Cause of Death" value={selected.deceased.cause_of_death} />
                                            )}
                                            {selected.deceased.beneficiary && (
                                                <InfoRow
                                                    label="Beneficiary"
                                                    value={`${selected.deceased.beneficiary.name} (${selected.deceased.beneficiary.relationship})`}
                                                />
                                            )}
                                        </div>
                                    </section>

                                    <Separator />

                                    {/* Schedule Info */}
                                    <section className="space-y-2">
                                        <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                            <Calendar className="h-3.5 w-3.5" />
                                            Schedule Details
                                        </h3>
                                        <div className="space-y-1.5">
                                            <InfoRow label="Room" value={selected.room.name} />
                                            <InfoRow
                                                label="Dates"
                                                value={`${format(parseISO(selected.date_start), 'MMM dd')} – ${format(parseISO(selected.date_end), 'MMM dd, yyyy')}`}
                                            />
                                            <InfoRow label="Package" value={selected.package.name} />
                                            <InfoRow
                                                label="Base Price"
                                                value={`₱${parseFloat(selected.package.base_price.toString()).toLocaleString()}`}
                                            />
                                            <InfoRow
                                                label="Total Amount"
                                                value={
                                                    <span className="text-base font-bold">
                                                        ₱{parseFloat(selected.total_amount.toString()).toLocaleString()}
                                                    </span>
                                                }
                                            />
                                        </div>
                                        {selected.notes && (
                                            <p className="text-sm text-muted-foreground bg-muted/50 rounded-md p-3 mt-2">
                                                {selected.notes}
                                            </p>
                                        )}
                                    </section>

                                    {/* Services */}
                                    {selected.services && selected.services.length > 0 && (
                                        <>
                                            <Separator />
                                            <section className="space-y-2">
                                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                                                    Services ({selected.services.filter((s) => s.pivot?.status === 'completed').length}/{selected.services.length} completed)
                                                </h3>
                                                <div className="space-y-1.5">
                                                    {selected.services.map((service) => {
                                                        const isCompleted = service.pivot?.status === 'completed';
                                                        return (
                                                            <div
                                                                key={service.id}
                                                                className="flex items-center justify-between p-2 rounded-md border bg-background text-sm"
                                                            >
                                                                <span className={isCompleted ? 'line-through text-muted-foreground' : ''}>
                                                                    {service.name}
                                                                </span>
                                                                <div className="flex items-center gap-2">
                                                                    <span className="font-medium">
                                                                        ₱{parseFloat((service.pivot?.fee ?? service.price).toString()).toLocaleString()}
                                                                    </span>
                                                                    {isCompleted && (
                                                                        <Badge variant="outline" className="text-xs bg-green-500/10 text-green-700 border-green-500/20">
                                                                            Done
                                                                        </Badge>
                                                                    )}
                                                                </div>
                                                            </div>
                                                        );
                                                    })}
                                                </div>
                                            </section>
                                        </>
                                    )}

                                    {/* Inventory Orders */}
                                    {selected.orders && selected.orders.length > 0 && (
                                        <>
                                            <Separator />
                                            <section className="space-y-2">
                                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                                    <ShoppingCart className="h-3.5 w-3.5" />
                                                    Item Orders
                                                </h3>
                                                {selected.orders.map((order) => (
                                                    <div key={order.id} className="rounded-md border p-3 space-y-2">
                                                        <div className="flex items-center justify-between text-xs text-muted-foreground">
                                                            <span>Order #{order.id}</span>
                                                            <Badge
                                                                variant="outline"
                                                                className={
                                                                    order.status === 'completed'
                                                                        ? 'bg-green-500/10 text-green-700 border-green-500/20'
                                                                        : 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20'
                                                                }
                                                            >
                                                                {order.status}
                                                            </Badge>
                                                        </div>
                                                        <div className="space-y-1">
                                                            {order.items.map((item) => (
                                                                <div key={item.id} className="flex justify-between text-sm">
                                                                    <span>
                                                                        {item.name}
                                                                        <span className="text-muted-foreground ml-1">× {item.pivot?.quantity ?? 1}</span>
                                                                    </span>
                                                                    <span className="font-medium">
                                                                        ₱{((item.pivot?.unit_price ?? item.price) * (item.pivot?.quantity ?? 1)).toLocaleString()}
                                                                    </span>
                                                                </div>
                                                            ))}
                                                        </div>
                                                        <div className="flex justify-between text-sm border-t pt-2">
                                                            <span className="text-muted-foreground">Subtotal</span>
                                                            <span className="font-bold">₱{parseFloat(order.amount.toString()).toLocaleString()}</span>
                                                        </div>
                                                    </div>
                                                ))}
                                            </section>
                                        </>
                                    )}

                                    {/* Insurance Claim */}
                                    {selected.claims && (
                                        <>
                                            <Separator />
                                            <section className="space-y-2">
                                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                                    <ShieldCheck className="h-3.5 w-3.5" />
                                                    Insurance Claim
                                                </h3>
                                                <div className="space-y-1.5">
                                                    <div className="flex justify-between text-sm">
                                                        <span className="text-muted-foreground">Status</span>
                                                        <span className={`text-xs px-2 py-0.5 rounded-full font-medium ${claimStatusColors[selected.claims.status] ?? ''}`}>
                                                            {selected.claims.status}
                                                        </span>
                                                    </div>
                                                    {selected.claims.approved_amount && (
                                                        <InfoRow
                                                            label="Approved Amount"
                                                            value={`₱${parseFloat(selected.claims.approved_amount.toString()).toLocaleString()}`}
                                                        />
                                                    )}
                                                </div>
                                            </section>
                                        </>
                                    )}

                                    {/* Cemetery Plot */}
                                    {selected.deceased.cemetery_plot && (
                                        <>
                                            <Separator />
                                            <section className="space-y-2">
                                                <h3 className="text-xs font-semibold uppercase tracking-wider text-muted-foreground flex items-center gap-1.5">
                                                    <MapPin className="h-3.5 w-3.5" />
                                                    Cemetery Plot
                                                </h3>
                                                <div className="space-y-1.5">
                                                    <InfoRow label="Plot Number" value={selected.deceased.cemetery_plot.plot_number} />
                                                    <InfoRow label="Section" value={selected.deceased.cemetery_plot.section.name} />
                                                    <InfoRow
                                                        label="Status"
                                                        value={
                                                            <Badge
                                                                variant="outline"
                                                                className={selected.deceased.cemetery_plot.status === 'reserved'
                                                                    ? 'bg-blue-500/10 text-blue-700 border-blue-500/20'
                                                                    : 'bg-green-500/10 text-green-700 border-green-500/20'
                                                                }
                                                            >
                                                                {selected.deceased.cemetery_plot.status === 'reserved' ? 'Reserved' : 'Occupied'}
                                                            </Badge>
                                                        }
                                                    />
                                                </div>
                                            </section>
                                        </>
                                    )}
                                </div>
                            </ScrollArea>

                            {/* Footer */}
                            <div className="p-6 border-t space-y-3">
                                {selected.deceased.obituary ? (
                                    <div className="grid grid-cols-3 gap-2">
                                        <a
                                            href={`/obituary/${selected.deceased.obituary.tribute_token}`}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="contents"
                                        >
                                            <Button variant="outline" className="w-full">
                                                <ExternalLink className="h-4 w-4 mr-2" />
                                                Obituary
                                            </Button>
                                        </a>
                                        <a
                                            href={tributeUrl!}
                                            target="_blank"
                                            rel="noopener noreferrer"
                                            className="contents"
                                        >
                                            <Button variant="outline" className="w-full">
                                                <BookHeart className="h-4 w-4 mr-2" />
                                                Tribute
                                            </Button>
                                        </a>
                                        <Button variant="outline" onClick={() => setQrOpen(true)}>
                                            <QrCode className="h-4 w-4 mr-2" />
                                            QR
                                        </Button>
                                    </div>
                                ) : null}

                                <Link href={`/member/deceased/${selected.deceased.id}/obituary/setup`}>
                                    <Button variant={selected.deceased.obituary ? 'ghost' : 'outline'} className="w-full">
                                        <BookHeart className="h-4 w-4 mr-2" />
                                        {selected.deceased.obituary ? 'Manage Obituary & Tribute' : 'Create Obituary & Tribute'}
                                    </Button>
                                </Link>

                                {canReservePlot && (
                                    <Button
                                        variant="outline"
                                        className={`w-full ${hasReservedPlot ? 'border-green-500/40 bg-green-500/5 text-green-700 hover:bg-green-500/10 hover:text-green-700' : ''}`}
                                        onClick={() => !hasReservedPlot && setReservePlotOpen(true)}
                                        disabled={hasReservedPlot}
                                    >
                                        {hasReservedPlot ? (
                                            <>
                                                <Check className="h-4 w-4 mr-2" />
                                                Cemetery Lot Reserved
                                            </>
                                        ) : (
                                            <>
                                                <MapPin className="h-4 w-4 mr-2" />
                                                Reserve Cemetery Lot
                                            </>
                                        )}
                                    </Button>
                                )}

                                {canOrder && (
                                    <>
                                        <Button className="w-full" onClick={() => setOrderOpen(true)}>
                                            <ShoppingCart className="h-4 w-4 mr-2" />
                                            Order Additional Items
                                        </Button>
                                        <p className="text-xs text-muted-foreground text-center">
                                            Orders are reviewed by our staff before processing.
                                        </p>
                                    </>
                                )}
                                {!canOrder && selected.status !== 'cancelled' && selected.status !== 'completed' && (
                                    <p className="text-sm text-center text-muted-foreground">
                                        Item ordering is available once the schedule is confirmed.
                                    </p>
                                )}
                            </div>
                        </>
                    )}
                </DrawerContent>
            </Drawer>

            {/* Order Dialog */}
            {selected && (
                <OrderItemsDialog
                    open={orderOpen}
                    onClose={() => setOrderOpen(false)}
                    schedule={selected}
                    inventoryItems={inventoryItems}
                />
            )}

            {/* Reserve Plot Dialog */}
            {selected && (
                <ReservePlotDialog
                    open={reservePlotOpen}
                    onClose={() => setReservePlotOpen(false)}
                    schedule={selected}
                    availableSections={availableSections}
                />
            )}

            {/* QR Code Dialog */}
            <Dialog open={qrOpen} onOpenChange={setQrOpen}>
                <DialogContent className="w-auto max-w-[90vw] text-center">
                    <DialogHeader>
                        <DialogTitle>Share Tribute Page</DialogTitle>
                    </DialogHeader>
                    <div className="flex flex-col items-center gap-4 py-2">
                        {tributeUrl && (
                            <div className="rounded-xl border p-4 bg-white">
                                <QRCodeSVG value={tributeUrl} size={220} />
                            </div>
                        )}
                        <p className="text-xs text-muted-foreground">
                            Scan to open the tribute page and leave a memory.
                        </p>
                        <div className="w-full flex items-center gap-2 rounded-lg border px-3 py-2 bg-muted/40 overflow-hidden">
                            <span className="flex-1 text-xs text-muted-foreground truncate min-w-0">{tributeUrl}</span>
                            <Button size="sm" variant="ghost" className="shrink-0 h-6 px-2" onClick={handleCopy}>
                                {copied
                                    ? <Check className="h-3.5 w-3.5 text-green-500" />
                                    : <Copy className="h-3.5 w-3.5" />
                                }
                            </Button>
                        </div>
                    </div>
                </DialogContent>
            </Dialog>
        </MemberLayout>
    );
}
