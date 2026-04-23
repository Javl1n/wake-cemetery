import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Separator } from '@/components/ui/separator';
import { CemeterySection } from '@/types/cemetery';
import { AlertTriangle, CalendarDays, MapPin, X } from 'lucide-react';

export type PlotStatus = 'available' | 'occupied' | 'reserved' | 'maintenance';
export type EventType = 'burial' | 'anniversary' | 'memorial' | 'ceremony' | 'other';

const PLOT_STATUS_OPTIONS: { value: PlotStatus; label: string; color: string; icon?: 'triangle' }[] = [
    { value: 'available', label: 'Available', color: '#22c55e' },
    { value: 'occupied', label: 'Occupied', color: '#6b7280' },
    { value: 'reserved', label: 'Reserved', color: '#3b82f6' },
    { value: 'maintenance', label: 'Maintenance', color: '#f97316', icon: 'triangle' },
];

const EVENT_TYPE_OPTIONS: { value: EventType; label: string }[] = [
    { value: 'burial', label: 'Burial' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'memorial', label: 'Memorial' },
    { value: 'ceremony', label: 'Ceremony' },
    { value: 'other', label: 'Other' },
];

export interface MapFilterState {
    selectedSections: number[];
    selectedStatuses: PlotStatus[];
    showEvents: boolean;
    selectedEventTypes: EventType[];
    dateRange: { from: string; to: string };
}

export const defaultFilterState: MapFilterState = {
    selectedSections: [],
    selectedStatuses: [],
    showEvents: true,
    selectedEventTypes: [],
    dateRange: { from: '', to: '' },
};

interface MapFiltersProps {
    sections: CemeterySection[];
    filters: MapFilterState;
    onChange: (filters: MapFilterState) => void;
    onClose: () => void;
}

