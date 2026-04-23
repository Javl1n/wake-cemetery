import { Head } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import {
    Table,
    TableBody,
    TableCell,
    TableHead,
    TableHeader,
    TableRow,
} from '@/components/ui/table';
import { CreditCard, AlertTriangle } from 'lucide-react';
import { format } from 'date-fns';
import * as premiumRoutes from '@/routes/subscriptions/premiums/index';

interface PremiumEntry {
    id: number;
    due_date: string;
    due_amount: number;
    status: 'upcoming' | 'paid' | 'missed' | 'late';
}

interface SubscriptionRow {
    id: number;
    member: {
        id: number;
        user: { name: string; email: string };
    };
    insurance: {
        name: string;
        premium: number;
        frequency: string;
    };
    paid_total: number;
    outstanding_total: number;
    missed_count: number;
    schedules: PremiumEntry[];
}

interface Props {
    subscriptions: SubscriptionRow[];
}

const scheduleStatusColors: Record<string, string> = {
    upcoming: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    paid: 'bg-green-500/10 text-green-700 border-green-500/20',
    missed: 'bg-red-500/10 text-red-700 border-red-500/20',
    late: 'bg-orange-500/10 text-orange-700 border-orange-500/20',
};

function fmt(amount: number): string {
    return '₱' + amount.toLocaleString('en-PH', { minimumFractionDigits: 2, maximumFractionDigits: 2 });
}

export default function PremiumsIndex({ subscriptions }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [detailSub, setDetailSub] = useState<SubscriptionRow | null>(null);

    const filtered = useMemo(() => {
        if (!searchQuery) return subscriptions;
        const q = searchQuery.toLowerCase();
        return subscriptions.filter(
            (s) =>
                s.member.user.name.toLowerCase().includes(q) ||
                s.member.user.email.toLowerCase().includes(q) ||
                s.insurance.name.toLowerCase().includes(q),
        );
    }, [subscriptions, searchQuery]);

    const totalOutstanding = subscriptions.reduce((sum, s) => sum + s.outstanding_total, 0);
    const withMissed = subscriptions.filter((s) => s.missed_count > 0).length;

    return (
        <AppLayout breadcrumbs={[{ title: 'Premium Schedules', href: premiumRoutes.index().url }]}>
            <Head title="Premium Schedules" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Premium Schedules</h1>
                        <p className="text-sm text-muted-foreground">
                            {subscriptions.length} approved subscriptions · {withMissed} with missed/late payments ·{' '}
                            {fmt(totalOutstanding)} total outstanding
                        </p>
                    </div>
                </div>

                {/* Search */}
                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        placeholder="Search by member or plan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64"
                    />
                </div>

                {/* Table */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                        <CreditCard className="mb-3 h-10 w-10 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">No subscriptions found</p>
                    </div>
                ) : (
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Insurance Plan</TableHead>
                                    <TableHead className="text-right">Paid</TableHead>
                                    <TableHead className="text-right">Outstanding</TableHead>
                                    <TableHead>Missed / Late</TableHead>
                                    <TableHead className="w-20" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((sub) => (
                                    <TableRow key={sub.id}>
                                        <TableCell>
                                            <p className="font-medium">{sub.member.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{sub.member.user.email}</p>
                                        </TableCell>
                                        <TableCell>
                                            <p>{sub.insurance.name}</p>
                                            <p className="text-xs text-muted-foreground">
                                                {fmt(sub.insurance.premium)} / {sub.insurance.frequency}
                                            </p>
                                        </TableCell>
                                        <TableCell className="text-right font-medium text-green-700">
                                            {fmt(sub.paid_total)}
                                        </TableCell>
                                        <TableCell className="text-right font-medium">
                                            <span className={sub.outstanding_total > 0 ? 'text-red-700' : 'text-muted-foreground'}>
                                                {fmt(sub.outstanding_total)}
                                            </span>
                                        </TableCell>
                                        <TableCell>
                                            {sub.missed_count > 0 ? (
                                                <div className="flex items-center gap-1 text-orange-700">
                                                    <AlertTriangle className="h-3.5 w-3.5" />
                                                    <span className="text-sm">{sub.missed_count}</span>
                                                </div>
                                            ) : (
                                                <span className="text-sm text-muted-foreground">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>
                                            <Button size="sm" variant="ghost" onClick={() => setDetailSub(sub)}>
                                                View
                                            </Button>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Detail Dialog */}
            {detailSub && (
                <Dialog open={!!detailSub} onOpenChange={() => setDetailSub(null)}>
                    <DialogContent className="sm:max-w-[600px]">
                        <DialogHeader>
                            <DialogTitle>Payment Schedule — {detailSub.member.user.name}</DialogTitle>
                            <DialogDescription>
                                {detailSub.insurance.name} · {fmt(detailSub.insurance.premium)} / {detailSub.insurance.frequency}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-4">
                            {/* Balance Summary */}
                            <div className="grid grid-cols-3 gap-3 rounded-lg border p-4 text-center text-sm">
                                <div>
                                    <p className="text-xs text-muted-foreground">Paid</p>
                                    <p className="mt-0.5 text-lg font-semibold text-green-700">{fmt(detailSub.paid_total)}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Outstanding</p>
                                    <p className={`mt-0.5 text-lg font-semibold ${detailSub.outstanding_total > 0 ? 'text-red-700' : 'text-muted-foreground'}`}>
                                        {fmt(detailSub.outstanding_total)}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Missed / Late</p>
                                    <p className={`mt-0.5 text-lg font-semibold ${detailSub.missed_count > 0 ? 'text-orange-700' : 'text-muted-foreground'}`}>
                                        {detailSub.missed_count}
                                    </p>
                                </div>
                            </div>

                            {/* Schedule Table */}
                            {detailSub.schedules.length === 0 ? (
                                <p className="py-6 text-center text-sm text-muted-foreground">No payment schedule entries.</p>
                            ) : (
                                <div className="max-h-72 overflow-y-auto rounded-lg border">
                                    <Table>
                                        <TableHeader>
                                            <TableRow>
                                                <TableHead>Due Date</TableHead>
                                                <TableHead className="text-right">Amount</TableHead>
                                                <TableHead>Status</TableHead>
                                            </TableRow>
                                        </TableHeader>
                                        <TableBody>
                                            {detailSub.schedules.map((entry) => (
                                                <TableRow key={entry.id}>
                                                    <TableCell className="text-sm">
                                                        {format(new Date(entry.due_date), 'MMM d, yyyy')}
                                                    </TableCell>
                                                    <TableCell className="text-right text-sm font-medium">
                                                        {fmt(entry.due_amount)}
                                                    </TableCell>
                                                    <TableCell>
                                                        <Badge
                                                            variant="outline"
                                                            className={`capitalize text-xs ${scheduleStatusColors[entry.status] ?? ''}`}
                                                        >
                                                            {entry.status}
                                                        </Badge>
                                                    </TableCell>
                                                </TableRow>
                                            ))}
                                        </TableBody>
                                    </Table>
                                </div>
                            )}
                        </div>
                    </DialogContent>
                </Dialog>
            )}
        </AppLayout>
    );
}
