import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
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
import { ShieldCheck } from 'lucide-react';
import { format } from 'date-fns';
import * as reviewRoutes from '@/routes/subscriptions/review/index';

interface Beneficiary {
    id: number;
    name: string;
    relationship: string;
    contact: string;
}

interface Insurance {
    id: number;
    name: string;
    premium: number;
    frequency: string;
}

interface Member {
    id: number;
    user: { id: number; name: string; email: string };
}

interface Reviewer {
    id: number;
    name: string;
}

interface Subscription {
    id: number;
    status: string;
    created_at: string;
    reviewed_at: string | null;
    member: Member;
    insurance: Insurance;
    beneficiaries: Beneficiary[];
    reviewer: Reviewer | null;
}

interface Props {
    subscriptions: Subscription[];
}

const statusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    approved: 'bg-green-500/10 text-green-700 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-700 border-red-500/20',
};

export default function SubscriptionsIndex({ subscriptions }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [detailSubscription, setDetailSubscription] = useState<Subscription | null>(null);
    const [confirmAction, setConfirmAction] = useState<{ subscription: Subscription; action: 'approve' | 'reject' } | null>(null);
    const [processing, setProcessing] = useState(false);

    const filtered = useMemo(() => {
        return subscriptions.filter((s) => {
            const matchesSearch =
                !searchQuery ||
                s.member.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                s.insurance.name.toLowerCase().includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || s.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [subscriptions, searchQuery, statusFilter]);

    const pendingCount = subscriptions.filter((s) => s.status === 'pending').length;

    const handleConfirm = () => {
        if (!confirmAction) return;
        setProcessing(true);
        const url =
            confirmAction.action === 'approve'
                ? reviewRoutes.approve(confirmAction.subscription).url
                : reviewRoutes.reject(confirmAction.subscription).url;
        router.post(url, {}, {
            onFinish: () => {
                setProcessing(false);
                setConfirmAction(null);
                setDetailSubscription(null);
            },
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Insurance Subscriptions', href: reviewRoutes.index().url }]}>
            <Head title="Insurance Subscriptions" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Insurance Subscriptions</h1>
                        <p className="text-sm text-muted-foreground">
                            {subscriptions.length} total · {pendingCount} pending review
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        placeholder="Search by member or plan..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-64"
                    />
                    <div className="flex gap-1">
                        {(['all', 'pending', 'approved', 'rejected'] as const).map((s) => (
                            <Button
                                key={s}
                                size="sm"
                                variant={statusFilter === s ? 'default' : 'outline'}
                                onClick={() => setStatusFilter(s)}
                                className="capitalize"
                            >
                                {s}
                            </Button>
                        ))}
                    </div>
                </div>

                {/* Table */}
                {filtered.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                        <ShieldCheck className="mb-3 h-10 w-10 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">No subscriptions found</p>
                    </div>
                ) : (
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Insurance Plan</TableHead>
                                    <TableHead>Beneficiaries</TableHead>
                                    <TableHead>Premium</TableHead>
                                    <TableHead>Filed</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-28" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((sub) => (
                                    <TableRow key={sub.id}>
                                        <TableCell>
                                            <p className="font-medium">{sub.member.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{sub.member.user.email}</p>
                                        </TableCell>
                                        <TableCell>{sub.insurance.name}</TableCell>
                                        <TableCell>{sub.beneficiaries.length}</TableCell>
                                        <TableCell>
                                            ₱{sub.insurance.premium.toLocaleString()} / {sub.insurance.frequency}
                                        </TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {format(new Date(sub.created_at), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`capitalize text-xs ${statusColors[sub.status] ?? ''}`}
                                            >
                                                {sub.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setDetailSubscription(sub)}
                                                >
                                                    View
                                                </Button>
                                                {sub.status === 'pending' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-green-700 border-green-300 hover:bg-green-50"
                                                            onClick={() => setConfirmAction({ subscription: sub, action: 'approve' })}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-700 border-red-300 hover:bg-red-50"
                                                            onClick={() => setConfirmAction({ subscription: sub, action: 'reject' })}
                                                        >
                                                            Reject
                                                        </Button>
                                                    </>
                                                )}
                                            </div>
                                        </TableCell>
                                    </TableRow>
                                ))}
                            </TableBody>
                        </Table>
                    </div>
                )}
            </div>

            {/* Detail Dialog */}
            {detailSubscription && (
                <Dialog open={!!detailSubscription} onOpenChange={() => setDetailSubscription(null)}>
                    <DialogContent className="sm:max-w-[520px]">
                        <DialogHeader>
                            <DialogTitle>Subscription Details</DialogTitle>
                            <DialogDescription>
                                Filed by {detailSubscription.member.user.name} on{' '}
                                {format(new Date(detailSubscription.created_at), 'MMMM d, yyyy')}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-4 text-sm">
                            <div className="grid grid-cols-2 gap-3 rounded-lg border p-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Member</p>
                                    <p className="font-medium">{detailSubscription.member.user.name}</p>
                                    <p className="text-muted-foreground">{detailSubscription.member.user.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Insurance Plan</p>
                                    <p className="font-medium">{detailSubscription.insurance.name}</p>
                                    <p className="text-muted-foreground">
                                        ₱{detailSubscription.insurance.premium.toLocaleString()} / {detailSubscription.insurance.frequency}
                                    </p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Status</p>
                                    <Badge
                                        variant="outline"
                                        className={`capitalize text-xs mt-1 ${statusColors[detailSubscription.status] ?? ''}`}
                                    >
                                        {detailSubscription.status}
                                    </Badge>
                                </div>
                                {detailSubscription.reviewer && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">Reviewed by</p>
                                        <p className="font-medium">{detailSubscription.reviewer.name}</p>
                                        {detailSubscription.reviewed_at && (
                                            <p className="text-muted-foreground">
                                                {format(new Date(detailSubscription.reviewed_at), 'MMM d, yyyy')}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>

                            {detailSubscription.beneficiaries.length > 0 && (
                                <div>
                                    <p className="mb-2 font-medium">Beneficiaries</p>
                                    <div className="flex flex-col gap-2">
                                        {detailSubscription.beneficiaries.map((b) => (
                                            <div key={b.id} className="rounded-lg border p-3">
                                                <p className="font-medium">{b.name}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    {b.relationship} · {b.contact}
                                                </p>
                                            </div>
                                        ))}
                                    </div>
                                </div>
                            )}
                        </div>

                        {detailSubscription.status === 'pending' && (
                            <DialogFooter className="gap-2">
                                <Button
                                    variant="outline"
                                    className="text-red-700 border-red-300 hover:bg-red-50"
                                    onClick={() => setConfirmAction({ subscription: detailSubscription, action: 'reject' })}
                                >
                                    Reject
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => setConfirmAction({ subscription: detailSubscription, action: 'approve' })}
                                >
                                    Approve
                                </Button>
                            </DialogFooter>
                        )}
                    </DialogContent>
                </Dialog>
            )}

            {/* Confirm Dialog */}
            <Dialog open={!!confirmAction} onOpenChange={() => setConfirmAction(null)}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle className="capitalize">
                            {confirmAction?.action} subscription?
                        </DialogTitle>
                        <DialogDescription>
                            {confirmAction?.action === 'approve'
                                ? `This will approve the insurance subscription for ${confirmAction.subscription.member.user.name}.`
                                : `This will reject the insurance subscription for ${confirmAction?.subscription.member.user.name}.`}
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setConfirmAction(null)}>
                            Cancel
                        </Button>
                        <Button
                            disabled={processing}
                            variant={confirmAction?.action === 'reject' ? 'destructive' : 'default'}
                            className={confirmAction?.action === 'approve' ? 'bg-green-600 hover:bg-green-700 text-white' : ''}
                            onClick={handleConfirm}
                        >
                            {confirmAction?.action === 'approve' ? 'Approve' : 'Reject'}
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
