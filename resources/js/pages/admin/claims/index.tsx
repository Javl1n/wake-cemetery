import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import AppLayout from '@/layouts/app-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
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
import * as claimReviewRoutes from '@/routes/claims/review/index';

interface Member {
    id: number;
    user: { id: number; name: string; email: string };
}

interface Insurance {
    id: number;
    name: string;
    premium: number;
}

interface Subscription {
    id: number;
    member: Member;
    insurance: Insurance;
}

interface Beneficiary {
    id: number;
    name: string;
    relationship: string;
}

interface Schedule {
    id: number;
    deceased: {
        id: number;
        beneficiary: Beneficiary | null;
    };
}

interface Reviewer {
    id: number;
    name: string;
}

interface Claim {
    id: number;
    status: 'filed' | 'approved' | 'rejected' | 'paid';
    filed_at: string;
    reviewed_at: string | null;
    approved_amount: number | null;
    subscription: Subscription;
    schedule: Schedule;
    reviewer: Reviewer | null;
}

interface Props {
    claims: Claim[];
}

const statusColors: Record<string, string> = {
    filed: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    approved: 'bg-green-500/10 text-green-700 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-700 border-red-500/20',
    paid: 'bg-emerald-500/10 text-emerald-700 border-emerald-500/20',
};

export default function ClaimsIndex({ claims }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [statusFilter, setStatusFilter] = useState<string>('all');
    const [detailClaim, setDetailClaim] = useState<Claim | null>(null);
    const [approveOpen, setApproveOpen] = useState<Claim | null>(null);
    const [approvedAmount, setApprovedAmount] = useState('');
    const [rejectClaim, setRejectClaim] = useState<Claim | null>(null);
    const [processing, setProcessing] = useState(false);

    const filtered = useMemo(() => {
        return claims.filter((c) => {
            const memberName = c.subscription.member.user.name.toLowerCase();
            const beneficiaryName = c.schedule.deceased.beneficiary?.name.toLowerCase() ?? '';
            const matchesSearch =
                !searchQuery ||
                memberName.includes(searchQuery.toLowerCase()) ||
                beneficiaryName.includes(searchQuery.toLowerCase());
            const matchesStatus = statusFilter === 'all' || c.status === statusFilter;
            return matchesSearch && matchesStatus;
        });
    }, [claims, searchQuery, statusFilter]);

    const filedCount = claims.filter((c) => c.status === 'filed').length;

    const handleApprove = () => {
        if (!approveOpen) return;
        setProcessing(true);
        router.post(
            claimReviewRoutes.approve(approveOpen).url,
            { approved_amount: approvedAmount },
            {
                onFinish: () => {
                    setProcessing(false);
                    setApproveOpen(null);
                    setDetailClaim(null);
                    setApprovedAmount('');
                },
            },
        );
    };

    const handleReject = () => {
        if (!rejectClaim) return;
        setProcessing(true);
        router.post(
            claimReviewRoutes.reject(rejectClaim).url,
            {},
            {
                onFinish: () => {
                    setProcessing(false);
                    setRejectClaim(null);
                    setDetailClaim(null);
                },
            },
        );
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Insurance Claims', href: claimReviewRoutes.index().url }]}>
            <Head title="Insurance Claims" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Insurance Claims</h1>
                        <p className="text-sm text-muted-foreground">
                            {claims.length} total · {filedCount} pending review
                        </p>
                    </div>
                </div>

                {/* Filters */}
                <div className="flex flex-wrap items-center gap-3">
                    <Input
                        placeholder="Search by member or beneficiary..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-72"
                    />
                    <div className="flex gap-1">
                        {(['all', 'filed', 'approved', 'rejected', 'paid'] as const).map((s) => (
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
                        <p className="text-sm text-muted-foreground">No claims found</p>
                    </div>
                ) : (
                    <div className="rounded-lg border">
                        <Table>
                            <TableHeader>
                                <TableRow>
                                    <TableHead>Member</TableHead>
                                    <TableHead>Beneficiary</TableHead>
                                    <TableHead>Insurance Plan</TableHead>
                                    <TableHead>Filed</TableHead>
                                    <TableHead>Approved Amount</TableHead>
                                    <TableHead>Status</TableHead>
                                    <TableHead className="w-28" />
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {filtered.map((claim) => (
                                    <TableRow key={claim.id}>
                                        <TableCell>
                                            <p className="font-medium">{claim.subscription.member.user.name}</p>
                                            <p className="text-xs text-muted-foreground">{claim.subscription.member.user.email}</p>
                                        </TableCell>
                                        <TableCell>
                                            {claim.schedule.deceased.beneficiary ? (
                                                <>
                                                    <p className="font-medium">{claim.schedule.deceased.beneficiary.name}</p>
                                                    <p className="text-xs text-muted-foreground capitalize">{claim.schedule.deceased.beneficiary.relationship}</p>
                                                </>
                                            ) : (
                                                <span className="text-muted-foreground text-xs">—</span>
                                            )}
                                        </TableCell>
                                        <TableCell>{claim.subscription.insurance.name}</TableCell>
                                        <TableCell className="text-sm text-muted-foreground">
                                            {format(new Date(claim.filed_at), 'MMM d, yyyy')}
                                        </TableCell>
                                        <TableCell>
                                            {claim.approved_amount != null
                                                ? `₱${parseFloat(claim.approved_amount.toString()).toLocaleString()}`
                                                : <span className="text-muted-foreground text-xs">—</span>
                                            }
                                        </TableCell>
                                        <TableCell>
                                            <Badge
                                                variant="outline"
                                                className={`capitalize text-xs ${statusColors[claim.status] ?? ''}`}
                                            >
                                                {claim.status}
                                            </Badge>
                                        </TableCell>
                                        <TableCell>
                                            <div className="flex items-center justify-end gap-1">
                                                <Button
                                                    size="sm"
                                                    variant="ghost"
                                                    onClick={() => setDetailClaim(claim)}
                                                >
                                                    View
                                                </Button>
                                                {claim.status === 'filed' && (
                                                    <>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-green-700 border-green-300 hover:bg-green-50"
                                                            onClick={() => { setApproveOpen(claim); setApprovedAmount(''); }}
                                                        >
                                                            Approve
                                                        </Button>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="text-red-700 border-red-300 hover:bg-red-50"
                                                            onClick={() => setRejectClaim(claim)}
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
            {detailClaim && (
                <Dialog open={!!detailClaim} onOpenChange={() => setDetailClaim(null)}>
                    <DialogContent className="sm:max-w-[520px]">
                        <DialogHeader>
                            <DialogTitle>Claim Details</DialogTitle>
                            <DialogDescription>
                                Filed by {detailClaim.subscription.member.user.name} on{' '}
                                {format(new Date(detailClaim.filed_at), 'MMMM d, yyyy')}
                            </DialogDescription>
                        </DialogHeader>

                        <div className="flex flex-col gap-4 text-sm">
                            <div className="grid grid-cols-2 gap-3 rounded-lg border p-4">
                                <div>
                                    <p className="text-xs text-muted-foreground">Member</p>
                                    <p className="font-medium">{detailClaim.subscription.member.user.name}</p>
                                    <p className="text-muted-foreground">{detailClaim.subscription.member.user.email}</p>
                                </div>
                                <div>
                                    <p className="text-xs text-muted-foreground">Insurance Plan</p>
                                    <p className="font-medium">{detailClaim.subscription.insurance.name}</p>
                                </div>
                                {detailClaim.schedule.deceased.beneficiary && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">Deceased Beneficiary</p>
                                        <p className="font-medium">{detailClaim.schedule.deceased.beneficiary.name}</p>
                                        <p className="text-muted-foreground capitalize">{detailClaim.schedule.deceased.beneficiary.relationship}</p>
                                    </div>
                                )}
                                <div>
                                    <p className="text-xs text-muted-foreground">Status</p>
                                    <Badge
                                        variant="outline"
                                        className={`capitalize text-xs mt-1 ${statusColors[detailClaim.status] ?? ''}`}
                                    >
                                        {detailClaim.status}
                                    </Badge>
                                </div>
                                {detailClaim.approved_amount != null && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">Approved Amount</p>
                                        <p className="font-medium">₱{parseFloat(detailClaim.approved_amount.toString()).toLocaleString()}</p>
                                    </div>
                                )}
                                {detailClaim.reviewer && (
                                    <div>
                                        <p className="text-xs text-muted-foreground">Reviewed by</p>
                                        <p className="font-medium">{detailClaim.reviewer.name}</p>
                                        {detailClaim.reviewed_at && (
                                            <p className="text-muted-foreground">
                                                {format(new Date(detailClaim.reviewed_at), 'MMM d, yyyy')}
                                            </p>
                                        )}
                                    </div>
                                )}
                            </div>
                        </div>

                        {detailClaim.status === 'filed' && (
                            <DialogFooter className="gap-2">
                                <Button
                                    variant="outline"
                                    className="text-red-700 border-red-300 hover:bg-red-50"
                                    onClick={() => { setRejectClaim(detailClaim); setDetailClaim(null); }}
                                >
                                    Reject
                                </Button>
                                <Button
                                    className="bg-green-600 hover:bg-green-700 text-white"
                                    onClick={() => { setApproveOpen(detailClaim); setDetailClaim(null); setApprovedAmount(''); }}
                                >
                                    Approve
                                </Button>
                            </DialogFooter>
                        )}
                    </DialogContent>
                </Dialog>
            )}

            {/* Approve Dialog */}
            <Dialog open={!!approveOpen} onOpenChange={() => { setApproveOpen(null); setApprovedAmount(''); }}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Approve Claim</DialogTitle>
                        <DialogDescription>
                            Enter the approved insurance payout amount for{' '}
                            {approveOpen?.subscription.member.user.name}.
                        </DialogDescription>
                    </DialogHeader>
                    <div className="space-y-2">
                        <Label htmlFor="approved-amount">Approved Amount (₱)</Label>
                        <Input
                            id="approved-amount"
                            type="number"
                            min="0"
                            step="0.01"
                            placeholder="0.00"
                            value={approvedAmount}
                            onChange={(e) => setApprovedAmount(e.target.value)}
                        />
                    </div>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => { setApproveOpen(null); setApprovedAmount(''); }}>
                            Cancel
                        </Button>
                        <Button
                            disabled={!approvedAmount || parseFloat(approvedAmount) < 0 || processing}
                            className="bg-green-600 hover:bg-green-700 text-white"
                            onClick={handleApprove}
                        >
                            Approve Claim
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>

            {/* Reject Dialog */}
            <Dialog open={!!rejectClaim} onOpenChange={() => setRejectClaim(null)}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Reject Claim</DialogTitle>
                        <DialogDescription>
                            This will reject the insurance claim for{' '}
                            {rejectClaim?.subscription.member.user.name}. This action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setRejectClaim(null)}>
                            Cancel
                        </Button>
                        <Button
                            variant="destructive"
                            disabled={processing}
                            onClick={handleReject}
                        >
                            Reject Claim
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
