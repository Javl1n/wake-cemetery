import { useCallback, useEffect, useRef, useState } from 'react';
import Map, { MapRef, NavigationControl } from 'react-map-gl/mapbox';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import '@mapbox/mapbox-gl-draw/dist/mapbox-gl-draw.css';
import type { MapLayerMouseEvent } from 'mapbox-gl';
import { SectionGeometry } from '@/types/cemetery';
import { Button } from '@/components/ui/button';
import { Pencil, Trash2, Pentagon, Minus } from 'lucide-react';

interface SectionMapDrawerProps {
    mapboxToken: string;
    centerCoordinates: { lat: number; lng: number };
    initialGeometry?: SectionGeometry | null;
    sectionColor: string;
    onGeometryChange: (
        geometry: SectionGeometry | null,
        type: 'polygon' | 'line' | null,
    ) => void;
}

export function SectionMapDrawer({
    mapboxToken,
    centerCoordinates,
    initialGeometry,
    sectionColor,
    onGeometryChange,
}: SectionMapDrawerProps) {
    const mapRef = useRef<MapRef>(null);
    const drawRef = useRef<MapboxDraw | null>(null);
    const onGeometryChangeRef = useRef(onGeometryChange);
    onGeometryChangeRef.current = onGeometryChange;

    const [drawMode, setDrawMode] = useState<'polygon' | 'line' | null>(null);
    const [hasGeometry, setHasGeometry] = useState(!!initialGeometry);
    const [isReady, setIsReady] = useState(false);

    const buildGeometry = (feature: MapLayerMouseEvent['features'][0]): SectionGeometry => {
        const geometryType = feature.geometry.type === 'Polygon' ? 'polygon' : 'line';
        return {
            type: 'Feature',
            geometry: {
                type: feature.geometry.type as 'Polygon' | 'LineString',
                coordinates: feature.geometry.coordinates as number[][] | number[][][],
            },
            properties: { geometryType },
        };
    };

    const handleMapLoad = useCallback(() => {
        const map = mapRef.current?.getMap();
        if (!map || drawRef.current) {
            return;
        }

        const draw = new MapboxDraw({
            displayControlsDefault: false,
            controls: {},
            defaultMode: 'simple_select',
            styles: [
                {
                    id: 'gl-draw-polygon-fill',
                    type: 'fill',
                    filter: ['all', ['==', '$type', 'Polygon']],
                    paint: { 'fill-color': sectionColor, 'fill-opacity': 0.3 },
                },
                {
                    id: 'gl-draw-polygon-stroke',
                    type: 'line',
                    filter: ['all', ['==', '$type', 'Polygon']],
                    paint: { 'line-color': sectionColor, 'line-width': 3 },
                },
                {
                    id: 'gl-draw-line',
                    type: 'line',
                    filter: ['all', ['==', '$type', 'LineString']],
                    paint: { 'line-color': sectionColor, 'line-width': 3 },
                },
                {
                    id: 'gl-draw-point',
                    type: 'circle',
                    filter: ['all', ['==', '$type', 'Point']],
                    paint: { 'circle-radius': 5, 'circle-color': sectionColor },
                },
                {
                    id: 'gl-draw-polygon-midpoint',
                    type: 'circle',
                    filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
                    paint: { 'circle-radius': 4, 'circle-color': sectionColor },
                },
                {
                    id: 'gl-draw-polygon-and-line-vertex-active',
                    type: 'circle',
                    filter: ['all', ['==', 'meta', 'vertex'], ['==', '$type', 'Point']],
                    paint: {
                        'circle-radius': 6,
                        'circle-color': '#ffffff',
                        'circle-stroke-color': sectionColor,
                        'circle-stroke-width': 2,
                    },
                },
            ],
        });

        map.addControl(draw);
        drawRef.current = draw;

        map.on('draw.create', (e) => {
            if (!e.features[0]) {
                return;
            }
            const geometry = buildGeometry(e.features[0]);
            onGeometryChangeRef.current(geometry, geometry.properties.geometryType);
            setDrawMode(null);
            setHasGeometry(true);
        });

        map.on('draw.update', (e) => {
            if (!e.features[0]) {
                return;
            }
            const geometry = buildGeometry(e.features[0]);
            onGeometryChangeRef.current(geometry, geometry.properties.geometryType);
        });

        map.on('draw.delete', () => {
            onGeometryChangeRef.current(null, null);
            setHasGeometry(false);
        });

        if (initialGeometry) {
            draw.add(initialGeometry);
        }

        setIsReady(true);
    }, []);

    // Remove draw control from map on unmount
    useEffect(() => {
        return () => {
            const map = mapRef.current?.getMap();
            if (map && drawRef.current) {
                try {
                    if (map.hasControl(drawRef.current)) {
                        map.removeControl(drawRef.current);
                    }
                } catch {}
                drawRef.current = null;
            }
        };
    }, []);

    const startDrawing = (mode: 'polygon' | 'line') => {
        if (!drawRef.current) {
            return;
        }
        const existing = drawRef.current.getAll();
        if (existing.features.length > 0) {
            drawRef.current.deleteAll();
        }
        drawRef.current.changeMode(
            mode === 'polygon' ? 'draw_polygon' : 'draw_line_string',
        );
        setDrawMode(mode);
    };

    const clearDrawing = () => {
        if (!drawRef.current) {
            return;
        }
        drawRef.current.deleteAll();
        drawRef.current.changeMode('simple_select');
        onGeometryChangeRef.current(null, null);
        setDrawMode(null);
        setHasGeometry(false);
    };

    const editDrawing = () => {
        if (!drawRef.current) {
            return;
        }
        const features = drawRef.current.getAll().features;
        if (features.length > 0 && features[0].id !== undefined) {
            drawRef.current.changeMode('direct_select', {
                featureId: String(features[0].id),
            });
        }
    };

    return (
        <div className="relative h-full w-full">
            <Map
                ref={mapRef}
                mapboxAccessToken={mapboxToken}
                initialViewState={{
                    longitude: centerCoordinates.lng,
                    latitude: centerCoordinates.lat,
                    zoom: 18,
                }}
                style={{ width: '100%', height: '100%' }}
                mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                onLoad={handleMapLoad}
            >
                <NavigationControl position="top-right" />
            </Map>

            <div className="absolute bottom-4 left-4 flex gap-2">
                <Button
                    type="button"
                    size="sm"
                    variant={drawMode === 'polygon' ? 'default' : 'outline'}
                    onClick={() => startDrawing('polygon')}
                    className="bg-background"
                    disabled={!isReady}
                >
                    <Pentagon className="h-4 w-4 mr-2" />
                    Draw Polygon
                </Button>
                <Button
                    type="button"
                    size="sm"
                    variant={drawMode === 'line' ? 'default' : 'outline'}
                    onClick={() => startDrawing('line')}
                    className="bg-background"
                    disabled={!isReady}
                >
                    <Minus className="h-4 w-4 mr-2" />
                    Draw Line
                </Button>
                {hasGeometry && (
                    <>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={editDrawing}
                            className="bg-background"
                            disabled={!isReady}
                        >
                            <Pencil className="h-4 w-4 mr-2" />
                            Edit
                        </Button>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={clearDrawing}
                            className="bg-background"
                            disabled={!isReady}
                        >
                            <Trash2 className="h-4 w-4 mr-2" />
                            Clear
                        </Button>
                    </>
                )}
            </div>

            {drawMode && (
                <div className="absolute top-4 left-4 bg-background border rounded-md p-3 shadow-lg">
                    <p className="text-sm font-medium">
                        {drawMode === 'polygon'
                            ? 'Click on the map to add points for your polygon'
                            : 'Click on the map to add points for your line'}
                    </p>
                    <p className="text-xs text-muted-foreground mt-1">
                        {drawMode === 'polygon'
                            ? 'Click the first point again to close the shape'
                            : 'Double-click to finish'}
                    </p>
                </div>
            )}
        </div>
    );
}
