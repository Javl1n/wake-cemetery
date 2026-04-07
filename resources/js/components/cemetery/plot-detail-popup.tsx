import { CemeteryPlot } from '@/types/cemetery';
import { Separator } from '@/components/ui/separator';

interface PlotDetailPopupProps {
    plot: CemeteryPlot;
}

export default function PlotDetailPopup({ plot }: PlotDetailPopupProps) {
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
            </div>
        </div>
    );
}
