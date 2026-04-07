import { useEffect, useRef, useState } from 'react';
import Map, {
    Marker,
    Popup,
    NavigationControl,
    FullscreenControl,
    Source,
    Layer,
} from 'react-map-gl/mapbox';
import { CemeteryPlot, CemeterySection, MapCoordinates } from '@/types/cemetery';
import { MapPin } from 'lucide-react';
import PlotDetailPopup from './plot-detail-popup';

interface CemeteryMapContainerProps {
    plots: CemeteryPlot[];
    sections?: CemeterySection[];
    showSectionBoundaries?: boolean;
    selectedSection?: CemeterySection | null;
    mapboxToken: string;
    center: MapCoordinates;
    zoom: number;
    selectedPlot: CemeteryPlot | null;
    onPlotClick: (plot: CemeteryPlot | null) => void;
}

export default function CemeteryMapContainer({
    plots,
    sections = [],
    showSectionBoundaries = false,
    selectedSection = null,
    mapboxToken,
    center,
    zoom,
    selectedPlot,
    onPlotClick,
}: CemeteryMapContainerProps) {
    const mapRef = useRef<any>(null);
    const [viewState, setViewState] = useState({
        latitude: center.lat,
        longitude: center.lng,
        zoom: zoom,
    });

    // Fly to selected plot
    useEffect(() => {
        if (selectedPlot && mapRef.current) {
            mapRef.current.flyTo({
                center: [selectedPlot.longitude, selectedPlot.latitude],
                zoom: 18,
                duration: 1500,
            });
        }
    }, [selectedPlot]);

    return (
        <div className="relative w-full h-full">
            <Map
                ref={mapRef}
                {...viewState}
                onMove={(evt) => setViewState(evt.viewState)}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                mapboxAccessToken={mapboxToken}
                style={{ width: '100%', height: '100%' }}
            >
                {/* Navigation Controls */}
                <NavigationControl position="top-right" />
                <FullscreenControl position="top-right" />

                {/* Section Boundaries */}
                {showSectionBoundaries && sections.length > 0 && (
                    <Source
                        id="section-boundaries"
                        type="geojson"
                        data={{
                            type: 'FeatureCollection',
                            features: sections
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
                                })),
                        }}
                    >
                        <Layer
                            id="section-boundaries-fill"
                            type="fill"
                            paint={{
                                'fill-color': ['get', 'color'],
                                'fill-opacity': [
                                    'case',
                                    ['==', ['get', 'sectionId'], selectedSection?.id || -1],
                                    0.3,
                                    0.1,
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
                                    ['==', ['get', 'sectionId'], selectedSection?.id || -1],
                                    3,
                                    2,
                                ],
                                'line-opacity': 0.8,
                            }}
                        />
                    </Source>
                )}

                {/* Plot Markers */}
                {plots.map((plot) => (
                    <Marker
                        key={plot.id}
                        latitude={plot.latitude}
                        longitude={plot.longitude}
                        anchor="bottom"
                        onClick={(e) => {
                            e.originalEvent.stopPropagation();
                            onPlotClick(plot);
                        }}
                    >
                        <div
                            className="cursor-pointer transition-transform hover:scale-110"
                            style={{ color: plot.section.color }}
                        >
                            <MapPin
                                size={32}
                                fill={plot.section.color}
                                stroke="white"
                                strokeWidth={1}
                            />
                        </div>
                    </Marker>
                ))}

                {/* Popup for selected plot */}
                {selectedPlot && (
                    <Popup
                        latitude={selectedPlot.latitude}
                        longitude={selectedPlot.longitude}
                        anchor="top"
                        onClose={() => onPlotClick(null)}
                        closeButton={true}
                        closeOnClick={false}
                        className="cemetery-popup"
                    >
                        <PlotDetailPopup plot={selectedPlot} />
                    </Popup>
                )}
            </Map>
        </div>
    );
}
