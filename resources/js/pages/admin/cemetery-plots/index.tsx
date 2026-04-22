import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Menu, Plus, Edit, Trash2 } from 'lucide-react';
import CemeteryMapContainer from '@/components/cemetery/cemetery-map-container';
import CemeteryPlotStatusBadge from '@/components/cemetery/cemetery-plot-status-badge';
import PlotFormDialog from '@/components/cemetery/admin/plot-form-dialog';
import type { CemeterySection, CemeteryPlot } from '@/types/cemetery';
import AppLayout from '@/layouts/app-layout';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface CemeteryPlotsPageProps {
    sections: CemeterySection[];
    plots: CemeteryPlot[];
    deceased: Array<{ id: number; name: string; date_of_death: string }>;
    mapboxToken: string;
    centerCoordinates: { lat: number; lng: number };
    initialZoom: number;
}

export default function CemeteryPlotsIndex({
    sections,
    plots,
    deceased,
    mapboxToken,
    centerCoordinates,
    initialZoom,
}: CemeteryPlotsPageProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSection, setSelectedSection] = useState<string>('all');
    const [selectedStatus, setSelectedStatus] = useState<string>('all');
    const [selectedPlot, setSelectedPlot] = useState<CemeteryPlot | null>(null);
    const [showCreateForm, setShowCreateForm] = useState(false);
    const [selectedPlotForEdit, setSelectedPlotForEdit] = useState<CemeteryPlot | null>(null);

    const filteredPlots = useMemo(() => {
        return plots.filter((plot) => {
            const matchesSearch =
                plot.plot_number.toLowerCase().includes(searchQuery.toLowerCase()) ||
                (plot.deceased?.name &&
                    plot.deceased.name.toLowerCase().includes(searchQuery.toLowerCase()));

            const matchesSection =
                selectedSection === 'all' ||
                plot.section.id === parseInt(selectedSection);

            const matchesStatus =
                selectedStatus === 'all' || plot.status === selectedStatus;

            return matchesSearch && matchesSection && matchesStatus;
        });
    }, [plots, searchQuery, selectedSection, selectedStatus]);

    const handleEdit = (plot: CemeteryPlot, e: React.MouseEvent) => {
        e.stopPropagation();
        setSelectedPlotForEdit(plot);
        setShowCreateForm(true);
    };

    const handleDelete = (plot: CemeteryPlot, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete plot ${plot.plot_number}?`)) {
            router.delete(`/cemetery-plots/${plot.id}`);
        }
    };

    const flyToPlot = (plot: CemeteryPlot) => {
        setSelectedPlot(plot);
    };

    const handleCloseForm = () => {
        setShowCreateForm(false);
        setSelectedPlotForEdit(null);
    };

    return (
        <AppLayout>
            <Head title="Manage Cemetery Plots">
                <link
                    href="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.css"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-[calc(100vh-120px)] flex flex-col">
                {/* Full Screen Map */}
                <div className="absolute inset-0">
                    <CemeteryMapContainer
                        plots={filteredPlots}
                        mapboxToken={mapboxToken}
                        center={centerCoordinates}
                        zoom={initialZoom}
                        selectedPlot={selectedPlot}
                        onPlotClick={(plot) => setSelectedPlot(plot)}
                    />
                </div>

                {/* Floating Control Panel - Desktop */}
                <div className="hidden md:block absolute top-4 left-4 z-10 w-96 max-h-[calc(100vh-2rem)] overflow-y-auto space-y-4">
                    {/* Header Card */}
                    <Card className="backdrop-blur-sm bg-background/95 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="">
                                    <SidebarTrigger className="my-auto" />
                                    <span className="my-auto">Cemetery Plots</span>
                                </CardTitle>
                                <Button size="sm" onClick={() => setShowCreateForm(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                            {/* Search */}
                            <Input
                                placeholder="Search plot number or deceased..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />

                            {/* Filter by Section */}
                            <Select value={selectedSection} onValueChange={setSelectedSection}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Sections" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Sections</SelectItem>
                                    {sections.map((section) => (
                                        <SelectItem key={section.id} value={section.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full"
                                                    style={{ backgroundColor: section.color }}
                                                />
                                                {section.name}
                                            </div>
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>

                            {/* Filter by Status */}
                            <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                <SelectTrigger>
                                    <SelectValue placeholder="All Statuses" />
                                </SelectTrigger>
                                <SelectContent>
                                    <SelectItem value="all">All Statuses</SelectItem>
                                    <SelectItem value="available">Available</SelectItem>
                                    <SelectItem value="occupied">Occupied</SelectItem>
                                    <SelectItem value="reserved">Reserved</SelectItem>
                                    <SelectItem value="maintenance">Maintenance</SelectItem>
                                </SelectContent>
                            </Select>
                        </CardContent>
                    </Card>

                    {/* Plots List Card */}
                    <ScrollArea className="h-[calc(100vh-22rem)]">
                        <div className="space-y-2">
                            {filteredPlots.map((plot) => (
                                <Card
                                    key={plot.id}
                                    className="backdrop-blur-sm bg-background/95 hover:bg-accent/20 cursor-pointer transition-colors"
                                    onClick={() => flyToPlot(plot)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-start justify-between gap-3">
                                            <div className="flex-1 space-y-1">
                                                <div className="font-medium">{plot.plot_number}</div>
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-2 h-2 rounded-full"
                                                        style={{ backgroundColor: plot.section.color }}
                                                    />
                                                    <span className="text-xs text-muted-foreground">
                                                        {plot.section.name}
                                                    </span>
                                                </div>
                                                <CemeteryPlotStatusBadge status={plot.status} />
                                                {plot.deceased && (
                                                    <div className="text-xs text-muted-foreground">
                                                        {plot.deceased.name}
                                                    </div>
                                                )}
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={(e) => handleEdit(plot, e)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={(e) => handleDelete(plot, e)}
                                                >
                                                    <Trash2 className="h-4 w-4" />
                                                </Button>
                                            </div>
                                        </div>
                                    </CardContent>
                                </Card>
                            ))}
                        </div>
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
                                        <CardTitle>Cemetery Plots</CardTitle>
                                        <Button size="sm" onClick={() => {
                                            setShowCreateForm(true);
                                            setOpen(false);
                                        }}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent className="space-y-3">
                                    <Input
                                        placeholder="Search plot number or deceased..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />

                                    <Select value={selectedSection} onValueChange={setSelectedSection}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Sections" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Sections</SelectItem>
                                            {sections.map((section) => (
                                                <SelectItem key={section.id} value={section.id.toString()}>
                                                    {section.name}
                                                </SelectItem>
                                            ))}
                                        </SelectContent>
                                    </Select>

                                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                                        <SelectTrigger>
                                            <SelectValue placeholder="All Statuses" />
                                        </SelectTrigger>
                                        <SelectContent>
                                            <SelectItem value="all">All Statuses</SelectItem>
                                            <SelectItem value="available">Available</SelectItem>
                                            <SelectItem value="occupied">Occupied</SelectItem>
                                            <SelectItem value="reserved">Reserved</SelectItem>
                                            <SelectItem value="maintenance">Maintenance</SelectItem>
                                        </SelectContent>
                                    </Select>
                                </CardContent>
                            </Card>

                            <div className="space-y-2">
                                {filteredPlots.map((plot) => (
                                    <Card
                                        key={plot.id}
                                        className="hover:bg-accent/20 cursor-pointer"
                                        onClick={() => {
                                            flyToPlot(plot);
                                            setOpen(false);
                                        }}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-start justify-between gap-3">
                                                <div className="flex-1 space-y-1">
                                                    <div className="font-medium">{plot.plot_number}</div>
                                                    <div className="flex items-center gap-2">
                                                        <div
                                                            className="w-2 h-2 rounded-full"
                                                            style={{ backgroundColor: plot.section.color }}
                                                        />
                                                        <span className="text-xs text-muted-foreground">
                                                            {plot.section.name}
                                                        </span>
                                                    </div>
                                                    <CemeteryPlotStatusBadge status={plot.status} />
                                                    {plot.deceased && (
                                                        <div className="text-xs text-muted-foreground">
                                                            {plot.deceased.name}
                                                        </div>
                                                    )}
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={(e) => handleEdit(plot, e)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={(e) => handleDelete(plot, e)}
                                                    >
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </div>
                                            </div>
                                        </CardContent>
                                    </Card>
                                ))}
                            </div>
                        </div>
                    </DrawerContent>
                </Drawer>

                {/* Create/Edit Plot Form Dialog */}
                <PlotFormDialog
                    plot={selectedPlotForEdit || undefined}
                    sections={sections}
                    deceased={deceased}
                    mapboxToken={mapboxToken}
                    centerCoordinates={centerCoordinates}
                    open={showCreateForm}
                    onClose={handleCloseForm}
                />
            </div>
        </AppLayout>
    );
}
