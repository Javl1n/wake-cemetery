import { useCallback, useEffect, useRef, useState } from 'react';
import Map, {
    FullscreenControl,
    MapLayerMouseEvent,
    Marker,
    NavigationControl,
    Popup,
} from 'react-map-gl/mapbox';
import { CemeteryEvent, CemeteryPlot, MapCoordinates } from '@/types/cemetery';
import { AlertTriangle, CalendarDays, MapPin } from 'lucide-react';
import PlotDetailPopup from './plot-detail-popup';
import EventMarkerPopup from './event-marker-popup';

interface CemeteryMapContainerProps {
    plots?: CemeteryPlot[];
    events?: CemeteryEvent[];
    mapboxToken: string;
    center: MapCoordinates;
    zoom: number;
    selectedPlot?: CemeteryPlot | null;
    onPlotClick?: (plot: CemeteryPlot | null) => void;
    selectedEvent?: CemeteryEvent | null;
    onEventClick?: (event: CemeteryEvent | null) => void;
    placementMode?: boolean;
    onEmptyMapClick?: (coords: MapCoordinates) => void;
    showAdminActions?: boolean;
    onFlagMaintenance?: (plot: CemeteryPlot) => void;
    onResolveMaintenance?: (plot: CemeteryPlot) => void;
}

export default function CemeteryMapContainer({
    plots = [],
    events = [],
    mapboxToken,
    center,
    zoom,
    selectedPlot = null,
    onPlotClick,
    selectedEvent = null,
    onEventClick,
    placementMode = false,
    onEmptyMapClick,
    showAdminActions = false,
    onFlagMaintenance,
    onResolveMaintenance,
}: CemeteryMapContainerProps) {
    const mapRef = useRef<any>(null);
    const [viewState, setViewState] = useState({
        latitude: center.lat,
        longitude: center.lng,
        zoom: zoom,
    });

    useEffect(() => {
        if (selectedPlot && mapRef.current) {
            mapRef.current.flyTo({
                center: [selectedPlot.longitude, selectedPlot.latitude],
                zoom: 18,
                duration: 1500,
            });
        }
    }, [selectedPlot]);

    useEffect(() => {
        if (selectedEvent && mapRef.current) {
            mapRef.current.flyTo({
                center: [selectedEvent.longitude, selectedEvent.latitude],
                zoom: 18,
                duration: 1500,
            });
        }
    }, [selectedEvent]);

    const handleMapClick = useCallback(
        (e: MapLayerMouseEvent) => {
            if (!placementMode || !onEmptyMapClick) {
                return;
            }
            if ((e.originalEvent.target as HTMLElement).closest('[data-plot-marker]') ||
                (e.originalEvent.target as HTMLElement).closest('[data-event-marker]')) {
                return;
            }
            onEmptyMapClick({ lat: e.lngLat.lat, lng: e.lngLat.lng });
        },
        [placementMode, onEmptyMapClick],
    );

    const cursor = placementMode ? 'crosshair' : undefined;

    return (
        <div className="relative w-full h-full">
            <Map
                ref={mapRef}
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                mapboxAccessToken={mapboxToken}
                style={{ width: '100%', height: '100%', cursor }}
                onClick={handleMapClick}
            >
                <NavigationControl position="top-right" />
                <FullscreenControl position="top-right" />

                {plots.map((plot) => (
                    <Marker
                        key={plot.id}
                        latitude={plot.latitude}
                        longitude={plot.longitude}
                        anchor="bottom"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            onPlotClick?.(plot);
                        }}
                    >
                        <div
                            data-plot-marker
                            className="cursor-pointer transition-transform hover:scale-110"
                        >
                            {plot.status === 'maintenance' ? (
                                <AlertTriangle
                                    size={28}
                                    fill="#f97316"
                                    stroke="white"
                                    strokeWidth={1}
                                />
                            ) : (
                                <MapPin
                                    size={32}
                                    fill={plot.section.color}
                                    stroke="white"
                                    strokeWidth={1}
                                />
                            )}
                        </div>
                    </Marker>
                ))}

                {events.map((event) => (
                    <Marker
                        key={`event-${event.id}`}
                        latitude={event.latitude}
                        longitude={event.longitude}
                        anchor="bottom"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            onEventClick?.(event);
                        }}
                    >
                        <div
                            data-event-marker
                            className="cursor-pointer transition-transform hover:scale-110"
                        >
                            <div
                                className="flex items-center justify-center w-9 h-9 rounded-full shadow-lg border-2 border-white"
                                style={{ backgroundColor: event.color }}
                            >
                                <CalendarDays size={18} stroke="white" strokeWidth={2} />
                            </div>
                        </div>
                    </Marker>
                ))}

                {selectedPlot && (
                    <Popup
                        latitude={selectedPlot.latitude}
                        longitude={selectedPlot.longitude}
                        anchor="top"
                        onClose={() => onPlotClick?.(null)}
                        closeButton={true}
                        closeOnClick={false}
                        className="cemetery-popup"
                    >
                        <PlotDetailPopup
                            plot={selectedPlot}
                            showAdminActions={showAdminActions}
                            onFlagMaintenance={onFlagMaintenance}
                            onResolveMaintenance={onResolveMaintenance}
                        />
                    </Popup>
                )}

                {selectedEvent && (
                    <Popup
                        latitude={selectedEvent.latitude}
                        longitude={selectedEvent.longitude}
                        anchor="top"
                        onClose={() => onEventClick?.(null)}
                        closeButton={true}
                        closeOnClick={false}
                        className="cemetery-popup"
                    >
                        <EventMarkerPopup event={selectedEvent} />
                    </Popup>
                )}
            </Map>
        </div>
    );
}
