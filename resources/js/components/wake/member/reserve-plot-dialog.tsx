import { router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Badge } from '@/components/ui/badge';
import { ScrollArea } from '@/components/ui/scroll-area';
import { MapPin, CheckCircle2 } from 'lucide-react';
import type { WakeSchedule } from '@/types/wake';

interface AvailablePlot {
    id: number;
    plot_number: string;
}

interface SectionWithPlots {
    id: number;
    name: string;
    code: string;
    color: string;
    plots: AvailablePlot[];
}

interface Props {
    open: boolean;
    onClose: () => void;
    schedule: WakeSchedule;
    availableSections: SectionWithPlots[];
}

export default function ReservePlotDialog({ open, onClose, schedule, availableSections }: Props) {
    const [selectedPlotId, setSelectedPlotId] = useState<number | null>(null);
    const [processing, setProcessing] = useState(false);

    const selectedPlot = availableSections
        .flatMap((s) => s.plots.map((p) => ({ ...p, section: s })))
        .find((p) => p.id === selectedPlotId);

    const handleSubmit = () => {
        if (!selectedPlotId) return;
        setProcessing(true);
        router.post(
            `/member/wake-schedules/${schedule.id}/reserve-plot`,
            { plot_id: selectedPlotId },
            {
                onSuccess: () => {
                    setSelectedPlotId(null);
                    onClose();
                },
                onFinish: () => setProcessing(false),
            },
        );
    };

    const handleClose = () => {
        setSelectedPlotId(null);
        onClose();
    };

    const hasNoPlots = availableSections.length === 0;

    return (
        <Dialog open={open} onOpenChange={(o) => !o && handleClose()}>
            <DialogContent className="max-w-lg max-h-[90vh] flex flex-col overflow-hidden p-0">
                <DialogHeader className="p-6 pb-0">
                    <DialogTitle className="flex items-center gap-2">
                        <MapPin className="h-5 w-5" />
                        Reserve Cemetery Plot
                    </DialogTitle>
                    <DialogDescription>
                        Select an available plot to reserve for the deceased. The plot will be held
                        until burial.
                    </DialogDescription>
                </DialogHeader>

                <ScrollArea className="flex-1 min-h-0 p-6">
                    {hasNoPlots ? (
                        <div className="text-center py-8 text-muted-foreground">
                            <MapPin className="h-10 w-10 mx-auto mb-3 opacity-40" />
                            <p className="text-sm">No available plots at this time.</p>
                            <p className="text-xs mt-1">Please contact our staff for assistance.</p>
                        </div>
                    ) : (
                        <div className="space-y-5">
                            {availableSections.map((section) => (
                                <div key={section.id}>
                                    <div className="flex items-center gap-2 mb-2">
                                        <span
                                            className="inline-block h-3 w-3 rounded-full shrink-0"
                                            style={{ backgroundColor: section.color }}
                                        />
                                        <h3 className="text-sm font-semibold">{section.name}</h3>
                                        <Badge variant="outline" className="text-xs">
                                            {section.plots.length} available
                                        </Badge>
                                    </div>
                                    <div className="flex flex-wrap gap-2">
                                        {section.plots.map((plot) => {
                                            const isSelected = selectedPlotId === plot.id;
                                            return (
                                                <button
                                                    key={plot.id}
                                                    type="button"
                                                    onClick={() =>
                                                        setSelectedPlotId(
                                                            isSelected ? null : plot.id,
                                                        )
                                                    }
                                                    className={`relative rounded-md border px-3 py-1.5 text-sm font-medium transition-colors focus:outline-none focus-visible:ring-2 focus-visible:ring-primary ${
                                                        isSelected
                                                            ? 'border-primary bg-primary text-primary-foreground'
                                                            : 'border-border bg-background hover:bg-muted'
                                                    }`}
                                                >
                                                    {plot.plot_number}
                                                    {isSelected && (
                                                        <CheckCircle2 className="absolute -top-1.5 -right-1.5 h-3.5 w-3.5 text-primary-foreground bg-primary rounded-full" />
                                                    )}
                                                </button>
                                            );
                                        })}
                                    </div>
                                </div>
                            ))}
                        </div>
                    )}
                </ScrollArea>

                {selectedPlot && (
                    <div className="px-6 py-3 border-t bg-muted/30 text-sm">
                        <span className="text-muted-foreground">Selected: </span>
                        <span className="font-semibold">
                            Plot {selectedPlot.plot_number} — {selectedPlot.section.name}
                        </span>
                    </div>
                )}

                <DialogFooter className="px-6 pb-6 pt-3 gap-2">
                    <Button type="button" variant="outline" onClick={handleClose}>
                        Cancel
                    </Button>
                    <Button
                        type="button"
                        disabled={!selectedPlotId || processing || hasNoPlots}
                        onClick={handleSubmit}
                    >
                        {processing ? 'Reserving...' : 'Reserve Plot'}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}
