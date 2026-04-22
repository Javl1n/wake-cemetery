import { Head, Link } from '@inertiajs/react';
import { format } from 'date-fns';
import AppLayout from '@/layouts/app-layout';
import type { BreadcrumbItem } from '@/types';
import { dashboard } from '@/routes';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import {
    Card,
    CardContent,
    CardDescription,
    CardHeader,
    CardTitle,
} from '@/components/ui/card';
import * as staffRoutes from '@/routes/staff';
import {
    AlertTriangle,
    CalendarCheck,
    MapPin,
    Package,
    Users,
    UserCog,
} from 'lucide-react';

const breadcrumbs: BreadcrumbItem[] = [
    { title: 'Dashboard', href: dashboard().url },
];

interface ScheduleStats {
    total: number;
    pending: number;
    active: number;
    completed: number;
    cancelled: number;
}

interface PlotStats {
    total: number;
    available: number;
    occupied: number;
    reserved: number;
}

interface RecentSchedule {
    id: number;
    status: string;
    date_start: string;
    date_end: string;
    total_amount: string;
    deceased: {
        beneficiary?: { name: string; relationship: string } | null;
    };
    room: { name: string };
    package: { name: string };
}

interface ActiveRoom {
    id: number;
    name: string;
    status: string;
    capacity: number;
    active_count: number;
}

interface Props {
    scheduleStats: ScheduleStats;
    memberCount: number;
    plotStats: PlotStats;
    lowStockCount: number;
    recentSchedules: RecentSchedule[];
    activeRooms: ActiveRoom[];
}

const scheduleStatusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    confirmed: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    in_progress: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    completed: 'bg-green-500/10 text-green-700 border-green-500/20',
    cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