export default function MapFilters({ sections, filters, onChange, onClose }: MapFiltersProps) {
    const update = (partial: Partial<MapFilterState>) => onChange({ ...filters, ...partial });

    const toggleSection = (id: number) => {
        const next = filters.selectedSections.includes(id)
            ? filters.selectedSections.filter((s) => s !== id)
            : [...filters.selectedSections, id];
        update({ selectedSections: next });
    };

    const toggleStatus = (status: PlotStatus) => {
        const next = filters.selectedStatuses.includes(status)
            ? filters.selectedStatuses.filter((s) => s !== status)
            : [...filters.selectedStatuses, status];
        update({ selectedStatuses: next });
    };

    const toggleEventType = (type: EventType) => {
        const next = filters.selectedEventTypes.includes(type)
            ? filters.selectedEventTypes.filter((t) => t !== type)
            : [...filters.selectedEventTypes, type];
        update({ selectedEventTypes: next });
    };

    const hasActiveFilters =
        filters.selectedSections.length > 0 ||
        filters.selectedStatuses.length > 0 ||
        !filters.showEvents ||
        filters.selectedEventTypes.length > 0 ||
        filters.dateRange.from !== '' ||
        filters.dateRange.to !== '';

    return (
        <Card className="backdrop-blur-sm bg-background/95 shadow-lg">
            <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                    <CardTitle className="text-base">Filters</CardTitle>
                    <div className="flex items-center gap-2">
                        {hasActiveFilters && (
                            <Button
                                variant="ghost"
                                size="sm"
                                className="h-7 px-2 text-xs text-muted-foreground"
                                onClick={() => onChange(defaultFilterState)}
                            >
                                Clear all
                            </Button>
                        )}
                        <Button variant="ghost" size="icon" className="h-7 w-7" onClick={onClose}>
                            <X className="h-4 w-4" />
                        </Button>
                    </div>
                </div>
            </CardHeader>

            <CardContent className="space-y-4 pt-0">
                {/* Section Filters */}
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Sections
                    </p>
                    <div className="space-y-1.5 max-h-36 overflow-y-auto">
                        {sections.map((section) => (
                            <div key={section.id} className="flex items-center gap-2">
                                <Checkbox
                                    id={`section-${section.id}`}
                                    checked={
                                        filters.selectedSections.length === 0 ||
                                        filters.selectedSections.includes(section.id)
                                    }
                                    onCheckedChange={() => toggleSection(section.id)}
                                />
                                <label
                                    htmlFor={`section-${section.id}`}
                                    className="flex items-center gap-1.5 text-sm cursor-pointer"
                                >
                                    <span
                                        className="w-2.5 h-2.5 rounded-full shrink-0"
                                        style={{ backgroundColor: section.color }}
                                    />
                                    {section.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Plot Status Filters */}
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Plot Status
                    </p>
                    <div className="grid grid-cols-2 gap-1.5">
                        {PLOT_STATUS_OPTIONS.map((opt) => (
                            <div key={opt.value} className="flex items-center gap-2">
                                <Checkbox
                                    id={`status-${opt.value}`}
                                    checked={
                                        filters.selectedStatuses.length === 0 ||
                                        filters.selectedStatuses.includes(opt.value)
                                    }
                                    onCheckedChange={() => toggleStatus(opt.value)}
                                />
                                <label
                                    htmlFor={`status-${opt.value}`}
                                    className="flex items-center gap-1.5 text-sm cursor-pointer"
                                >
                                    {opt.icon === 'triangle' ? (
                                        <AlertTriangle
                                            size={12}
                                            fill={opt.color}
                                            stroke="white"
                                            strokeWidth={1}
                                            className="shrink-0"
                                        />
                                    ) : (
                                        <MapPin
                                            size={12}
                                            fill={opt.color}
                                            stroke="white"
                                            strokeWidth={1}
                                            className="shrink-0"
                                        />
                                    )}
                                    {opt.label}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                <Separator />

                {/* Event Filters */}
                <div>
                    <div className="flex items-center gap-2 mb-2">
                        <Checkbox
                            id="show-events"
                            checked={filters.showEvents}
                            onCheckedChange={(checked) => update({ showEvents: !!checked })}
                        />
                        <label
                            htmlFor="show-events"
                            className="flex items-center gap-1.5 text-xs font-semibold text-muted-foreground uppercase tracking-wide cursor-pointer"
                        >
                            <CalendarDays size={12} />
                            Active Events
                        </label>
                    </div>

                    {filters.showEvents && (
                        <div className="grid grid-cols-2 gap-1.5 pl-6">
                            {EVENT_TYPE_OPTIONS.map((opt) => (
                                <div key={opt.value} className="flex items-center gap-2">
                                    <Checkbox
                                        id={`event-${opt.value}`}
                                        checked={
                                            filters.selectedEventTypes.length === 0 ||
                                            filters.selectedEventTypes.includes(opt.value)
                                        }
                                        onCheckedChange={() => toggleEventType(opt.value)}
                                    />
                                    <label
                                        htmlFor={`event-${opt.value}`}
                                        className="text-sm cursor-pointer capitalize"
                                    >
                                        {opt.label}
                                    </label>
                                </div>
                            ))}
                        </div>
                    )}
                </div>

                <Separator />

                {/* Burial Date Range */}
                <div>
                    <p className="text-xs font-semibold text-muted-foreground uppercase tracking-wide mb-2">
                        Burial Date Range
                    </p>
                    <div className="space-y-1.5">
                        <div className="flex items-center gap-2">
                            <Label className="text-xs w-7 shrink-0">From</Label>
                            <Input
                                type="date"
                                className="h-7 text-xs"
                                value={filters.dateRange.from}
                                onChange={(e) =>
                                    update({ dateRange: { ...filters.dateRange, from: e.target.value } })
                                }
                            />
                        </div>
                        <div className="flex items-center gap-2">
                            <Label className="text-xs w-7 shrink-0">To</Label>
                            <Input
                                type="date"
                                className="h-7 text-xs"
                                value={filters.dateRange.to}
                                onChange={(e) =>
                                    update({ dateRange: { ...filters.dateRange, to: e.target.value } })
                                }
                            />
                        </div>
                    </div>
                </div>
            </CardContent>
        </Card>
    );
}
