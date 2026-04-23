import { Head } from '@inertiajs/react';
import { useRef, useState } from 'react';
import { Navbar5 } from '@/components/navbar5';
import { CemeteryEvent, CemeteryMapPageProps, CemeteryPlot, MapCoordinates } from '@/types/cemetery';
import CemeteryMapContainer from '@/components/cemetery/cemetery-map-container';
import MapLegend from '@/components/cemetery/map-legend';
import MapSearchBar from '@/components/cemetery/map-search-bar';
import PlotInfoDialog from '@/components/cemetery/plot-info-dialog';
import WayfinderPanel from '@/components/cemetery/wayfinder-panel';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Menu } from 'lucide-react';

export default function CemeteryMap({
    sections,
    plots,
    events,
    mapboxToken,
    centerCoordinates,
    entranceCoordinates,
    initialZoom,
}: CemeteryMapPageProps) {
    const [open, setOpen] = useState(false);
    const [selectedPlot, setSelectedPlot] = useState<CemeteryPlot | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<CemeteryEvent | null>(null);
    const [wayfinderPlot, setWayfinderPlot] = useState<CemeteryPlot | null>(null);
    const [wayfinderActive, setWayfinderActive] = useState(false);
    const [userLocation, setUserLocation] = useState<MapCoordinates | null>(null);
    const watchIdRef = useRef<number | null>(null);

    const handleStartNavigation = (plot: CemeteryPlot) => {
        setWayfinderPlot(plot);
        setWayfinderActive(true);
        setSelectedPlot(null);

        if (navigator.geolocation) {
            watchIdRef.current = navigator.geolocation.watchPosition(
                (pos) => setUserLocation({ lat: pos.coords.latitude, lng: pos.coords.longitude }),
                null,
                { enableHighAccuracy: true },
            );
        }
    };

    const handleStopNavigation = () => {
        if (watchIdRef.current !== null) {
            navigator.geolocation.clearWatch(watchIdRef.current);
            watchIdRef.current = null;
        }
        setWayfinderPlot(null);
        setWayfinderActive(false);
        setUserLocation(null);
    };

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
                            wayfinderPlot={wayfinderActive ? wayfinderPlot : null}
                            wayfinderEntrance={entranceCoordinates}
                            onUserLocationUpdate={setUserLocation}
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
                            <div className="overflow-y-auto p-4 space-y-4">
                                <MapSearchBar onPlotSelect={(plot) => { setSelectedPlot(plot); setOpen(false); }} />
                                <MapLegend sections={sections} events={events} />
                            </div>
                        </DrawerContent>
                    </Drawer>

                    {/* Desktop: Floating Legend */}
                    <div className="hidden md:block absolute top-4 left-4 bottom-4 z-10 w-72 overflow-y-auto space-y-4">
                        <MapSearchBar onPlotSelect={setSelectedPlot} />
                        <MapLegend sections={sections} events={events} />
                    </div>

                    {/* Wayfinder Panel */}
                    {wayfinderActive && wayfinderPlot && (
                        <div className="absolute bottom-6 right-4 z-20">
                            <WayfinderPanel
                                plot={wayfinderPlot}
                                userLocation={userLocation}
                                fallbackLocation={entranceCoordinates}
                                onStop={handleStopNavigation}
                            />
                        </div>
                    )}
                </main>
            </div>

            <PlotInfoDialog
                plot={selectedPlot}
                open={selectedPlot !== null}
                onClose={() => setSelectedPlot(null)}
                onNavigate={handleStartNavigation}
            />
        </>
    );
}