export default function AdminDashboard({
    scheduleStats,
    memberCount,
    plotStats,
    lowStockCount,
    recentSchedules,
    activeRooms,
}: Props) {
    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Admin Dashboard</h1>
                    <p className="text-muted-foreground text-sm mt-1">Overview of all operations</p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                                <Users className="h-4 w-4 text-blue-500" />
                                Members
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{memberCount}</p>
                            <p className="text-muted-foreground mt-1 text-xs">registered members</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                                <CalendarCheck className="h-4 w-4 text-purple-500" />
                                Wake Schedules
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{scheduleStats.total}</p>
                            <p className="text-muted-foreground mt-1 text-xs">
                                {scheduleStats.pending} pending · {scheduleStats.active} active
                            </p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                                <MapPin className="h-4 w-4 text-green-500" />
                                Cemetery Plots
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{plotStats.available}</p>
                            <p className="text-muted-foreground mt-1 text-xs">
                                of {plotStats.total} available
                            </p>
                        </CardContent>
                    </Card>

                    <Card className={lowStockCount > 0 ? 'border-orange-300 bg-orange-50 dark:bg-orange-950 dark:border-orange-800' : ''}>
                        <CardHeader className="pb-2">
                            <CardTitle className={`flex items-center gap-2 text-sm font-medium ${lowStockCount > 0 ? 'text-orange-700 dark:text-orange-400' : 'text-muted-foreground'}`}>
                                {lowStockCount > 0
                                    ? <AlertTriangle className="h-4 w-4 text-orange-500" />
                                    : <Package className="h-4 w-4 text-orange-500" />
                                }
                                Low Stock
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{lowStockCount}</p>
                            <p className="text-muted-foreground mt-1 text-xs">items low on stock</p>
                        </CardContent>
                    </Card>
                </div>

                {/* Schedule breakdown */}
                <div className="grid grid-cols-4 gap-3">
                    {[
                        { label: 'Pending', value: scheduleStats.pending, color: 'text-yellow-600' },
                        { label: 'Active', value: scheduleStats.active, color: 'text-purple-600' },
                        { label: 'Completed', value: scheduleStats.completed, color: 'text-green-600' },
                        { label: 'Cancelled', value: scheduleStats.cancelled, color: 'text-gray-500' },
                    ].map(({ label, value, color }) => (
                        <div key={label} className="rounded-lg border bg-card p-3 text-center">
                            <p className={`text-2xl font-bold ${color}`}>{value}</p>
                            <p className="text-muted-foreground text-xs">{label}</p>
                        </div>
                    ))}
                </div>

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Recent schedules */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Recent Wake Schedules</CardTitle>
                                <CardDescription>Latest arrangements</CardDescription>
                            </div>
                            <Link href="/wake-schedules">
                                <Button variant="outline" size="sm">View All</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {recentSchedules.length === 0 ? (
                                <p className="text-muted-foreground py-6 text-center text-sm">No schedules yet.</p>
                            ) : (
                                <div className="divide-y">
                                    {recentSchedules.map((schedule) => (
                                        <div key={schedule.id} className="flex items-center justify-between py-3">
                                            <div className="min-w-0 flex-1">
                                                <p className="truncate text-sm font-medium">
                                                    {schedule.deceased.beneficiary?.name ?? 'Unknown'}
                                                </p>
                                                <p className="text-muted-foreground text-xs">
                                                    {schedule.room.name} · {schedule.package.name}
                                                </p>
                                                <p className="text-muted-foreground text-xs">
                                                    {format(new Date(schedule.date_start), 'MMM dd')}
                                                    {' – '}
                                                    {format(new Date(schedule.date_end), 'MMM dd, yyyy')}
                                                </p>
                                            </div>
                                            <div className="ml-3 flex flex-col items-end gap-1">
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${scheduleStatusColors[schedule.status] ?? ''}`}
                                                >
                                                    {schedule.status.replace('_', ' ')}
                                                </Badge>
                                                <span className="text-xs font-medium">
                                                    ₱{Number(schedule.total_amount).toLocaleString()}
                                                </span>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right column */}
                    <div className="space-y-6">
                        {/* Cemetery plot breakdown */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Cemetery Plots</CardTitle>
                            </CardHeader>
                            <CardContent className="space-y-3">
                                {[
                                    { label: 'Available', value: plotStats.available, color: 'bg-green-500' },
                                    { label: 'Occupied', value: plotStats.occupied, color: 'bg-gray-400' },
                                    { label: 'Reserved', value: plotStats.reserved, color: 'bg-blue-400' },
                                ].map(({ label, value, color }) => (
                                    <div key={label} className="flex items-center justify-between text-sm">
                                        <div className="flex items-center gap-2">
                                            <span className={`h-2.5 w-2.5 rounded-full ${color}`} />
                                            <span className="text-muted-foreground">{label}</span>
                                        </div>
                                        <span className="font-medium">{value}</span>
                                    </div>
                                ))}
                                <div className="mt-2 flex flex-col gap-2">
                                    <Link href="/cemetery-plots">
                                        <Button variant="outline" size="sm" className="w-full">Manage Plots</Button>
                                    </Link>
                                    <Link href="/cemetery/map">
                                        <Button variant="ghost" size="sm" className="w-full">View Map</Button>
                                    </Link>
                                </div>
                            </CardContent>
                        </Card>

                        {/* Wake rooms */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Wake Rooms</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {activeRooms.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">No rooms configured.</p>
                                ) : (
                                    <div className="divide-y">
                                        {activeRooms.map((room) => (
                                            <div key={room.id} className="flex items-center justify-between py-2 text-sm">
                                                <span className="font-medium">{room.name}</span>
                                                <Badge
                                                    variant="outline"
                                                    className={room.active_count > 0
                                                        ? 'bg-purple-500/10 text-purple-700 border-purple-500/20 text-xs'
                                                        : 'bg-green-500/10 text-green-700 border-green-500/20 text-xs'
                                                    }
                                                >
                                                    {room.active_count > 0 ? 'In Use' : 'Available'}
                                                </Badge>
                                            </div>
                                        ))}
                                    </div>
                                )}
                            </CardContent>
                        </Card>

                        {/* Quick links */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Quick Links</CardTitle>
                            </CardHeader>
                            <CardContent className="flex flex-col gap-2">
                                <Link href="/wake-schedules">
                                    <Button variant="outline" className="w-full justify-start" size="sm">
                                        <CalendarCheck className="mr-2 h-4 w-4" />
                                        Wake Schedules
                                    </Button>
                                </Link>
                                <Link href="/inventory-items">
                                    <Button variant="outline" className="w-full justify-start" size="sm">
                                        <Package className="mr-2 h-4 w-4" />
                                        Inventory
                                    </Button>
                                </Link>
                                <Link href="/cemetery-sections">
                                    <Button variant="outline" className="w-full justify-start" size="sm">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        Cemetery Sections
                                    </Button>
                                </Link>
                                <Link href={staffRoutes.index().url}>
                                    <Button variant="outline" className="w-full justify-start" size="sm">
                                        <UserCog className="mr-2 h-4 w-4" />
                                        Staff Management
                                    </Button>
                                </Link>
                            </CardContent>
                        </Card>
                    </div>
                </div>
            </div>
        </AppLayout>
    );
}
