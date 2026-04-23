import { Head, router } from '@inertiajs/react';
import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { ScrollArea } from '@/components/ui/scroll-area';
import { Drawer, DrawerContent, DrawerTrigger } from '@/components/ui/drawer';
import { CalendarDays, Edit, MapPin, Menu, Plus, Trash2 } from 'lucide-react';
import CemeteryMapContainer from '@/components/cemetery/cemetery-map-container';
import EventMarkerDialog from '@/components/cemetery/admin/event-marker-dialog';
import type { CemeteryEvent, MapCoordinates } from '@/types/cemetery';
import AppLayout from '@/layouts/app-layout';
import { SidebarTrigger } from '@/components/ui/sidebar';

const EVENT_TYPE_LABELS: Record<CemeteryEvent['type'], string> = {
    burial: 'Burial',
    anniversary: 'Anniversary',
    memorial: 'Memorial',
    ceremony: 'Ceremony',
    other: 'Other',
};

const EVENT_TYPE_COLORS: Record<CemeteryEvent['type'], string> = {
    burial: 'bg-slate-100 text-slate-700',
    anniversary: 'bg-purple-100 text-purple-700',
    memorial: 'bg-blue-100 text-blue-700',
    ceremony: 'bg-amber-100 text-amber-700',
    other: 'bg-gray-100 text-gray-700',
};

interface CemeteryEventsPageProps {
    events: CemeteryEvent[];
    mapboxToken: string;
    centerCoordinates: { lat: number; lng: number };
    initialZoom: number;
}

