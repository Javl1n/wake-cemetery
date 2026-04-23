import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Separator } from '@/components/ui/separator';
import { Button } from '@/components/ui/button';
import { ExternalLink, Navigation } from 'lucide-react';
import { show as showObituary } from '@/routes/obituary';
import CemeteryPlotStatusBadge from '@/components/cemetery/cemetery-plot-status-badge';
import type { CemeteryPlot } from '@/types/cemetery';

interface PlotInfoDialogProps {
    plot: CemeteryPlot | null;
    open: boolean;
    onClose: () => void;
    onNavigate?: (plot: CemeteryPlot) => void;
}

export default function PlotInfoDialog({ plot, open, onClose, onNavigate }: PlotInfoDialogProps) {
    if (!plot) {
        return null;
    }

    return (
        <Dialog open={open} onOpenChange={(o) => !o && onClose()}>
            <DialogContent className="max-w-sm">
                <DialogHeader>
                    <DialogTitle>Plot {plot.plot_number}</DialogTitle>
                </DialogHeader>

                <div className="space-y-3 text-sm">
                    <div className="flex items-center gap-2">
                        <span
                            className="inline-block h-3 w-3 rounded-full shrink-0"
                            style={{ backgroundColor: plot.section.color }}
                        />
                        <span className="text-muted-foreground">Section:</span>
                        <span className="font-medium">{plot.section.name}</span>
                    </div>

                    <div className="flex items-center gap-2">
                        <span className="text-muted-foreground">Status:</span>
                        <CemeteryPlotStatusBadge status={plot.status} />
                    </div>

                    {plot.description && (
                        <div className="flex items-start gap-2">
                            <span className="text-muted-foreground shrink-0">Landmark:</span>
                            <span>{plot.description}</span>
                        </div>
                    )}

                    {plot.deceased && (
                        <>
                            <Separator />
                            <div className="space-y-2">
                                <div>
                                    <span className="text-muted-foreground">Deceased: </span>
                                    <span className="font-medium">{plot.deceased.name}</span>
                                </div>
                                <div>
                                    <span className="text-muted-foreground">Date of Death: </span>
                                    <span>{plot.deceased.date_of_death}</span>
                                </div>
                                {plot.burial_date && (
                                    <div>
                                        <span className="text-muted-foreground">Burial Date: </span>
                                        <span>{plot.burial_date}</span>
                                    </div>
                                )}
                                {plot.deceased.obituary_token && (
                                    <a
                                        href={showObituary.url(plot.deceased.obituary_token)}
                                        target="_blank"
                                        rel="noopener noreferrer"
                                        className="inline-flex items-center gap-1 text-primary hover:underline"
                                    >
                                        <ExternalLink className="h-3 w-3" />
                                        View Obituary
                                    </a>
                                )}
                            </div>
                        </>
                    )}

                    {plot.beneficiary && (
                        <>
                            <Separator />
                            <div>
                                <span className="text-muted-foreground">Reserved by: </span>
                                <span className="font-medium">{plot.beneficiary.name}</span>
                            </div>
                        </>
                    )}

                    {plot.notes && (
                        <>
                            <Separator />
                            <p className="text-xs text-muted-foreground bg-muted rounded p-2">
                                {plot.notes}
                            </p>
                        </>
                    )}

                    {onNavigate && (
                        <>
                            <Separator />
                            <Button className="w-full" onClick={() => onNavigate(plot)}>
                                <Navigation className="h-4 w-4" />
                                Navigate to Plot
                            </Button>
                        </>
                    )}
                </div>
            </DialogContent>
        </Dialog>
    );
}
