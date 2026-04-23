import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CemeteryEvent, CemeterySection } from '@/types/cemetery';
import { CalendarDays } from 'lucide-react';

const EVENT_TYPE_LABELS: Record<CemeteryEvent['type'], string> = {
    burial: 'Burial',
    anniversary: 'Anniversary',
    memorial: 'Memorial',
    ceremony: 'Ceremony',
    other: 'Event',
};

interface MapLegendProps {
    sections: CemeterySection[];
    events?: CemeteryEvent[];
}

export default function MapLegend({ sections, events = [] }: MapLegendProps) {
    return (
        <Card className="backdrop-blur-sm bg-background/95 shadow-lg">
            <CardHeader>
                <CardTitle className="text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                    {sections.map((section) => (
                        <div key={section.id} className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full flex-shrink-0"
                                style={{ backgroundColor: section.color }}
                            />
                            <div className="flex-1">
                                <div className="text-sm font-medium">{section.name}</div>
                                <div className="text-xs text-muted-foreground">
                                    {section.occupied_plots_count || 0} /{' '}
                                    {section.plots_count || 0} occupied
                                </div>
                            </div>
                        </div>
                    ))}
                </div>

                {events.length > 0 && (
                    <div>
                        <p className="text-xs font-semibold uppercase tracking-wide text-muted-foreground mb-2">
                            Active Events
                        </p>
                        <div className="space-y-2">
                            {events.map((event) => (
                                <div key={event.id} className="flex items-start gap-2">
                                    <div
                                        className="w-6 h-6 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                        style={{ backgroundColor: event.color }}
                                    >
                                        <CalendarDays size={12} stroke="white" strokeWidth={2} />
                                    </div>
                                    <div className="flex-1 min-w-0">
                                        <div className="text-sm font-medium leading-tight truncate">
                                            {event.title}
                                        </div>
                                        <div className="text-xs text-muted-foreground">
                                            {EVENT_TYPE_LABELS[event.type]}
                                        </div>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
