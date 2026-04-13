import { useState, useMemo } from 'react';
import {
    format,
    startOfMonth,
    endOfMonth,
    eachDayOfInterval,
    startOfWeek,
    endOfWeek,
    isSameDay,
    isSameMonth,
    addMonths,
    subMonths,
    isWithinInterval,
    parseISO,
    startOfDay,
    endOfDay,
} from 'date-fns';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import type { WakeSchedule } from '@/types/wake';

interface WakeCalendarProps {
    schedules: WakeSchedule[];
    selectedSchedule: WakeSchedule | null;
    onSelectSchedule: (schedule: WakeSchedule) => void;
}

const statusEventStyle: Record<string, string> = {
    pending: 'bg-yellow-500/15 text-yellow-700 border-yellow-500/30 hover:bg-yellow-500/25',
    confirmed: 'bg-blue-500/15 text-blue-700 border-blue-500/30 hover:bg-blue-500/25',
    in_progress: 'bg-purple-500/15 text-purple-700 border-purple-500/30 hover:bg-purple-500/25',
    completed: 'bg-green-500/15 text-green-700 border-green-500/30 hover:bg-green-500/25',
    cancelled: 'bg-gray-500/15 text-gray-500 border-gray-500/30 hover:bg-gray-500/25',
};

const statusDotStyle: Record<string, string> = {
    pending: 'bg-yellow-500',
    confirmed: 'bg-blue-500',
    in_progress: 'bg-purple-500',
    completed: 'bg-green-500',
    cancelled: 'bg-gray-400',
};

const WEEK_DAYS = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

function getDeceasedName(schedule: WakeSchedule): string {
    if (schedule.deceased.member) return schedule.deceased.member.user.name;
    if (schedule.deceased.beneficiary) return schedule.deceased.beneficiary.name;
    return 'Unknown';
}

export default function WakeCalendar({ schedules, selectedSchedule, onSelectSchedule }: WakeCalendarProps) {
    const [currentMonth, setCurrentMonth] = useState(new Date());

    const calendarDays = useMemo(() => {
        const monthStart = startOfMonth(currentMonth);
        const monthEnd = endOfMonth(currentMonth);
        return eachDayOfInterval({
            start: startOfWeek(monthStart),
            end: endOfWeek(monthEnd),
        });
    }, [currentMonth]);

    const getSchedulesForDay = (day: Date) =>
        schedules.filter((schedule) =>
            isWithinInterval(day, {
                start: startOfDay(parseISO(schedule.date_start)),
                end: endOfDay(parseISO(schedule.date_end)),
            }),
        );

    return (
        <Card className="backdrop-blur-sm bg-background/95 shadow-lg">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle>{format(currentMonth, 'MMMM yyyy')}</CardTitle>
                    <div className="flex items-center gap-1">
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setCurrentMonth(subMonths(currentMonth, 1))}
                        >
                            <ChevronLeft className="h-4 w-4" />
                        </Button>
                        <Button size="sm" variant="outline" onClick={() => setCurrentMonth(new Date())}>
                            Today
                        </Button>
                        <Button
                            size="icon"
                            variant="outline"
                            onClick={() => setCurrentMonth(addMonths(currentMonth, 1))}
                        >
                            <ChevronRight className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="px-3 pb-4">
                {/* Day-of-week headers */}
                <div className="grid grid-cols-7 mb-1">
                    {WEEK_DAYS.map((d) => (
                        <div key={d} className="text-center text-xs font-medium text-muted-foreground py-1">
                            {d}
                        </div>
                    ))}
                </div>

                {/* Calendar grid */}
                <div className="grid grid-cols-7 gap-px bg-border rounded-lg overflow-hidden">
                    {calendarDays.map((day) => {
                        const daySchedules = getSchedulesForDay(day);
                        const isToday = isSameDay(day, new Date());
                        const isCurrentMonth = isSameMonth(day, currentMonth);

                        return (
                            <div
                                key={day.toISOString()}
                                className={`min-h-[88px] p-1 bg-background ${!isCurrentMonth ? 'opacity-40' : ''}`}
                            >
                                <div
                                    className={`text-xs font-medium w-6 h-6 flex items-center justify-center rounded-full mb-1 ${
                                        isToday
                                            ? 'bg-primary text-primary-foreground'
                                            : 'text-foreground'
                                    }`}
                                >
                                    {format(day, 'd')}
                                </div>

                                <div className="space-y-0.5">
                                    {daySchedules.slice(0, 3).map((schedule) => (
                                        <button
                                            key={schedule.id}
                                            onClick={() => onSelectSchedule(schedule)}
                                            className={`w-full text-left text-xs px-1 py-0.5 rounded truncate border transition-colors ${
                                                statusEventStyle[schedule.status]
                                            } ${selectedSchedule?.id === schedule.id ? 'ring-1 ring-primary ring-offset-0' : ''}`}
                                        >
                                            {getDeceasedName(schedule)}
                                        </button>
                                    ))}
                                    {daySchedules.length > 3 && (
                                        <p className="text-xs text-muted-foreground px-1">
                                            +{daySchedules.length - 3} more
                                        </p>
                                    )}
                                </div>
                            </div>
                        );
                    })}
                </div>

                {/* Legend */}
                <div className="flex flex-wrap gap-x-4 gap-y-1.5 mt-3">
                    {Object.entries(statusDotStyle).map(([status, dotClass]) => (
                        <div key={status} className="flex items-center gap-1.5">
                            <span className={`inline-block w-2 h-2 rounded-full ${dotClass}`} />
                            <span className="text-xs text-muted-foreground capitalize">
                                {status.replace('_', ' ')}
                            </span>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
