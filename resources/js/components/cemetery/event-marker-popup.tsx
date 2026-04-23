import { CemeteryEvent } from '@/types/cemetery';

const EVENT_TYPE_LABELS: Record<CemeteryEvent['type'], string> = {
    burial: 'Burial',
    anniversary: 'Anniversary',
    memorial: 'Memorial',
    ceremony: 'Ceremony',
    other: 'Event',
};

interface EventMarkerPopupProps {
    event: CemeteryEvent;
}

export default function EventMarkerPopup({ event }: EventMarkerPopupProps) {
    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });

    return (
        <div className="min-w-[200px] max-w-[260px] p-1 text-sm">
            <div className="flex items-center gap-2 mb-2">
                <div
                    className="w-3 h-3 rounded-full flex-shrink-0"
                    style={{ backgroundColor: event.color }}
                />
                <span className="text-xs font-medium uppercase tracking-wide text-muted-foreground">
                    {EVENT_TYPE_LABELS[event.type]}
                </span>
            </div>
            <p className="font-semibold text-base leading-tight mb-2">{event.title}</p>
            {event.description && (
                <p className="text-muted-foreground text-xs mb-2">{event.description}</p>
            )}
            <div className="text-xs text-muted-foreground space-y-0.5">
                <div>
                    <span className="font-medium">Starts:</span> {formatDate(event.starts_at)}
                </div>
                {event.ends_at && (
                    <div>
                        <span className="font-medium">Ends:</span> {formatDate(event.ends_at)}
                    </div>
                )}
            </div>
        </div>
    );
}
