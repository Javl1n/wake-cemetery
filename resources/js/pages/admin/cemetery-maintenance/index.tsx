import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { AlertTriangle, CheckCircle2, Menu, Plus } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from '@/components/ui/drawer';
import CemeteryMapContainer from '@/components/cemetery/cemetery-map-container';
import FlagMaintenanceDialog from '@/components/cemetery/admin/flag-maintenance-dialog';
import CreateMaintenancePinDialog from '@/components/cemetery/admin/create-maintenance-pin-dialog';
import type { CemeterySection, CemeteryPlot, MaintenancePin, MapCoordinates } from '@/types/cemetery';
import AppLayout from '@/layouts/app-layout';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface CemeteryMaintenancePageProps {
    sections: CemeterySection[];
    plots: CemeteryPlot[];
    maintenancePins: MaintenancePin[];
    mapboxToken: string;
    centerCoordinates: { lat: number; lng: number };
    initialZoom: number;
}

export default function CemeteryMaintenanceIndex({
    sections,
    plots,
    maintenancePins,
    mapboxToken,
    centerCoordinates,
    initialZoom,
}: CemeteryMaintenancePageProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedPlot, setSelectedPlot] = useState<CemeteryPlot | null>(null);
    const [maintenancePinCoords, setMaintenancePinCoords] = useState<MapCoordinates | null>(null);
    const [flagMaintenancePlot, setFlagMaintenancePlot] = useState<CemeteryPlot | null>(null);

    const maintenancePlots = useMemo(
        () => plots.filter((p) => p.status === 'maintenance'),
        [plots],
    );

    const filteredMaintenancePlots = useMemo(
        () =>
            maintenancePlots.filter((p) =>
                p.plot_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                p.section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (p.notes && p.notes.toLowerCase().includes(searchQuery.toLowerCase())),
            ),
        [maintenancePlots, searchQuery],
    );

    const filteredMaintenancePins = useMemo(
        () =>
            maintenancePins.filter((pin) =>
                pin.label.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (pin.section && pin.section.name.toLowerCase().includes(searchQuery.toLowerCase())) ||
                (pin.notes && pin.notes.toLowerCase().includes(searchQuery.toLowerCase())),
            ),
        [maintenancePins, searchQuery],
    );

    const handleResolvePin = (pin: MaintenancePin) => {
        router.patch(`/maintenance-pins/${pin.id}/resolve`, {}, { preserveScroll: true });
    };

    const handleDeletePin = (pin: MaintenancePin) => {
        router.delete(`/maintenance-pins/${pin.id}`, { preserveScroll: true });
    };

    const handleFlagMaintenance = (plot: CemeteryPlot) => {
        setSelectedPlot(null);
        setFlagMaintenancePlot(plot);
    };

    const handleResolveMaintenance = (plot: CemeteryPlot) => {
        router.patch(
            `/cemetery-plots/${plot.id}/resolve-maintenance`,
            {},
            { preserveScroll: true, onSuccess: () => setSelectedPlot(null) },
        );
    };

    const MaintenancePlotList = ({ onSelect }: { onSelect?: () => void }) => (
        <div className="space-y-2">
            {filteredMaintenancePlots.length === 0 && filteredMaintenancePins.length === 0 ? (
                <div className="py-8 text-center">
                    <CheckCircle2 className="mx-auto h-8 w-8 text-green-500 mb-2" />
                    <p className="text-muted-foreground text-sm">No maintenance flags.</p>
                </div>
            ) : (
                <>
                    {filteredMaintenancePlots.map((plot) => (
                        <Card
                            key={`plot-${plot.id}`}
                            className="backdrop-blur-sm bg-background/95 hover:bg-accent/20 cursor-pointer transition-colors border-orange-200 dark:border-orange-800"
                            onClick={() => {
                                setSelectedPlot(plot);
                                onSelect?.();
                            }}
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
                                            <span className="font-medium">{plot.plot_number}</span>
                                        </div>
                                        <div className="flex items-center gap-2">
                                            <div
                                                className="w-2 h-2 rounded-full shrink-0"
                                                style={{ backgroundColor: plot.section.color }}
                                            />
                                            <span className="text-xs text-muted-foreground">
                                                {plot.section.name}
                                            </span>
                                        </div>
                                        {plot.notes && (
                                            <p className="text-xs text-muted-foreground truncate">
                                                {plot.notes}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="shrink-0 border-green-500 text-green-700 hover:bg-green-50 dark:hover:bg-green-950 text-xs"
                                        onClick={(e) => {
                                            e.stopPropagation();
                                            handleResolveMaintenance(plot);
                                            onSelect?.();
                                        }}
                                    >
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Resolve
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}

                    {filteredMaintenancePins.map((pin) => (
                        <Card
                            key={`pin-${pin.id}`}
                            className="backdrop-blur-sm bg-background/95 border-orange-200 dark:border-orange-800"
                        >
                            <CardContent className="p-4">
                                <div className="flex items-start justify-between gap-3">
                                    <div className="flex-1 min-w-0 space-y-1">
                                        <div className="flex items-center gap-2">
                                            <AlertTriangle className="h-4 w-4 text-orange-500 shrink-0" />
                                            <span className="font-medium">{pin.label}</span>
                                        </div>
                                        {pin.section && (
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-2 h-2 rounded-full shrink-0"
                                                    style={{ backgroundColor: pin.section.color }}
                                                />
                                                <span className="text-xs text-muted-foreground">
                                                    {pin.section.name}
                                                </span>
                                            </div>
                                        )}
                                        {pin.notes && (
                                            <p className="text-xs text-muted-foreground truncate">
                                                {pin.notes}
                                            </p>
                                        )}
                                    </div>
                                    <Button
                                        size="sm"
                                        variant="outline"
                                        className="shrink-0 border-green-500 text-green-700 hover:bg-green-50 dark:hover:bg-green-950 text-xs"
                                        onClick={() => {
                                            handleResolvePin(pin);
                                            onSelect?.();
                                        }}
                                    >
                                        <CheckCircle2 className="h-3 w-3 mr-1" />
                                        Resolve
                                    </Button>
                                </div>
                            </CardContent>
                        </Card>
                    ))}
                </>
            )}
        </div>
    );

    return (
        <AppLayout>
            <Head title="Cemetery Maintenance">
                <link
                    href="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.css"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen flex flex-col">
                {/* Full Screen Map — always in maintenance mode */}
                <div className="absolute inset-0">
                    <CemeteryMapContainer
                        plots={plots}
                        maintenancePins={maintenancePins}
                        mapboxToken={mapboxToken}
                        center={centerCoordinates}
                        zoom={initialZoom}
                        selectedPlot={selectedPlot}
                        onPlotClick={setSelectedPlot}
                        placementMode={true}
                        onEmptyMapClick={setMaintenancePinCoords}
                        showAdminActions={true}
                        onFlagMaintenance={handleFlagMaintenance}
                        onResolveMaintenance={handleResolveMaintenance}
                    />
                </div>

                {/* Floating Control Panel - Desktop */}
                <div className="hidden md:block absolute top-4 left-4 z-10 w-96 max-h-[calc(100vh-2rem)] overflow-y-auto space-y-4">
                    <Card className="backdrop-blur-sm bg-background/95 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle>
                                    <SidebarTrigger className="my-auto" />
                                    <span className="my-auto">Maintenance</span>
                                </CardTitle>
                                <div className="flex items-center gap-2">
                                    <span className="text-xs text-muted-foreground">
                                        {maintenancePlots.length + maintenancePins.length} flagged
                                    </span>
                                    <Button
                                        size="sm"
                                        className="bg-orange-500 hover:bg-orange-600"
                                        onClick={() => setMaintenancePinCoords(centerCoordinates)}
                                    >
                                        <Plus className="h-4 w-4 mr-1" />
                                        Pin
                                    </Button>
                                </div>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            <div className="rounded-md bg-orange-50 dark:bg-orange-950 border border-orange-200 dark:border-orange-800 px-3 py-2 text-xs text-orange-700 dark:text-orange-300 flex items-center gap-2">
                                <AlertTriangle className="h-3.5 w-3.5 shrink-0" />
                                Click anywhere on the map to pin a new maintenance location
                            </div>
                            <Input
                                placeholder="Search by plot, section, or notes..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    <ScrollArea className="h-[calc(100vh-18rem)]">
                        <MaintenancePlotList />
                    </ScrollArea>
                </div>

                {/* Mobile Drawer */}
                <Drawer open={open} onOpenChange={setOpen}>
                    <DrawerTrigger asChild>
                        <Button className="md:hidden absolute top-4 left-4 z-20 shadow-lg" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[80vh]">
                        <div className="overflow-y-auto p-4 space-y-4">
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Maintenance</CardTitle>
                                        <Button
                                            size="sm"
                                            className="bg-orange-500 hover:bg-orange-600"
                                            onClick={() => {
                                                setMaintenancePinCoords(centerCoordinates);
                                                setOpen(false);
                                            }}
                                        >
                                            <Plus className="h-4 w-4 mr-1" />
                                            Pin
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Input
                                        placeholder="Search by plot, section, or notes..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </CardContent>
                            </Card>
                            <MaintenancePlotList onSelect={() => setOpen(false)} />
                        </div>
                    </DrawerContent>
                </Drawer>

                {/* Flag Maintenance Dialog */}
                {flagMaintenancePlot && (
                    <FlagMaintenanceDialog
                        plot={flagMaintenancePlot}
                        open={true}
                        onClose={() => setFlagMaintenancePlot(null)}
                    />
                )}

                {/* Create Maintenance Pin Dialog */}
                <CreateMaintenancePinDialog
                    coordinates={maintenancePinCoords}
                    sections={sections}
                    open={maintenancePinCoords !== null}
                    onClose={() => setMaintenancePinCoords(null)}
                />
            </div>
        </AppLayout>
    );
}
