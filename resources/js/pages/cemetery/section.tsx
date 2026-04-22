import { Head, Link } from '@inertiajs/react';
import { useState } from 'react';
import { Navbar5 } from '@/components/navbar5';
import { CemeterySectionPageProps, CemeteryPlot } from '@/types/cemetery';
import CemeteryPlotStatusBadge from '@/components/cemetery/cemetery-plot-status-badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { ArrowLeft, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

const plotStatusStyles: Record<CemeteryPlot['status'], string> = {
    available: 'bg-green-50 border-green-300 hover:bg-green-100 text-green-800',
    occupied: 'bg-slate-200 border-slate-400 hover:bg-slate-300 text-slate-700',
    reserved: 'bg-blue-50 border-blue-300 hover:bg-blue-100 text-blue-800',
    maintenance: 'bg-orange-50 border-orange-300 hover:bg-orange-100 text-orange-800',
};

const selectedPlotStatusStyles: Record<CemeteryPlot['status'], string> = {
    available: 'ring-2 ring-green-500',
    occupied: 'ring-2 ring-slate-600',
    reserved: 'ring-2 ring-blue-500',
    maintenance: 'ring-2 ring-orange-500',
};

export default function CemeterySection({ section, plots }: CemeterySectionPageProps) {
    const [selectedPlot, setSelectedPlot] = useState<CemeteryPlot | null>(null);

    const totalCount = plots.length;
    const occupiedCount = plots.filter((p) => p.status === 'occupied').length;
    const availableCount = plots.filter((p) => p.status === 'available').length;
    const reservedCount = plots.filter((p) => p.status === 'reserved').length;
    const maintenanceCount = plots.filter((p) => p.status === 'maintenance').length;

    return (
        <>
            <Head title={`${section.name} — Cemetery`} />

            <div className="min-h-screen flex flex-col bg-background">
                <header className="sticky bg-background top-0 z-50 w-full shadow-sm border-b">
                    <div className="max-w-7xl mx-auto">
                        <Navbar5 />
                    </div>
                </header>

                <main className="flex-1 max-w-7xl mx-auto w-full px-4 sm:px-6 py-6 space-y-6">
                    {/* Top bar */}
                    <div className="flex items-center gap-4">
                        <Link href="/cemetery/map">
                            <Button variant="ghost" size="sm" className="gap-2">
                                <ArrowLeft className="h-4 w-4" />
                                Back to Map
                            </Button>
                        </Link>
                        <div className="flex items-center gap-3">
                            <div
                                className="w-5 h-5 rounded-full flex-shrink-0 border border-white shadow-sm"
                                style={{ backgroundColor: section.color }}
                            />
                            <h1 className="text-2xl font-bold">{section.name}</h1>
                            <span className="text-muted-foreground text-sm font-mono">{section.code}</span>
                        </div>
                    </div>

                    {/* Stats row */}
                    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
                        <StatCard label="Total Plots" value={totalCount} />
                        <StatCard label="Occupied" value={occupiedCount} color="text-slate-600" />
                        <StatCard label="Available" value={availableCount} color="text-green-600" />
                        <StatCard label="Reserved" value={reservedCount} color="text-blue-600" />
                    </div>

                    {section.description && (
                        <p className="text-muted-foreground text-sm">{section.description}</p>
                    )}

                    {/* Grid + Detail Panel */}
                    <div className="flex flex-col lg:flex-row gap-6">
                        {/* Plot Grid */}
                        <div className="flex-1">
                            {plots.length === 0 ? (
                                <p className="text-muted-foreground text-sm">No plots in this section.</p>
                            ) : (
                                <div className="grid grid-cols-6 sm:grid-cols-8 lg:grid-cols-10 gap-1.5">
                                    {plots.map((plot) => (
                                        <button
                                            key={plot.id}
                                            title={plot.plot_number}
                                            onClick={() =>
                                                setSelectedPlot(
                                                    selectedPlot?.id === plot.id ? null : plot,
                                                )
                                            }
                                            className={[
                                                'aspect-square rounded border-2 flex flex-col items-center justify-center p-0.5 transition-colors cursor-pointer',
                                                plotStatusStyles[plot.status],
                                                selectedPlot?.id === plot.id
                                                    ? selectedPlotStatusStyles[plot.status]
                                                    : '',
                                            ].join(' ')}
                                        >
                                            <span className="text-[9px] font-semibold leading-tight text-center break-all line-clamp-2">
                                                {plot.plot_number}
                                            </span>
                                        </button>
                                    ))}
                                </div>
                            )}

                            {/* Legend */}
                            <div className="mt-4 flex flex-wrap gap-4 text-xs text-muted-foreground">
                                <LegendItem color="bg-green-100 border-green-300" label="Available" />
                                <LegendItem color="bg-slate-200 border-slate-400" label="Occupied" />
                                <LegendItem color="bg-blue-100 border-blue-300" label="Reserved" />
                                <LegendItem color="bg-orange-100 border-orange-300" label={`Maintenance${maintenanceCount > 0 ? ` (${maintenanceCount})` : ''}`} />
                            </div>
                        </div>

                        {/* Plot Detail Panel */}
                        {selectedPlot && (
                            <Card className="lg:w-72 flex-shrink-0 self-start">
                                <CardHeader className="pb-2">
                                    <div className="flex items-start justify-between">
                                        <CardTitle className="text-lg">{selectedPlot.plot_number}</CardTitle>
                                        <Button
                                            variant="ghost"
                                            size="icon"
                                            className="h-7 w-7 -mt-1 -mr-1"
                                            onClick={() => setSelectedPlot(null)}
                                        >
                                            <X className="h-4 w-4" />
                                        </Button>
                                    </div>
                                    <CemeteryPlotStatusBadge status={selectedPlot.status} />
                                </CardHeader>
                                <CardContent className="space-y-3 text-sm">
                                    <div>
                                        <span className="text-muted-foreground">Section:</span>{' '}
                                        <span className="font-medium">{section.name}</span>
                                    </div>

                                    {selectedPlot.deceased && (
                                        <>
                                            <Separator />
                                            <div className="space-y-1.5">
                                                <div>
                                                    <span className="text-muted-foreground">Deceased:</span>{' '}
                                                    <span className="font-medium">{selectedPlot.deceased.name}</span>
                                                </div>
                                                <div>
                                                    <span className="text-muted-foreground">Date of Death:</span>{' '}
                                                    <span>{selectedPlot.deceased.date_of_death}</span>
                                                </div>
                                                {selectedPlot.burial_date && (
                                                    <div>
                                                        <span className="text-muted-foreground">Burial Date:</span>{' '}
                                                        <span>{selectedPlot.burial_date}</span>
                                                    </div>
                                                )}
                                            </div>
                                        </>
                                    )}

                                    {selectedPlot.beneficiary && (
                                        <>
                                            <Separator />
                                            <div>
                                                <span className="text-muted-foreground">Reserved by:</span>{' '}
                                                <span className="font-medium">{selectedPlot.beneficiary.name}</span>
                                            </div>
                                        </>
                                    )}

                                    {selectedPlot.notes && selectedPlot.status === 'maintenance' && (
                                        <>
                                            <Separator />
                                            <div className="text-xs text-orange-700 dark:text-orange-400 bg-orange-50 dark:bg-orange-950 rounded p-2">
                                                {selectedPlot.notes}
                                            </div>
                                        </>
                                    )}
                                </CardContent>
                            </Card>
                        )}
                    </div>
                </main>
            </div>
        </>
    );
}

function StatCard({
    label,
    value,
    color = 'text-foreground',
}: {
    label: string;
    value: number;
    color?: string;
}) {
    return (
        <Card>
            <CardContent className="pt-4 pb-3">
                <div className={`text-2xl font-bold ${color}`}>{value}</div>
                <div className="text-xs text-muted-foreground mt-0.5">{label}</div>
            </CardContent>
        </Card>
    );
}

function LegendItem({ color, label }: { color: string; label: string }) {
    return (
        <div className="flex items-center gap-1.5">
            <div className={`w-3.5 h-3.5 rounded border-2 flex-shrink-0 ${color}`} />
            <span>{label}</span>
        </div>
    );
}
