import { Head } from '@inertiajs/react';
import { useState } from 'react';
import { Navbar5 } from '@/components/navbar5';
import { Footer7 } from '@/components/footer7';
import { CemeteryMapPageProps, CemeteryPlot } from '@/types/cemetery';
import CemeteryMapContainer from '@/components/cemetery/cemetery-map-container';
import MapSearchBar from '@/components/cemetery/map-search-bar';
import MapFilters from '@/components/cemetery/map-filters';
import MapLegend from '@/components/cemetery/map-legend';
import { Button } from '@/components/ui/button';
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Menu } from 'lucide-react';

export default function CemeteryMap({
    sections,
    plots,
    mapboxToken,
    centerCoordinates,
    initialZoom,
}: CemeteryMapPageProps) {
    const [filteredPlots, setFilteredPlots] = useState<CemeteryPlot[]>(plots);
    const [selectedSections, setSelectedSections] = useState<number[]>([]);
    const [dateRange, setDateRange] = useState<{
        from: Date | null;
        to: Date | null;
    }>({
        from: null,
        to: null,
    });
    const [selectedPlot, setSelectedPlot] = useState<CemeteryPlot | null>(null);
    const [open, setOpen] = useState(false);

    // Filter logic
    const applyFilters = () => {
        let filtered = [...plots];

        // Filter by sections
        if (selectedSections.length > 0) {
            filtered = filtered.filter((plot) =>
                selectedSections.includes(plot.section.id),
            );
        }

        // Filter by date range
        if (dateRange.from || dateRange.to) {
            filtered = filtered.filter((plot) => {
                if (!plot.burial_date) {
                    return false;
                }
                const burialDate = new Date(plot.burial_date);
                if (dateRange.from && burialDate < dateRange.from) {
                    return false;
                }
                if (dateRange.to && burialDate > dateRange.to) {
                    return false;
                }
                return true;
            });
        }

        setFilteredPlots(filtered);
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
                {/* Header - Hidden on mobile for full screen map */}
                <header className="hidden md:block sticky bg-background top-0 z-50 w-full shadow-lg">
                    <div className="mx-auto max-w-7xl px-6">
                        <Navbar5 />
                    </div>
                </header>

                <main className="flex-1 relative">
                    {/* Full Screen Map */}
                    <div className="absolute inset-0">
                        <CemeteryMapContainer
                            plots={filteredPlots}
                            mapboxToken={mapboxToken}
                            center={centerCoordinates}
                            zoom={initialZoom}
                            selectedPlot={selectedPlot}
                            onPlotClick={setSelectedPlot}
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
                                <MapSearchBar
                                    onPlotSelect={(plot) => {
                                        setSelectedPlot(plot);
                                        setOpen(false);
                                    }}
                                />
                                <MapFilters
                                    sections={sections}
                                    selectedSections={selectedSections}
                                    onSectionChange={setSelectedSections}
                                    dateRange={dateRange}
                                    onDateRangeChange={setDateRange}
                                    onApplyFilters={() => {
                                        applyFilters();
                                        setOpen(false);
                                    }}
                                />
                                <MapLegend sections={sections} />
                            </div>
                        </DrawerContent>
                    </Drawer>

                    {/* Desktop: Floating Controls */}
                    <div className="hidden md:block absolute top-0 left-4 py-4 z-10 w-80 max-h-full overflow-y-auto space-y-4">
                        <MapSearchBar
                            onPlotSelect={(plot) => setSelectedPlot(plot)}
                        />
                        <MapFilters
                            sections={sections}
                            selectedSections={selectedSections}
                            onSectionChange={setSelectedSections}
                            dateRange={dateRange}
                            onDateRangeChange={setDateRange}
                            onApplyFilters={applyFilters}
                        />
                        <MapLegend sections={sections} />
                    </div>
                </main>

                {/* <footer className="bg-background shadow-lg"> */}
                {/*     <div className="mx-auto max-w-7xl px-6 py-10"> */}
                {/*         <Footer7 /> */}
                {/*     </div> */}
                {/* </footer> */}
            </div>
        </>
    );
}
