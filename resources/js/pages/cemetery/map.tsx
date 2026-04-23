import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Navbar5 } from '@/components/navbar5';
import { CemeteryEvent, CemeteryMapPageProps, CemeteryPlot } from '@/types/cemetery';
import CemeteryMapContainer from '@/components/cemetery/cemetery-map-container';
import MapLegend from '@/components/cemetery/map-legend';
import PlotInfoDialog from '@/components/cemetery/plot-info-dialog';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Menu } from 'lucide-react';

export default function CemeteryMap({
    sections,
    plots,
    events,
    mapboxToken,
    centerCoordinates,
    initialZoom,
}: CemeteryMapPageProps) {
    const [open, setOpen] = useState(false);
    const [selectedPlot, setSelectedPlot] = useState<CemeteryPlot | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<CemeteryEvent | null>(null);

    return (
        <>
            <Head title="Cemetery Map">
                <link
                    href="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.css"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen flex flex-col">
                <header className="hidden md:block sticky bg-background top-0 z-50 w-full shadow-lg">
                    <div className="max-w-7xl mx-auto">
                        <Navbar5 />
                    </div>
                </header>

                <main className="flex-1 relative">
                    <div className="absolute inset-0">
                        <CemeteryMapContainer
                            mapboxToken={mapboxToken}
                            center={centerCoordinates}
                            zoom={initialZoom}
                            plots={plots}
                            events={events}
                            onPlotClick={setSelectedPlot}
                            selectedEvent={selectedEvent}
                            onEventClick={setSelectedEvent}
                        />
                    </div>

                    {/* Mobile Drawer */}
                    <Drawer open={open} onOpenChange={setOpen}>
                        <DrawerTrigger asChild>
                            <Button
                                className="md:hidden absolute top-4 left-4 z-20 shadow-lg"
                                size="icon"
                            >
                                <Menu className="h-5 w-5" />
                            </Button>
                        </DrawerTrigger>
                        <DrawerContent className="max-h-[80vh]">
                            <div className="overflow-y-auto p-4">
                                <MapLegend sections={sections} events={events} />
                            </div>
                        </DrawerContent>
                    </Drawer>

                    {/* Desktop: Floating Legend */}
                    <div className="hidden md:block absolute top-4 left-4 z-10 w-72">
                        <MapLegend sections={sections} events={events} />
                    </div>
                </main>
            </div>

            <PlotInfoDialog
                plot={selectedPlot}
                open={selectedPlot !== null}
                onClose={() => setSelectedPlot(null)}
            />
        </>
    );
}
