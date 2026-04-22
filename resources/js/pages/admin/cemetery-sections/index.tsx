import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { ScrollArea } from '@/components/ui/scroll-area';
import {
    Drawer,
    DrawerContent,
    DrawerTrigger,
} from '@/components/ui/drawer';
import { Menu, Plus, Edit, Trash2 } from 'lucide-react';
import CemeteryMapContainer from '@/components/cemetery/cemetery-map-container';
import CreateSectionDialog from '@/components/cemetery/admin/create-section-dialog';
import EditSectionDialog from '@/components/cemetery/admin/edit-section-dialog';
import type { CemeterySection, CemeteryPlot } from '@/types/cemetery';
import AppLayout from '@/layouts/app-layout';
import { SidebarTrigger } from '@/components/ui/sidebar';

interface CemeterySectionsPageProps {
    sections: CemeterySection[];
    plots: CemeteryPlot[];
    mapboxToken: string;
    centerCoordinates: { lat: number; lng: number };
    initialZoom: number;
}

export default function CemeterySectionsIndex({
    sections,
    plots,
    mapboxToken,
    centerCoordinates,
    initialZoom,
}: CemeterySectionsPageProps) {
    const [open, setOpen] = useState(false);
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedSection, setSelectedSection] = useState<CemeterySection | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingSection, setEditingSection] = useState<CemeterySection | null>(null);

    const filteredSections = sections.filter((section) =>
        section.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        section.code.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleEdit = (section: CemeterySection, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingSection(section);
    };

    const handleDelete = (section: CemeterySection, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Are you sure you want to delete ${section.name}?`)) {
            router.delete(`/cemetery-sections/${section.id}`);
        }
    };

    const highlightSection = (section: CemeterySection) => {
        setSelectedSection(section);
    };

    const handleCloseEdit = () => setEditingSection(null);

    return (
        <AppLayout>
            <Head title="Manage Cemetery Sections">
                <link
                    href="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.css"
                    rel="stylesheet"
                />
                <link
                    rel="stylesheet"
                    href="https://api.mapbox.com/mapbox-gl-js/plugins/mapbox-gl-draw/v1.4.3/mapbox-gl-draw.css"
                />
            </Head>

            <div className="min-h-screen flex flex-col">
                {/* Full Screen Map */}
                <div className="absolute inset-0">
                    <CemeteryMapContainer
                        plots={plots}
                        sections={sections}
                        showSectionBoundaries={true}
                        selectedSection={selectedSection}
                        mapboxToken={mapboxToken}
                        center={centerCoordinates}
                        zoom={initialZoom}
                        selectedPlot={null}
                        onPlotClick={() => { }}
                    />
                </div>

                {/* Floating Control Panel - Desktop */}
                <div className="hidden md:block absolute top-4 left-4 z-10 w-96 max-h-[calc(100vh-2rem)] overflow-y-auto space-y-4">
                    {/* Search Card */}
                    <Card className="backdrop-blur-sm bg-background/95 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className=''>
                                    <SidebarTrigger className="my-auto" />
                                    <span className='my-auto'>
                                        Cemetery Sections
                                    </span>
                                </CardTitle>
                                <Button size="sm" onClick={() => setShowCreateDialog(true)}>
                                    <Plus className="h-4 w-4 mr-2" />
                                    Create
                                </Button>
                            </div>
                        </CardHeader>
                        <CardContent>
                            <Input
                                placeholder="Search sections..."
                                value={searchQuery}
                                onChange={(e) => setSearchQuery(e.target.value)}
                            />
                        </CardContent>
                    </Card>

                    {/* Sections List Card */}
                    <ScrollArea className="h-[calc(100vh-16rem)]">
                        <div className="space-y-2">
                            {filteredSections.map((section) => (
                                <Card
                                    key={section.id}
                                    className="backdrop-blur-sm bg-background/95 hover:bg-accent/20 cursor-pointer transition-colors"
                                    onClick={() => highlightSection(section)}
                                >
                                    <CardContent className="p-4">
                                        <div className="flex items-center gap-3">
                                            <div
                                                className="w-6 h-6 rounded-full flex-shrink-0"
                                                style={{ backgroundColor: section.color }}
                                            />
                                            <div className="flex-1">
                                                <div className="font-medium">{section.name}</div>
                                                <div className="text-xs text-muted-foreground">
                                                    {section.code} • {section.occupied_plots_count}/{section.plots_count} occupied
                                                </div>
                                            </div>
                                            <div className="flex gap-2">
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={(e) => handleEdit(section, e)}
                                                >
                                                    <Edit className="h-4 w-4" />
                                                </Button>
                                                <Button
                                                    size="icon"
                                                    variant="ghost"
                                                    onClick={(e) => handleDelete(section, e)}
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
                            {/* Same content as desktop floating panel */}
                            <Card>
                                <CardHeader>
                                    <div className="flex items-center justify-between">
                                        <CardTitle>Cemetery Sections</CardTitle>
                                        <Button size="sm" onClick={() => {
                                            setShowCreateDialog(true);
                                            setOpen(false);
                                        }}>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Create
                                        </Button>
                                    </div>
                                </CardHeader>
                                <CardContent>
                                    <Input
                                        placeholder="Search sections..."
                                        value={searchQuery}
                                        onChange={(e) => setSearchQuery(e.target.value)}
                                    />
                                </CardContent>
                            </Card>

                            <div className="space-y-2">
                                {filteredSections.map((section) => (
                                    <Card
                                        key={section.id}
                                        className="hover:bg-accent/20 cursor-pointer"
                                        onClick={() => {
                                            highlightSection(section);
                                            setOpen(false);
                                        }}
                                    >
                                        <CardContent className="p-4">
                                            <div className="flex items-center gap-3">
                                                <div
                                                    className="w-6 h-6 rounded-full flex-shrink-0"
                                                    style={{ backgroundColor: section.color }}
                                                />
                                                <div className="flex-1">
                                                    <div className="font-medium">{section.name}</div>
                                                    <div className="text-xs text-muted-foreground">
                                                        {section.code} • {section.occupied_plots_count}/{section.plots_count} occupied
                                                    </div>
                                                </div>
                                                <div className="flex gap-2">
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={(e) => handleEdit(section, e)}
                                                    >
                                                        <Edit className="h-4 w-4" />
                                                    </Button>
                                                    <Button
                                                        size="icon"
                                                        variant="ghost"
                                                        onClick={(e) => handleDelete(section, e)}
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

                <CreateSectionDialog
                    open={showCreateDialog}
                    onClose={() => setShowCreateDialog(false)}
                    mapboxToken={mapboxToken}
                    centerCoordinates={centerCoordinates}
                />

                {editingSection && (
                    <EditSectionDialog
                        key={editingSection.id}
                        section={editingSection}
                        open={true}
                        onClose={handleCloseEdit}
                        mapboxToken={mapboxToken}
                        centerCoordinates={centerCoordinates}
                    />
                )}
            </div>
        </AppLayout>
    );
}
