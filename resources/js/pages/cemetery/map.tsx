import { Head } from '@inertiajs/react';
import { useMemo, useRef, useState } from 'react';
import { Navbar5 } from '@/components/navbar5';
import { CemeteryEvent, CemeteryMapPageProps, CemeteryPlot, MapCoordinates } from '@/types/cemetery';
import CemeteryMapContainer from '@/components/cemetery/cemetery-map-container';
import MapLegend from '@/components/cemetery/map-legend';
import MapSearchBar from '@/components/cemetery/map-search-bar';
import MapFilters, { defaultFilterState, MapFilterState } from '@/components/cemetery/map-filters';
import PlotInfoDialog from '@/components/cemetery/plot-info-dialog';
import WayfinderPanel from '@/components/cemetery/wayfinder-panel';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { Menu, SlidersHorizontal } from 'lucide-react';

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
    const [filtersOpen, setFiltersOpen] = useState(false);
    const [filters, setFilters] = useState<MapFilterState>(defaultFilterState);
    const [selectedPlot, setSelectedPlot] = useState<CemeteryPlot | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<CemeteryEvent | null>(null);
    const [wayfinderPlot, setWayfinderPlot] = useState<CemeteryPlot | null>(null);
    const [wayfinderActive, setWayfinderActive] = useState(false);
    const [userLocation, setUserLocation] = useState<MapCoordinates | null>(null);
    const watchIdRef = useRef<number | null>(null);

    const activeFilterCount = useMemo(() => {
        let count = 0;
        if (filters.selectedSections.length > 0) count++;
        if (filters.selectedStatuses.length > 0) count++;
        if (!filters.showEvents) count++;
        if (filters.selectedEventTypes.length > 0) count++;
        if (filters.dateRange.from || filters.dateRange.to) count++;
        return count;
    }, [filters]);

    const filteredPlots = useMemo(() => {
        return plots.filter((plot) => {
            if (filters.selectedSections.length > 0 && !filters.selectedSections.includes(plot.section.id)) {
                return false;
            }
            if (filters.selectedStatuses.length > 0 && !filters.selectedStatuses.includes(plot.status)) {
                return false;
            }
            if (filters.dateRange.from || filters.dateRange.to) {
                if (!plot.burial_date) return false;
                if (filters.dateRange.from && plot.burial_date < filters.dateRange.from) return false;
                if (filters.dateRange.to && plot.burial_date > filters.dateRange.to) return false;
            }
            return true;
        });
    }, [plots, filters]);

    const filteredEvents = useMemo(() => {
        if (!filters.showEvents) return [];
        if (filters.selectedEventTypes.length === 0) return events;
        return events.filter((event) => filters.selectedEventTypes.includes(event.type));
    }, [events, filters]);

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

    const filterPanel = (
        <MapFilters
            sections={sections}
            filters={filters}
            onChange={setFilters}
            onClose={() => setFiltersOpen(false)}
        />
    );

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
                            plots={filteredPlots}
                            events={filteredEvents}
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
                                {filterPanel}
                                <MapLegend sections={sections} events={filteredEvents} />
                            </div>
                        </DrawerContent>
                    </Drawer>

                    {/* Desktop: Floating Sidebar */}
                    <div className="hidden md:flex absolute top-4 left-4 bottom-4 z-10 w-72 flex-col gap-3 overflow-y-auto">
                        <MapSearchBar onPlotSelect={setSelectedPlot} />

                        <Button
                            variant="outline"
                            className="w-full justify-between bg-background/95 backdrop-blur-sm shadow-lg"
                            onClick={() => setFiltersOpen((v) => !v)}
                        >
                            <span className="flex items-center gap-2">
                                <SlidersHorizontal className="h-4 w-4" />
                                Filters
                            </span>
                            {activeFilterCount > 0 && (
                                <Badge variant="secondary" className="ml-auto">
                                    {activeFilterCount}
                                </Badge>
                            )}
                        </Button>

                        {filtersOpen && filterPanel}

                        <MapLegend sections={sections} events={filteredEvents} />
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
