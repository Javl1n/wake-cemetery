import { Head, Link, router } from '@inertiajs/react';
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
import {
    AlertTriangle,
    CalendarCheck,
    CheckCircle2,
    MapPin,
    Package,
    Wrench,
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
    maintenance: number;
}

interface WakeService {
    id: number;
    name: string;
    pivot: { status: string; fee: number };
}

interface PendingSchedule {
    id: number;
    status: string;
    date_start: string;
    date_end: string;
    deceased: {
        beneficiary?: { name: string; relationship: string } | null;
    };
    room: { name: string };
    services: WakeService[];
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

interface MaintenancePlot {
    id: number;
    plot_number: string;
    notes: string | null;
    section: { name: string; color: string };
}

interface Props {
    scheduleStats: ScheduleStats;
    memberCount: number;
    plotStats: PlotStats;
    lowStockCount: number;
    recentSchedules: RecentSchedule[];
    activeRooms: ActiveRoom[];
    pendingServices: PendingSchedule[];
    maintenancePlots: MaintenancePlot[];
}

const scheduleStatusColors: Record<string, string> = {
    pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    confirmed: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    in_progress: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    completed: 'bg-green-500/10 text-green-700 border-green-500/20',
    cancelled: 'bg-gray-500/10 text-gray-500 border-gray-500/20',
};

function completeService(scheduleId: number, serviceId: number) {
    router.patch(`/wake-schedules/${scheduleId}/services/${serviceId}/complete`, {}, {
        preserveScroll: true,
    });
}

export default function StaffDashboard({
    scheduleStats,
    memberCount,
    plotStats,
    lowStockCount,
    recentSchedules,
    activeRooms,
    pendingServices,
    maintenancePlots,
}: Props) {
    const totalPendingServiceCount = pendingServices.reduce(
        (sum, s) => sum + s.services.length,
        0,
    );

    return (
        <AppLayout breadcrumbs={breadcrumbs}>
            <Head title="Dashboard" />
            <div className="flex flex-1 flex-col gap-6 p-6">

                {/* Header */}
                <div>
                    <h1 className="text-2xl font-bold tracking-tight">Staff Dashboard</h1>
                    <p className="text-muted-foreground text-sm mt-1">Your operational overview for today</p>
                </div>

                {/* Stats row */}
                <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                                <CalendarCheck className="h-4 w-4 text-purple-500" />
                                Active Schedules
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{scheduleStats.active}</p>
                            <p className="text-muted-foreground mt-1 text-xs">currently in progress</p>
                        </CardContent>
                    </Card>

                    <Card className={totalPendingServiceCount > 0 ? 'border-yellow-300 bg-yellow-50 dark:bg-yellow-950 dark:border-yellow-800' : ''}>
                        <CardHeader className="pb-2">
                            <CardTitle className={`flex items-center gap-2 text-sm font-medium ${totalPendingServiceCount > 0 ? 'text-yellow-700 dark:text-yellow-400' : 'text-muted-foreground'}`}>
                                <CheckCircle2 className="h-4 w-4 text-yellow-500" />
                                Pending Services
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{totalPendingServiceCount}</p>
                            <p className="text-muted-foreground mt-1 text-xs">services to complete</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="pb-2">
                            <CardTitle className="text-muted-foreground flex items-center gap-2 text-sm font-medium">
                                <MapPin className="h-4 w-4 text-green-500" />
                                Plots Available
                            </CardTitle>
                        </CardHeader>
                        <CardContent>
                            <p className="text-3xl font-bold">{plotStats.available}</p>
                            <p className="text-muted-foreground mt-1 text-xs">of {plotStats.total} total</p>
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

                {/* Maintenance alert strip */}
                {plotStats.maintenance > 0 && (
                    <div className="rounded-lg border border-orange-300 bg-orange-50 dark:bg-orange-950 dark:border-orange-800 px-4 py-3 flex items-center justify-between">
                        <div className="flex items-center gap-2 text-orange-700 dark:text-orange-400">
                            <Wrench className="h-5 w-5 shrink-0" />
                            <span className="font-medium">
                                {plotStats.maintenance} plot{plotStats.maintenance !== 1 ? 's' : ''} require maintenance
                            </span>
                        </div>
                        <Link href="/cemetery-maintenance">
                            <Button variant="outline" size="sm" className="border-orange-400 text-orange-700 hover:bg-orange-100 dark:hover:bg-orange-900">
                                View Map
                            </Button>
                        </Link>
                    </div>
                )}

                <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
                    {/* Pending services */}
                    <Card className="lg:col-span-2">
                        <CardHeader className="flex flex-row items-center justify-between">
                            <div>
                                <CardTitle>Pending Services</CardTitle>
                                <CardDescription>Active schedules with incomplete services</CardDescription>
                            </div>
                            <Link href="/wake-schedules">
                                <Button variant="outline" size="sm">All Schedules</Button>
                            </Link>
                        </CardHeader>
                        <CardContent>
                            {pendingServices.length === 0 ? (
                                <div className="py-8 text-center">
                                    <CheckCircle2 className="mx-auto h-8 w-8 text-green-500 mb-2" />
                                    <p className="text-muted-foreground text-sm">All services are up to date.</p>
                                </div>
                            ) : (
                                <div className="space-y-4">
                                    {pendingServices.map((schedule) => (
                                        <div key={schedule.id} className="rounded-lg border p-4">
                                            <div className="mb-3 flex items-start justify-between">
                                                <div>
                                                    <p className="font-medium text-sm">
                                                        {schedule.deceased.beneficiary?.name ?? 'Unknown'}
                                                    </p>
                                                    <p className="text-muted-foreground text-xs">
                                                        {schedule.room.name} · {format(new Date(schedule.date_start), 'MMM dd')}
                                                        {' – '}
                                                        {format(new Date(schedule.date_end), 'MMM dd, yyyy')}
                                                    </p>
                                                </div>
                                                <Badge
                                                    variant="outline"
                                                    className={`text-xs ${scheduleStatusColors[schedule.status] ?? ''}`}
                                                >
                                                    {schedule.status.replace('_', ' ')}
                                                </Badge>
                                            </div>
                                            <div className="space-y-2">
                                                {schedule.services.map((service) => (
                                                    <div key={service.id} className="flex items-center justify-between rounded bg-muted/40 px-3 py-2 text-sm">
                                                        <span>{service.name}</span>
                                                        <Button
                                                            size="sm"
                                                            variant="outline"
                                                            className="h-7 text-xs"
                                                            onClick={() => completeService(schedule.id, service.id)}
                                                        >
                                                            <CheckCircle2 className="mr-1 h-3 w-3" />
                                                            Mark Done
                                                        </Button>
                                                    </div>
                                                ))}
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            )}
                        </CardContent>
                    </Card>

                    {/* Right column */}
                    <div className="space-y-6">
                        {/* Wake rooms */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Wake Rooms</CardTitle>
                                <CardDescription>Current occupancy</CardDescription>
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

                        {/* Maintenance plots */}
                        {maintenancePlots.length > 0 && (
                            <Card className="border-orange-200 dark:border-orange-800">
                                <CardHeader>
                                    <CardTitle className="text-base flex items-center gap-2 text-orange-700 dark:text-orange-400">
                                        <Wrench className="h-4 w-4" />
                                        Maintenance Required
                                    </CardTitle>
                                    <CardDescription>
                                        {maintenancePlots.length} plot{maintenancePlots.length !== 1 ? 's' : ''} flagged
                                    </CardDescription>
                                </CardHeader>
                                <CardContent>
                                    <div className="divide-y">
                                        {maintenancePlots.map((plot) => (
                                            <div key={plot.id} className="py-2 space-y-0.5">
                                                <div className="flex items-center justify-between">
                                                    <div className="flex items-center gap-1.5">
                                                        <div
                                                            className="w-2 h-2 rounded-full shrink-0"
                                                            style={{ backgroundColor: plot.section.color }}
                                                        />
                                                        <span className="text-sm font-medium">{plot.plot_number}</span>
                                                    </div>
                                                    <span className="text-xs text-muted-foreground">{plot.section.name}</span>
                                                </div>
                                                {plot.notes && (
                                                    <p className="text-xs text-muted-foreground truncate pl-3.5">{plot.notes}</p>
                                                )}
                                            </div>
                                        ))}
                                    </div>
                                    <div className="mt-3">
                                        <Link href="/cemetery-maintenance">
                                            <Button variant="outline" size="sm" className="w-full text-xs">
                                                <MapPin className="mr-1.5 h-3 w-3" />
                                                Open Maintenance Map
                                            </Button>
                                        </Link>
                                    </div>
                                </CardContent>
                            </Card>
                        )}

                        {/* Recent schedules */}
                        <Card>
                            <CardHeader>
                                <CardTitle className="text-base">Recent Schedules</CardTitle>
                            </CardHeader>
                            <CardContent>
                                {recentSchedules.length === 0 ? (
                                    <p className="text-muted-foreground text-sm">No schedules yet.</p>
                                ) : (
                                    <div className="divide-y">
                                        {recentSchedules.map((schedule) => (
                                            <div key={schedule.id} className="py-2.5">
                                                <div className="flex items-center justify-between">
                                                    <p className="truncate text-sm font-medium">
                                                        {schedule.deceased.beneficiary?.name ?? 'Unknown'}
                                                    </p>
                                                    <Badge
                                                        variant="outline"
                                                        className={`ml-2 shrink-0 text-xs ${scheduleStatusColors[schedule.status] ?? ''}`}
                                                    >
                                                        {schedule.status.replace('_', ' ')}
                                                    </Badge>
                                                </div>
                                                <p className="text-muted-foreground text-xs">
                                                    {schedule.room.name} · {format(new Date(schedule.date_start), 'MMM dd, yyyy')}
                                                </p>
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
                                <Link href="/cemetery/map">
                                    <Button variant="outline" className="w-full justify-start" size="sm">
                                        <MapPin className="mr-2 h-4 w-4" />
                                        Cemetery Map
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
