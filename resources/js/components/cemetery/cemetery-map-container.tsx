import { useCallback, useEffect, useRef, useState } from 'react';
import Map, {
    FullscreenControl,
    Layer,
    MapLayerMouseEvent,
    Marker,
    NavigationControl,
    Popup,
    Source,
} from 'react-map-gl/mapbox';
import { CemeteryPlot, CemeterySection, MapCoordinates } from '@/types/cemetery';
import { AlertTriangle, MapPin } from 'lucide-react';
import PlotDetailPopup from './plot-detail-popup';

interface CemeteryMapContainerProps {
    plots?: CemeteryPlot[];
    sections?: CemeterySection[];
    showSectionBoundaries?: boolean;
    selectedSection?: CemeterySection | null;
    mapboxToken: string;
    center: MapCoordinates;
    zoom: number;
    selectedPlot?: CemeteryPlot | null;
    onPlotClick?: (plot: CemeteryPlot | null) => void;
    maintenanceMode?: boolean;
    onEmptyMapClick?: (coords: MapCoordinates) => void;
    showAdminActions?: boolean;
    onFlagMaintenance?: (plot: CemeteryPlot) => void;
    onResolveMaintenance?: (plot: CemeteryPlot) => void;
    onSectionClick?: (section: CemeterySection) => void;
}

export default function CemeteryMapContainer({
    plots = [],
    sections = [],
    showSectionBoundaries = true,
    selectedSection = null,
    mapboxToken,
    center,
    zoom,
    selectedPlot = null,
    onPlotClick,
    maintenanceMode = false,
    onEmptyMapClick,
    showAdminActions = false,
    onFlagMaintenance,
    onResolveMaintenance,
    onSectionClick,
}: CemeteryMapContainerProps) {
    const mapRef = useRef<any>(null);
    const [viewState, setViewState] = useState({
        latitude: center.lat,
        longitude: center.lng,
        zoom: zoom,
    });
    const [hoveredSectionId, setHoveredSectionId] = useState<number | null>(null);

    useEffect(() => {
        if (selectedPlot && mapRef.current) {
            mapRef.current.flyTo({
                center: [selectedPlot.longitude, selectedPlot.latitude],
                zoom: 18,
                duration: 1500,
            });
        }
    }, [selectedPlot]);

    const handleMapClick = useCallback(
        (e: MapLayerMouseEvent) => {
            if (onSectionClick && e.features && e.features.length > 0) {
                const sectionId = e.features[0].properties?.sectionId as number | undefined;
                const section = sections.find((s) => s.id === sectionId);
                if (section) {
                    onSectionClick(section);
                    return;
                }
            }

            if (!maintenanceMode || !onEmptyMapClick) {
                return;
            }
            if ((e.originalEvent.target as HTMLElement).closest('[data-plot-marker]')) {
                return;
            }
            onEmptyMapClick({ lat: e.lngLat.lat, lng: e.lngLat.lng });
        },
        [onSectionClick, sections, maintenanceMode, onEmptyMapClick],
    );

    const handleMouseMove = useCallback(
        (e: MapLayerMouseEvent) => {
            if (!onSectionClick) {
                return;
            }
            if (e.features && e.features.length > 0) {
                setHoveredSectionId(e.features[0].properties?.sectionId ?? null);
            } else {
                setHoveredSectionId(null);
            }
        },
        [onSectionClick],
    );

    const sectionFeatures = sections
        .filter((s) => s.geometry)
        .map((section) => ({
            ...section.geometry!,
            id: section.id,
            properties: {
                ...section.geometry!.properties,
                sectionId: section.id,
                name: section.name,
                code: section.code,
                color: section.color,
            },
        }));

    const cursor =
        hoveredSectionId && onSectionClick
            ? 'pointer'
            : maintenanceMode
              ? 'crosshair'
              : undefined;

    return (
        <div className="relative w-full h-full">
            <Map
                ref={mapRef}
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                mapboxAccessToken={mapboxToken}
                style={{ width: '100%', height: '100%', cursor }}
                interactiveLayerIds={onSectionClick ? ['section-boundaries-fill'] : []}
                onClick={handleMapClick}
                onMouseMove={handleMouseMove}
                onMouseLeave={() => setHoveredSectionId(null)}
            >
                <NavigationControl position="top-right" />
                <FullscreenControl position="top-right" />

                {showSectionBoundaries && sectionFeatures.length > 0 && (
                    <Source
                        id="section-boundaries"
                        type="geojson"
                        data={{ type: 'FeatureCollection', features: sectionFeatures }}
                    >
                        <Layer
                            id="section-boundaries-fill"
                            type="fill"
                            paint={{
                                'fill-color': ['get', 'color'],
                                'fill-opacity': [
                                    'case',
                                    ['==', ['get', 'sectionId'], hoveredSectionId ?? -1],
                                    0.35,
                                    ['==', ['get', 'sectionId'], selectedSection?.id ?? -1],
                                    0.3,
                                    0.15,
                                ],
                            }}
                            filter={['==', ['get', 'geometryType'], 'polygon']}
                        />
                        <Layer
                            id="section-boundaries-line"
                            type="line"
                            paint={{
                                'line-color': ['get', 'color'],
                                'line-width': [
                                    'case',
                                    ['==', ['get', 'sectionId'], selectedSection?.id ?? -1],
                                    3,
                                    2,
                                ],
                                'line-opacity': 0.8,
                            }}
                        />
                    </Source>
                )}

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
            </Map>
        </div>
    );
}
