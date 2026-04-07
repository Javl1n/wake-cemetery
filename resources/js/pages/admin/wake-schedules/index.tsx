import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Badge } from '@/components/ui/badge';
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Menu, Plus, Calendar, CheckCircle, XCircle } from 'lucide-react';
import type { WakeSchedule, WakeRoom, WakePackage, WakeService, InventoryItem } from '@/types/wake';
import AppLayout from '@/layouts/app-layout';
import { format } from 'date-fns';
import ScheduleFormDialog from '@/components/wake/admin/schedule-form-dialog';

interface Deceased {
    id: number;
    date_of_death: string;
    member?: {
        id: number;
        user: {
            name: string;
        };
    };
    beneficiary?: {
        id: number;
        name: string;
    };
}

interface WakeSchedulesPageProps {
    schedules: WakeSchedule[];
    rooms: WakeRoom[];
    packages: WakePackage[];
    services: WakeService[];
    inventoryItems: InventoryItem[];
    deceaseds: Deceased[];
}

const statusColors = {
    pending: 'bg-yellow-500/10 text-yellow-700 border-yellow-500/20',
    confirmed: 'bg-blue-500/10 text-blue-700 border-blue-500/20',
    in_progress: 'bg-purple-500/10 text-purple-700 border-purple-500/20',
    completed: 'bg-green-500/10 text-green-700 border-green-500/20',
    cancelled: 'bg-gray-500/10 text-gray-700 border-gray-500/20',
};

