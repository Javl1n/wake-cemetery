import { Link, usePage } from '@inertiajs/react';
import { format } from 'date-fns';
import MemberLayout from '@/layouts/member-layout';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Calendar, ChevronLeft, Phone, ShieldCheck, User } from 'lucide-react';

interface Member {
    id: number;
    member_number: string;
    phone: string;
    address: string;
    civil_status: string;
    created_at: string;
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

interface Props {
    member: Member | null;
    subscription: Subscription | null;
    beneficiaries: Beneficiary[];
}

const subscriptionStatusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    active: 'bg-green-500/10 text-green-700 border-green-500/20',
    cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
    rejected: 'bg-red-500/10 text-red-700 border-red-500/20',
};

const isParentRel = (r: string) =>
    ['mother', 'father', 'mom', 'dad', 'parent', 'stepmother', 'stepfather', 'guardian'].includes(
        r.toLowerCase().trim(),
    );

const isSpouseRel = (r: string) =>
    ['spouse', 'wife', 'husband', 'partner'].includes(r.toLowerCase().trim());

const isChildRel = (r: string) =>
    ['son', 'daughter', 'child', 'stepson', 'stepdaughter'].includes(r.toLowerCase().trim());

type NodeVariant = 'parent' | 'spouse' | 'child' | 'other';

const nodeConfig: Record<NodeVariant, { border: string; bg: string; iconBg: string; iconColor: string }> = {
    parent: {
        border: 'border-amber-300 dark:border-amber-700',
        bg: 'bg-amber-50 dark:bg-amber-950',
        iconBg: 'bg-amber-100 dark:bg-amber-900',
        iconColor: 'text-amber-600 dark:text-amber-400',
    },
    spouse: {
        border: 'border-rose-300 dark:border-rose-700',
        bg: 'bg-rose-50 dark:bg-rose-950',
        iconBg: 'bg-rose-100 dark:bg-rose-900',
        iconColor: 'text-rose-500',
    },
    child: {
        border: 'border-emerald-300 dark:border-emerald-700',
        bg: 'bg-emerald-50 dark:bg-emerald-950',
        iconBg: 'bg-emerald-100 dark:bg-emerald-900',
        iconColor: 'text-emerald-600 dark:text-emerald-400',
    },
    other: {
        border: 'border-border',
        bg: 'bg-card',
        iconBg: 'bg-muted',
        iconColor: 'text-muted-foreground',
    },
};

function PersonNode({ person, variant }: { person: Beneficiary; variant: NodeVariant }) {
    const { border, bg, iconBg, iconColor } = nodeConfig[variant];

    return (
        <div className={`rounded-2xl border-2 ${border} ${bg} p-4 shadow-sm text-center w-40 shrink-0`}>
            <div className={`${iconBg} rounded-full p-2 w-fit mx-auto mb-2`}>
                <User className={`h-4 w-4 ${iconColor}`} />
            </div>
            <p className="font-semibold text-sm leading-tight">{person.name}</p>
            <p className="text-xs text-muted-foreground capitalize mt-0.5">{person.relationship}</p>
            <div className="mt-2 pt-2 border-t space-y-1">
                <div className="flex items-center gap-1 justify-center text-xs text-muted-foreground">
                    <Phone className="h-3 w-3 shrink-0" />
                    <span className="truncate">{person.contact}</span>
                </div>
                <div className="flex items-center gap-1 justify-center text-xs text-muted-foreground">
                    <Calendar className="h-3 w-3 shrink-0" />
                    <span>{format(new Date(person.date_of_birth), 'MMM d, yyyy')}</span>
                </div>
            </div>
        </div>
    );
}

