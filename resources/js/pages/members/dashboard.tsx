import { Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import MemberLayout from '@/layouts/member-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import {
    BadgeCheck,
    Calendar,
    FileText,
    Heart,
    ShieldCheck,
    Users,
    BookHeart,
} from 'lucide-react';

interface Member {
    id: number;
    member_number: string;
    phone: string;
    address: string;
    civil_status: string;
    created_at: string;
    verification?: {
        date_verified: string | null;
    };
}

interface Insurance {
    id: number;
    name: string;
    description: string;
    premium: number;
    frequency: string;
    beneficiaries: number;
}

interface Subscription {
    id: number;
    status: 'pending' | 'active' | 'cancelled' | 'rejected';
    created_at: string;
    insurance: Insurance;
}

interface Beneficiary {
    id: number;
    name: string;
    relationship: string;
    contact: string;
    date_of_birth: string;
}

interface Claim {
    id: number;
    status: 'pending' | 'approved' | 'rejected';
    filed_at: string;
    approved_amount?: number;
}

interface ActiveWakeSchedule {
    id: number;
    status: string;
    date_start: string;
    date_end: string;
    deceased: {
        beneficiary?: { name: string; relationship: string };
    };
    room: { name: string };
    package: { name: string };
}

interface DeceasedRecord {
    id: number;
    date_of_death: string;
    beneficiary: { name: string; relationship: string } | null;
    obituary: { tribute_token: string } | null;
}

interface Props {
    member: Member | null;
    subscription: Subscription | null;
    beneficiaries: Beneficiary[];
    claims: Claim[];
    wakeScheduleCount: number;
    activeWakeSchedule: ActiveWakeSchedule | null;
    deceaseds: DeceasedRecord[];
}

const subscriptionStatusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    active: 'bg-green-500/10 text-green-700 border-green-500/20',
    cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    rejected: 'bg-red-500/10 text-red-700 border-red-500/20',
};

const claimStatusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    approved: 'bg-green-500/10 text-green-700 border-green-500/20',
    rejected: 'bg-red-500/10 text-red-700 border-red-500/20',
};

const wakeStatusColors: Record<string, string> = {
    confirmed: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    in_progress: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
};

