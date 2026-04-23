import { AlertTriangle, CheckCircle2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { CemeteryPlot } from '@/types/cemetery';

interface PlotDetailPopupProps {
    plot: CemeteryPlot;
    showAdminActions?: boolean;
    onFlagMaintenance?: (plot: CemeteryPlot) => void;
    onResolveMaintenance?: (plot: CemeteryPlot) => void;
}

export default function PlotDetailPopup({
    plot,
    showAdminActions = false,
    onFlagMaintenance,
    onResolveMaintenance,
}: PlotDetailPopupProps) {
    return (
        <div className="p-2 min-w-[250px]">
            <h3 className="font-bold text-lg mb-2">{plot.plot_number}</h3>

            <div className="space-y-2 text-sm">
                <div>
                    <span className="text-muted-foreground">Section:</span>{' '}
                    <span className="font-medium">{plot.section.name}</span>
                </div>

                {plot.deceased && (
                    <>
                        <Separator />
                        <div>
                            <span className="text-muted-foreground">
                                Deceased:
                            </span>{' '}
                            <span className="font-medium">
                                {plot.deceased.name}
                            </span>
                        </div>
                        <div>
                            <span className="text-muted-foreground">
                                Date of Death:
                            </span>{' '}
                            <span>{plot.deceased.date_of_death}</span>
                        </div>
                        {plot.burial_date && (
                            <div>
                                <span className="text-muted-foreground">
                                    Burial Date:
                                </span>{' '}
                                <span>{plot.burial_date}</span>
                            </div>
                        )}
                    </>
                )}

                <div>
                    <span className="text-muted-foreground">Status:</span>{' '}
                    <span className="capitalize font-medium">
                        {plot.status}
                    </span>
                </div>

                {plot.description && (
                    <div>
                        <span className="text-muted-foreground">Landmark:</span>{' '}
                        <span>{plot.description}</span>
                    </div>
                )}

                {showAdminActions && (
                    <>
                        <Separator />
                        {plot.status === 'maintenance' ? (
                            <div className="space-y-2">
                                {plot.notes && (
                                    <div className="text-xs text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950 rounded p-2">
                                        {plot.notes}
                                    </div>
                                )}
                                <Button
                                    size="sm"
                                    variant="outline"
                                    className="w-full border-green-500 text-green-700 hover:bg-green-50 dark:hover:bg-green-950"
                                    onClick={() => onResolveMaintenance?.(plot)}
                                >
                                    <CheckCircle2 className="h-4 w-4 mr-2" />
                                    Resolve Maintenance
                                </Button>
                            </div>
                        ) : (
                            <Button
                                size="sm"
                                variant="outline"
                                className="w-full border-orange-400 text-orange-700 hover:bg-orange-50 dark:hover:bg-orange-950"
                                onClick={() => onFlagMaintenance?.(plot)}
                            >
                                <AlertTriangle className="h-4 w-4 mr-2" />
                                Flag for Maintenance
                            </Button>
                        )}
                    </>
                )}
            </div>
        </div>
    );
}