function MemberNode({ member, name }: { member: Member | null; name: string }) {
    return (
        <div className="rounded-2xl border-2 border-blue-400 dark:border-blue-600 bg-blue-50 dark:bg-blue-950 p-5 shadow-md text-center w-48 shrink-0">
            <div className="bg-blue-100 dark:bg-blue-900 rounded-full p-3 w-fit mx-auto mb-2">
                <User className="h-6 w-6 text-blue-600 dark:text-blue-400" />
            </div>
            <p className="font-bold text-base">{name}</p>
            <p className="text-xs font-medium text-blue-600 dark:text-blue-400 mt-0.5">You</p>
            {member && <p className="text-xs font-mono text-muted-foreground mt-1">{member.member_number}</p>}
        </div>
    );
}

export default function MemberInsurance({ member, subscription, beneficiaries }: Props) {
    const { auth } = usePage().props;

    // Categorize — limit parents to 2 for a sane family tree
    const parents = beneficiaries.filter((b) => isParentRel(b.relationship)).slice(0, 2);
    const extraParents = beneficiaries.filter((b) => isParentRel(b.relationship)).slice(2);
    const spouse = beneficiaries.find((b) => isSpouseRel(b.relationship)) ?? null;
    const children = beneficiaries.filter((b) => isChildRel(b.relationship));
    const others = [
        ...extraParents,
        ...beneficiaries.filter(
            (b) => !isParentRel(b.relationship) && !isSpouseRel(b.relationship) && !isChildRel(b.relationship),
        ),
    ];

    const hasParents = parents.length > 0;
    const hasChildren = children.length > 0;

    return (
        <MemberLayout title="Insurance Coverage">
            {/* Header */}
            <div className="mb-8 flex items-start gap-4">
                <Link href="/member/dashboard">
                    <Button variant="ghost" size="sm" className="mt-0.5">
                        <ChevronLeft className="h-4 w-4 mr-1" />
                        Dashboard
                    </Button>
                </Link>
                <div>
                    <h1 className="text-3xl font-bold tracking-tight">Insurance Coverage</h1>
                    <p className="text-muted-foreground mt-1">Family tree of your covered beneficiaries.</p>
                </div>
            </div>

            {/* Insurance plan strip */}
            {subscription && (
                <div className="flex items-center gap-3 mb-10 p-4 rounded-xl border bg-card">
                    <ShieldCheck className="h-5 w-5 text-emerald-600 shrink-0" />
                    <div className="min-w-0">
                        <p className="font-semibold text-sm">{subscription.insurance.name}</p>
                        <p className="text-xs text-muted-foreground">
                            ₱{subscription.insurance.premium.toLocaleString()}/{subscription.insurance.frequency}
                        </p>
                    </div>
                    <Badge
                        className={`ml-auto text-xs capitalize shrink-0 ${subscriptionStatusColors[subscription.status]}`}
                        variant="outline"
                    >
                        {subscription.status}
                    </Badge>
                </div>
            )}

            {beneficiaries.length === 0 ? (
                <div className="flex flex-col items-center py-20 text-center space-y-4">
                    <div className="rounded-full bg-muted p-5">
                        <User className="h-10 w-10 text-muted-foreground" />
                    </div>
                    <div>
                        <p className="text-lg font-semibold">No Beneficiaries</p>
                        <p className="text-muted-foreground text-sm mt-1">
                            Your family tree will appear once beneficiaries are registered under your plan.
                        </p>
                    </div>
                    {!subscription && (
                        <Link href="/subscription/register">
                            <Button>Enroll Now</Button>
                        </Link>
                    )}
                </div>
            ) : (
                <>
                    {/* ── Family Tree ────────────────────────────────── */}
                    <div className="flex flex-col items-center overflow-x-auto py-4">

                        {/* PARENTS TIER */}
                        {hasParents && (
                            <>
                                <div className="flex gap-0">
                                    {parents.map((p, i) => {
                                        const isFirst = i === 0;
                                        const isLast = i === parents.length - 1;
                                        const isOnly = parents.length === 1;

                                        return (
                                            <div
                                                key={p.id}
                                                className="relative flex flex-col items-center px-6"
                                            >
                                                <PersonNode person={p} variant="parent" />
                                                {/* Vertical drop to merge */}
                                                <div className="w-px h-8 bg-border" />
                                                {/* Half horizontal merging line */}
                                                {!isOnly && (
                                                    <div
                                                        className={`absolute bottom-0 h-px bg-border ${
                                                            isFirst
                                                                ? 'left-1/2 right-0'
                                                                : isLast
                                                                  ? 'left-0 right-1/2'
                                                                  : 'left-0 right-0'
                                                        }`}
                                                    />
                                                )}
                                            </div>
                                        );
                                    })}
                                </div>
                                {/* Stem down to member */}
                                <div className="w-px h-8 bg-border" />
                            </>
                        )}

                        {/* MEMBER + SPOUSE TIER */}
                        {/* Member stays centered; spouse is absolute so it doesn't shift the spine */}
                        <div className="relative">
                            <MemberNode member={member} name={auth.user.name} />
                            {spouse && (
                                <div className="absolute left-full top-1/2 -translate-y-1/2 flex items-center">
                                    <div className="w-8 h-px bg-border" />
                                    <PersonNode person={spouse} variant="spouse" />
                                </div>
                            )}
                        </div>

                        {/* CHILDREN TIER */}
                        {hasChildren && (
                            <>
                                {/* Stem down from member */}
                                <div className="w-px h-8 bg-border" />
                                <div className="flex gap-0">
                                    {children.map((c, i) => {
                                        const isFirst = i === 0;
                                        const isLast = i === children.length - 1;
                                        const isOnly = children.length === 1;

                                        return (
                                            <div
                                                key={c.id}
                                                className="relative flex flex-col items-center px-4"
                                            >
                                                {/* Half horizontal branch line at top */}
                                                {!isOnly && (
                                                    <div
                                                        className={`absolute top-0 h-px bg-border ${
                                                            isFirst
                                                                ? 'left-1/2 right-0'
                                                                : isLast
                                                                  ? 'left-0 right-1/2'
                                                                  : 'left-0 right-0'
                                                        }`}
                                                    />
                                                )}
                                                {/* Vertical drop to card */}
                                                <div className="w-px h-8 bg-border" />
                                                <PersonNode person={c} variant="child" />
                                            </div>
                                        );
                                    })}
                                </div>
                            </>
                        )}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 justify-center mt-6 text-xs text-muted-foreground">
                        {hasParents && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-sm border-2 border-amber-300 bg-amber-50 dark:bg-amber-950 dark:border-amber-700" />
                                Parent
                            </div>
                        )}
                        <div className="flex items-center gap-1.5">
                            <div className="w-3 h-3 rounded-sm border-2 border-blue-400 bg-blue-50 dark:bg-blue-950 dark:border-blue-600" />
                            You
                        </div>
                        {spouse && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-sm border-2 border-rose-300 bg-rose-50 dark:bg-rose-950 dark:border-rose-700" />
                                Spouse
                            </div>
                        )}
                        {hasChildren && (
                            <div className="flex items-center gap-1.5">
                                <div className="w-3 h-3 rounded-sm border-2 border-emerald-300 bg-emerald-50 dark:bg-emerald-950 dark:border-emerald-700" />
                                Child
                            </div>
                        )}
                    </div>

                    {/* OTHER RELATIVES — no tree connection */}
                    {others.length > 0 && (
                        <div className="mt-12">
                            <div className="flex items-center gap-3 mb-6">
                                <div className="flex-1 h-px bg-border" />
                                <p className="text-sm font-medium text-muted-foreground">Other Relatives</p>
                                <div className="flex-1 h-px bg-border" />
                            </div>
                            <div className="flex flex-wrap gap-4 justify-center">
                                {others.map((o) => (
                                    <PersonNode key={o.id} person={o} variant="other" />
                                ))}
                            </div>
                        </div>
                    )}
                </>
            )}
        </MemberLayout>
    );
}