export default function WakeSchedulesIndex({
    schedules,
    rooms,
    packages,
    services,
    inventoryItems,
    deceaseds,
}: WakeSchedulesPageProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [filterStatus, setFilterStatus] = useState<string>('all');
    const [filterRoom, setFilterRoom] = useState<string>('all');
    const [selectedSchedule, setSelectedSchedule] = useState<WakeSchedule | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);

    const filteredSchedules = useMemo(() => {
        return schedules.filter((schedule) => {
            const matchesSearch =
                schedule.deceased.member?.user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                schedule.deceased.beneficiary?.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                schedule.room.name.toLowerCase().includes(searchQuery.toLowerCase());

            const matchesStatus = filterStatus === 'all' || schedule.status === filterStatus;
            const matchesRoom = filterRoom === 'all' || schedule.room_id.toString() === filterRoom;

            return matchesSearch && matchesStatus && matchesRoom;
        });
    }, [schedules, searchQuery, filterStatus, filterRoom]);

    const handleComplete = (schedule: WakeSchedule, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Mark this wake schedule as completed and assign cemetery plot?`)) {
            router.post(`/wake-schedules/${schedule.id}/complete`);
        }
    };

    const handleCancel = (schedule: WakeSchedule, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to cancel this wake schedule?`)) {
            router.delete(`/wake-schedules/${schedule.id}`);
        }
    };

    const handleCloseForm = () => {
        setShowCreateForm(false);
        setSelectedSchedule(null);
    };

    const getDeceasedName = (schedule: WakeSchedule) => {
        if (schedule.deceased.member) {
            return schedule.deceased.member.user.name;
        }
        if (schedule.deceased.beneficiary) {
            return schedule.deceased.beneficiary.name;
        }
        return 'Unknown';
    };

    const ScheduleCard = ({ schedule }: { schedule: WakeSchedule }) => (
        <Card
            className={`cursor-pointer hover:shadow-lg transition-shadow ${
                selectedSchedule?.id === schedule.id ? 'ring-2 ring-primary' : ''
            }`}
            onClick={() => setSelectedSchedule(schedule)}
        >
            <CardContent className="p-4">
                <div className="space-y-2">
                    <div className="flex items-start justify-between">
                        <div className="flex-1">
                            <h3 className="font-semibold text-base">{getDeceasedName(schedule)}</h3>
                            <p className="text-sm text-muted-foreground">{schedule.room.name}</p>
                        </div>
                        <Badge className={statusColors[schedule.status]} variant="outline">
                            {schedule.status.replace('_', ' ')}
                        </Badge>
                    </div>

                    <div className="text-sm space-y-1">
                        <div className="flex items-center gap-2">
                            <Calendar className="h-4 w-4 text-muted-foreground" />
                            <span>
                                {format(new Date(schedule.date_start), 'MMM dd')} -{' '}
                                {format(new Date(schedule.date_end), 'MMM dd, yyyy')}
                            </span>
                        </div>
                        <div className="flex items-center justify-between pt-2 border-t">
                            <span className="text-muted-foreground">Total</span>
                            <span className="font-semibold">
                                ₱{parseFloat(schedule.total_amount.toString()).toLocaleString()}
                            </span>
                        </div>
                    </div>

                    <div className="flex gap-2 pt-2">
                        {schedule.status === 'in_progress' && (
                            <Button
                                size="sm"
                                variant="default"
                                className="flex-1"
                                onClick={(e) => handleComplete(schedule, e)}
                            >
                                <CheckCircle className="h-4 w-4 mr-1" />
                                Complete
                            </Button>
                        )}
                        {schedule.status !== 'completed' && schedule.status !== 'cancelled' && (
                            <Button
                                size="sm"
                                variant="destructive"
                                className="flex-1"
                                onClick={(e) => handleCancel(schedule, e)}
                            >
                                <XCircle className="h-4 w-4 mr-1" />
                                Cancel
                            </Button>
                        )}
                    </div>
                </div>
            </CardContent>
        </Card>
    );

    const ControlPanel = () => (
        <div className="space-y-4">
            {/* Search Card */}
            <Card className="backdrop-blur-sm bg-background/95 shadow-lg">
                <CardHeader>
                    <div className="flex items-center justify-between">
                        <CardTitle>Wake Schedules</CardTitle>
                        <Button size="sm" onClick={() => setShowCreateForm(true)}>
                            <Plus className="h-4 w-4 mr-1" />
                            New
                        </Button>
                    </div>
                </CardHeader>
                <CardContent className="space-y-3">
                    <Input
                        placeholder="Search by name or room..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                    />

                    <div className="grid grid-cols-2 gap-2">
                        <div>
                            <label className="text-xs text-muted-foreground">Status</label>
                            <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={filterStatus}
                                onChange={(e) => setFilterStatus(e.target.value)}
                            >
                                <option value="all">All Status</option>
                                <option value="pending">Pending</option>
                                <option value="confirmed">Confirmed</option>
                                <option value="in_progress">In Progress</option>
                                <option value="completed">Completed</option>
                                <option value="cancelled">Cancelled</option>
                            </select>
                        </div>

                        <div>
                            <label className="text-xs text-muted-foreground">Room</label>
                            <select
                                className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                value={filterRoom}
                                onChange={(e) => setFilterRoom(e.target.value)}
                            >
                                <option value="all">All Rooms</option>
                                {rooms.map((room) => (
                                    <option key={room.id} value={room.id}>
                                        {room.name}
                                    </option>
                                ))}
                            </select>
                        </div>
                    </div>
                </CardContent>
            </Card>

            {/* Schedules List Card */}
            <Card className="backdrop-blur-sm bg-background/95 shadow-lg">
                <CardHeader>
                    <CardTitle className="text-sm">
                        {filteredSchedules.length} Schedule{filteredSchedules.length !== 1 ? 's' : ''}
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <ScrollArea className="h-[calc(100vh-24rem)]">
                        <div className="space-y-3">
                            {filteredSchedules.length > 0 ? (
                                filteredSchedules.map((schedule) => (
                                    <ScheduleCard key={schedule.id} schedule={schedule} />
                                ))
                            ) : (
                                <div className="text-center py-8 text-muted-foreground">
                                    No schedules found
                                </div>
                            )}
                        </div>
                    </ScrollArea>
                </CardContent>
            </Card>
        </div>
    );

    return (
        <AppLayout>
            <Head title="Wake Schedules" />

            <div className="min-h-screen flex flex-col bg-muted/30">
                {/* Calendar/Timeline Background - Placeholder */}
                <div className="absolute inset-0 flex items-center justify-center">
                    <div className="text-center text-muted-foreground">
                        <Calendar className="h-24 w-24 mx-auto mb-4 opacity-20" />
                        <p className="text-lg">Calendar View Coming Soon</p>
                    </div>
                </div>

                {/* Floating Control Panel - Desktop */}
                <div className="hidden md:block absolute top-4 left-4 z-10 w-96 max-h-[calc(100vh-2rem)]">
                    <ControlPanel />
                </div>

                {/* Mobile Drawer */}
                <div className="md:hidden fixed top-4 left-4 z-10">
                    <Drawer open={open} onOpenChange={setOpen}>
                        <DrawerTrigger asChild>
                            <Button size="icon" variant="outline" className="shadow-lg">
                                <Menu className="h-5 w-5" />
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent>
                            <div className="p-4 pb-8">
                                <ControlPanel />
                            </div>
                        </DrawerContent>
                    </Drawer>
                </div>
            </div>

            {/* Form Dialog */}
            <ScheduleFormDialog
                schedule={selectedSchedule}
                open={showCreateForm}
                onClose={handleCloseForm}
                rooms={rooms}
                packages={packages}
                services={services}
                inventoryItems={inventoryItems}
                deceaseds={deceaseds}
            />
        </AppLayout>
    );
}