export default function CemeteryEventsIndex({
    events,
    mapboxToken,
    centerCoordinates,
    initialZoom,
}: CemeteryEventsPageProps) {
    const [drawerOpen, setDrawerOpen] = useState(false);
    const [placementMode, setPlacementMode] = useState(false);
    const [pendingCoords, setPendingCoords] = useState<MapCoordinates | null>(null);
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingEvent, setEditingEvent] = useState<CemeteryEvent | null>(null);
    const [selectedEvent, setSelectedEvent] = useState<CemeteryEvent | null>(null);

    const handleMapClick = (coords: MapCoordinates) => {
        setPendingCoords(coords);
        setPlacementMode(false);
        setShowCreateDialog(true);
    };

    const handleCreateClose = () => {
        setShowCreateDialog(false);
        setPendingCoords(null);
        setPlacementMode(false);
    };

    const handleEdit = (event: CemeteryEvent, e: React.MouseEvent) => {
        e.stopPropagation();
        setEditingEvent(event);
        setSelectedEvent(event);
    };

    const handleDelete = (event: CemeteryEvent, e: React.MouseEvent) => {
        e.stopPropagation();
        if (confirm(`Delete event marker "${event.title}"?`)) {
            router.delete(`/cemetery-events/${event.id}`);
        }
    };

    const formatDate = (iso: string) =>
        new Date(iso).toLocaleString('en-US', {
            month: 'short',
            day: 'numeric',
            year: 'numeric',
            hour: 'numeric',
            minute: '2-digit',
        });

    const EventList = () => (
        <div className="space-y-2">
            {events.length === 0 && (
                <p className="text-sm text-muted-foreground text-center py-6">
                    No event markers yet. Click "Add Marker" to place one on the map.
                </p>
            )}
            {events.map((event) => (
                <Card
                    key={event.id}
                    className={`backdrop-blur-sm bg-background/95 cursor-pointer transition-colors hover:bg-accent/20 ${
                        selectedEvent?.id === event.id ? 'ring-2 ring-primary' : ''
                    }`}
                    onClick={() => setSelectedEvent(event)}
                >
                    <CardContent className="p-3">
                        <div className="flex items-start gap-3">
                            <div
                                className="w-8 h-8 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5"
                                style={{ backgroundColor: event.color }}
                            >
                                <CalendarDays size={14} stroke="white" strokeWidth={2} />
                            </div>
                            <div className="flex-1 min-w-0">
                                <div className="flex items-center gap-2 flex-wrap">
                                    <span className="font-medium text-sm truncate">{event.title}</span>
                                    {event.is_active && (
                                        <Badge className="text-xs bg-green-100 text-green-700 hover:bg-green-100 px-1.5 py-0">
                                            Active
                                        </Badge>
                                    )}
                                </div>
                                <div className="flex items-center gap-1.5 mt-0.5">
                                    <span
                                        className={`text-xs px-1.5 py-0.5 rounded font-medium ${EVENT_TYPE_COLORS[event.type]}`}
                                    >
                                        {EVENT_TYPE_LABELS[event.type]}
                                    </span>
                                </div>
                                <p className="text-xs text-muted-foreground mt-1">
                                    {formatDate(event.starts_at)}
                                    {event.ends_at && ` – ${formatDate(event.ends_at)}`}
                                </p>
                                <p className="text-xs text-muted-foreground">
                                    By {event.created_by}
                                </p>
                            </div>
                            <div className="flex gap-1 flex-shrink-0">
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7"
                                    onClick={(e) => handleEdit(event, e)}
                                >
                                    <Edit className="h-3.5 w-3.5" />
                                </Button>
                                <Button
                                    size="icon"
                                    variant="ghost"
                                    className="h-7 w-7 text-destructive hover:text-destructive"
                                    onClick={(e) => handleDelete(event, e)}
                                >
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    </CardContent>
                </Card>
            ))}
        </div>
    );

    return (
        <AppLayout>
            <Head title="Cemetery Event Markers">
                <link
                    href="https://api.mapbox.com/mapbox-gl-js/v3.1.0/mapbox-gl.css"
                    rel="stylesheet"
                />
            </Head>

            <div className="min-h-screen flex flex-col">
                {/* Full Screen Map */}
                <div className="absolute inset-0">
                    <CemeteryMapContainer
                        mapboxToken={mapboxToken}
                        center={centerCoordinates}
                        zoom={initialZoom}
                        events={events}
                        selectedEvent={selectedEvent}
                        onEventClick={setSelectedEvent}
                        placementMode={placementMode}
                        onEmptyMapClick={handleMapClick}
                    />
                </div>

                {/* Floating Control Panel - Desktop */}
                <div className="hidden md:block absolute top-4 left-4 z-10 w-96 max-h-[calc(100vh-2rem)] overflow-y-auto space-y-4">
                    <Card className="backdrop-blur-sm bg-background/95 shadow-lg">
                        <CardHeader>
                            <div className="flex items-center justify-between">
                                <CardTitle className="flex items-center gap-2">
                                    <SidebarTrigger className="my-auto" />
                                    <span className="my-auto">Event Markers</span>
                                </CardTitle>
                                <Button
                                    size="sm"
                                    variant={placementMode ? 'secondary' : 'default'}
                                    onClick={() => setPlacementMode(!placementMode)}
                                >
                                    {placementMode ? (
                                        <>
                                            <MapPin className="h-4 w-4 mr-2" />
                                            Click on map...
                                        </>
                                    ) : (
                                        <>
                                            <Plus className="h-4 w-4 mr-2" />
                                            Add Marker
                                        </>
                                    )}
                                </Button>
                            </div>
                            {placementMode && (
                                <p className="text-xs text-muted-foreground mt-1">
                                    Click anywhere on the map to place the event marker.
                                </p>
                            )}
                        </CardHeader>
                    </Card>

                    <ScrollArea className="h-[calc(100vh-13rem)]">
                        <EventList />
                    </ScrollArea>
                </div>

                {/* Mobile Drawer */}
                <Drawer open={drawerOpen} onOpenChange={setDrawerOpen}>
                    <DrawerTrigger asChild>
                        <Button className="md:hidden absolute top-4 left-4 z-20 shadow-lg" size="icon">
                            <Menu className="h-5 w-5" />
                        </Button>
                    </DrawerTrigger>
                    <DrawerContent className="max-h-[80vh]">
                        <div className="overflow-y-auto p-4 space-y-4">
                            <div className="flex items-center justify-between">
                                <h2 className="font-semibold">Event Markers</h2>
                                <Button
                                    size="sm"
                                    onClick={() => {
                                        setPlacementMode(true);
                                        setDrawerOpen(false);
                                    }}
                                >
                                    <Plus className="h-4 w-4 mr-2" />
                                    Add Marker
                                </Button>
                            </div>
                            <EventList />
                        </div>
                    </DrawerContent>
                </Drawer>

                <EventMarkerDialog
                    open={showCreateDialog}
                    onClose={handleCreateClose}
                    coordinates={pendingCoords}
                />

                {editingEvent && (
                    <EventMarkerDialog
                        key={editingEvent.id}
                        open={true}
                        onClose={() => setEditingEvent(null)}
                        event={editingEvent}
                    />
                )}
            </div>
        </AppLayout>
    );
}