export default function MemberDashboard({
    member,
    subscription,
    beneficiaries,
    claims,
    wakeScheduleCount,
    activeWakeSchedule,
    deceaseds,
}: Props) {
    const { auth } = usePage().props;

    return (
        <MemberLayout title="Dashboard">
            {/* Page heading */}
            <div className="mb-8">
                <h1 className="text-3xl font-bold tracking-tight">
                    Welcome back, {auth.user.name}
                </h1>
                <p className="text-muted-foreground mt-1">
                    Here's an overview of your membership and services.
                </p>
            </div>

            {/* Stats row */}
            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 mb-8">
                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <ShieldCheck className="h-4 w-4 text-blue-500" />
                            Subscription
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        {subscription ? (
                            <>
                                <p className="text-2xl font-bold">{subscription.insurance.name}</p>
                                <Badge className={`mt-1 text-xs ${subscriptionStatusColors[subscription.status]}`} variant="outline">
                                    {subscription.status}
                                </Badge>
                            </>
                        ) : (
                            <p className="text-muted-foreground text-sm">No active plan</p>
                        )}
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Heart className="h-4 w-4 text-red-500" />
                            Beneficiaries
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{beneficiaries.length}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {subscription
                                ? `of ${subscription.insurance.beneficiaries} allowed`
                                : 'Protected members'}
                        </p>
                    </CardContent>
                </Card>

                <Card>
                    <CardHeader className="pb-2">
                        <CardTitle className="text-sm font-medium text-muted-foreground flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-purple-500" />
                            Wake Schedules
                        </CardTitle>
                    </CardHeader>
                    <CardContent>
                        <p className="text-2xl font-bold">{wakeScheduleCount}</p>
                        <p className="text-xs text-muted-foreground mt-1">
                            {wakeScheduleCount === 1 ? 'arrangement on record' : 'arrangements on record'}
                        </p>
                    </CardContent>
                </Card>
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                {/* Left: main content */}
                <div className="lg:col-span-2 space-y-6">
                    {/* Active wake schedule */}
                    {activeWakeSchedule && (
                        <Card className="border-primary/30 bg-primary/5">
                            <CardHeader>
                                <div className="flex items-start justify-between gap-2">
                                    <div>
                                        <CardTitle className="text-base">Active Wake Arrangement</CardTitle>
                                        <CardDescription>
                                            {activeWakeSchedule.deceased.beneficiary?.name ?? 'Loved one'} ·{' '}
                                            {activeWakeSchedule.room.name}
                                        </CardDescription>
                                    </div>
                                    <Badge
                                        className={`text-xs ${wakeStatusColors[activeWakeSchedule.status] ?? ''}`}
                                        variant="outline"
                                    >
                                        {activeWakeSchedule.status.replace('_', ' ')}
                                    </Badge>
                                </div>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                <div className="grid grid-cols-2 gap-3 text-sm">
                                    <div>
                                        <p className="text-muted-foreground">Package</p>
                                        <p className="font-medium">{activeWakeSchedule.package.name}</p>
                                    </div>
                                    <div>
                                        <p className="text-muted-foreground">Dates</p>
                                        <p className="font-medium">
                                            {format(new Date(activeWakeSchedule.date_start), 'MMM dd')} –{' '}
                                            {format(new Date(activeWakeSchedule.date_end), 'MMM dd, yyyy')}
                                        </p>
                                    </div>
                                </div>
                                <Link href="/member/wake-schedules">
                                    <Button size="sm" variant="outline" className="w-full mt-2">
                                        View Details & Order Items
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    )}

                    {/* Subscription plan */}
                    <Card>
                        <CardHeader>
                            <CardTitle>Insurance Plan</CardTitle>
                            <CardDescription>
                                {subscription
                                    ? `${subscription.insurance.name} · ${subscription.insurance.frequency}`
                                    : 'No plan enrolled'}
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {subscription ? (
                                <div className="space-y-4">
                                    <p className="text-sm text-muted-foreground">
                                        {subscription.insurance.description}
                                    </p>
                                    <div className="grid grid-cols-2 gap-4 text-sm">
                                        <div>
                                            <p className="text-muted-foreground">Premium</p>
                                            <p className="text-xl font-bold">
                                                ₱{subscription.insurance.premium.toLocaleString()}
                                                <span className="text-sm font-normal text-muted-foreground">
                                                    /{subscription.insurance.frequency}
                                                </span>
                                            </p>
                                        </div>
                                        <div>
                                            <p className="text-muted-foreground">Enrolled</p>
                                            <p className="font-medium">
                                                {format(new Date(subscription.created_at), 'MMM dd, yyyy')}
                                            </p>
                                        </div>
                                    </div>
                                </div>
                            ) : (
                                <div className="py-6 text-center space-y-2">
                                    <ShieldCheck className="h-10 w-10 text-muted-foreground mx-auto" />
                                    <p className="text-sm text-muted-foreground">
                                        You have no active insurance plan.
                                    </p>
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Beneficiaries */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="flex items-center gap-2">
                                <Users className="h-4 w-4" />
                                Beneficiaries
                            </CardTitle>
                            <CardDescription>
                                People covered under your plan
                            </CardDescription>
                        </CardHeader>
                        <CardContent>
                            {beneficiaries.length > 0 ? (
                                <div className="divide-y">
                                    {beneficiaries.map((b) => (
                                        <div key={b.id} className="py-3 flex items-center justify-between">
                                            <div>
                                                <p className="font-medium text-sm">{b.name}</p>
                                                <p className="text-xs text-muted-foreground capitalize">
                                                    {b.relationship} · {b.contact}
                                                </p>
                                            </div>
                                            <BadgeCheck className="h-4 w-4 text-green-500 shrink-0" />
                                        </div>
                                    ))}
                                </div>
                            ) : (
                                <p className="text-sm text-muted-foreground py-4 text-center">
                                    No beneficiaries registered.
                                </p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Tribute Pages */}
                    {deceaseds.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <BookHeart className="h-4 w-4" />
                                    Tribute Pages
                                </CardTitle>
                                <CardDescription>
                                    Online memorial pages for your loved ones
                                </CardDescription>
                            </CardHeader>
                            <CardContent>
                                <div className="divide-y">
                                    {deceaseds.map((d) => (
                                        <div key={d.id} className="py-3 flex items-center justify-between gap-3">
                                            <div>
                                                <p className="font-medium text-sm">
                                                    {d.beneficiary?.name ?? 'Unknown'}
                                                </p>
                                                <p className="text-xs text-muted-foreground capitalize">
                                                    {d.beneficiary?.relationship} · {format(new Date(d.date_of_death), 'MMM d, yyyy')}
                                                </p>
                                            </div>
                                            <div className="flex gap-2 shrink-0">
                                                {d.obituary && (
                                                    <Link href={`/tribute/${d.obituary.tribute_token}`} target="_blank">
                                                        <Button size="sm" variant="outline">View</Button>
                                                    </Link>
                                                )}
                                                <Link href={`/member/deceased/${d.id}/obituary/setup`}>
                                                    <Button size="sm" variant={d.obituary ? 'ghost' : 'default'}>
                                                        {d.obituary ? 'Edit' : 'Create'}
                                                    </Button>
                                                </Link>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}

                    {/* Claims */}
                    {claims.length > 0 && (
                        <Card>
                            <CardHeader>
                                <CardTitle className="flex items-center gap-2">
                                    <FileText className="h-4 w-4" />
                                    Insurance Claims
                                </CardTitle>
                            </CardHeader>
                            <CardContent>
                                <div className="divide-y">
                                    {claims.map((claim) => (
                                        <div key={claim.id} className="py-3 flex items-center justify-between text-sm">
                                            <div>
                                                <p className="font-medium">Claim #{claim.id}</p>
                                                <p className="text-xs text-muted-foreground">
                                                    Filed {format(new Date(claim.filed_at), 'MMM dd, yyyy')}
                                                </p>
                                            </div>
                                            <div className="flex items-center gap-3">
                                                {claim.approved_amount && (
                                                    <span className="font-bold">
                                                        ₱{claim.approved_amount.toLocaleString()}
                                                    </span>
                                                )}
                                                <Badge
                                                    className={`text-xs ${claimStatusColors[claim.status]}`}
                                                    variant="outline"
                                                >
                                                    {claim.status}
                                                </Badge>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            </CardContent>
                        </Card>
                    )}
                </div>

                {/* Right: member info sidebar */}
                <div className="space-y-6">
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Member Information</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-4 text-sm">
                            {member ? (
                                <>
                                    <div>
                                        <p className="text-muted-foreground">Member ID</p>
                                        <p className="font-mono font-medium">{member.member_number}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-muted-foreground">Member Since</p>
                                        <p className="font-medium">
                                            {format(new Date(member.created_at), 'MMMM dd, yyyy')}
                                        </p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-muted-foreground">Email</p>
                                        <p className="font-medium">{auth.user.email}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-muted-foreground">Phone</p>
                                        <p className="font-medium">{member.phone}</p>
                                    </div>
                                    <Separator />
                                    <div>
                                        <p className="text-muted-foreground">Verification</p>
                                        <p className="font-medium">
                                            {member.verification?.date_verified
                                                ? `Verified ${format(new Date(member.verification.date_verified), 'MMM dd, yyyy')}`
                                                : 'Pending verification'}
                                        </p>
                                    </div>
                                </>
                            ) : (
                                <p className="text-muted-foreground">Member profile not yet set up.</p>
                            )}
                        </CardContent>
                    </Card>

                    {/* Quick links */}
                    <Card>
                        <CardHeader>
                            <CardTitle className="text-base">Quick Links</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-2">
                            <Link href="/member/wake-schedules" className="block">
                                <Button variant="outline" className="w-full justify-start">
                                    <Calendar className="h-4 w-4 mr-2" />
                                    Wake Schedules
                                </Button>
                            </Link>
                            <Link href="/cemetery/map" className="block">
                                <Button variant="outline" className="w-full justify-start">
                                    <ShieldCheck className="h-4 w-4 mr-2" />
                                    Cemetery Map
                                </Button>
                            </Link>
                        </CardContent>
                    </Card>

                    <Card className="border-blue-200 bg-blue-50 dark:bg-blue-950 dark:border-blue-800">
                        <CardHeader>
                            <CardTitle className="text-base">Need Help?</CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <p className="text-sm text-muted-foreground">
                                Have questions about your plan or need assistance with arrangements?
                            </p>
                            <Button className="w-full">Contact Support</Button>
                        </CardContent>
                    </Card>
                </div>
            </div>
        </MemberLayout>
    );
}
