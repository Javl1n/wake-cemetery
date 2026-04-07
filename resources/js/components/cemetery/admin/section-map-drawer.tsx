import { useEffect, useRef, useState } from 'react';
import Map, { MapRef, NavigationControl, useControl } from 'react-map-gl/mapbox';
import MapboxDraw from '@mapbox/mapbox-gl-draw';
import type { MapboxGeoJSONFeature } from 'mapbox-gl';
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
        type: 'polygon' | 'line' | null
    ) => void;
}

function DrawControl({
    onCreate,
    onUpdate,
    onDelete,
    sectionColor,
    initialGeometry,
    onDrawReady,
}: {
    onCreate: (feature: MapboxGeoJSONFeature) => void;
    onUpdate: (feature: MapboxGeoJSONFeature) => void;
    onDelete: () => void;
    sectionColor: string;
    initialGeometry?: SectionGeometry | null;
    onDrawReady: (draw: MapboxDraw) => void;
}) {
    const drawRef = useRef<MapboxDraw | null>(null);

    useControl(
        () => {
            drawRef.current = new MapboxDraw({
                displayControlsDefault: false,
                controls: {},
                defaultMode: 'simple_select',
                styles: [
                    {
                        id: 'gl-draw-polygon-fill',
                        type: 'fill',
                        filter: ['all', ['==', '$type', 'Polygon']],
                        paint: {
                            'fill-color': sectionColor,
                            'fill-opacity': 0.3,
                        },
                    },
                    {
                        id: 'gl-draw-polygon-stroke',
                        type: 'line',
                        filter: ['all', ['==', '$type', 'Polygon']],
                        paint: {
                            'line-color': sectionColor,
                            'line-width': 3,
                        },
                    },
                    {
                        id: 'gl-draw-line',
                        type: 'line',
                        filter: ['all', ['==', '$type', 'LineString']],
                        paint: {
                            'line-color': sectionColor,
                            'line-width': 3,
                        },
                    },
                    {
                        id: 'gl-draw-point',
                        type: 'circle',
                        filter: ['all', ['==', '$type', 'Point']],
                        paint: {
                            'circle-radius': 5,
                            'circle-color': sectionColor,
                        },
                    },
                    {
                        id: 'gl-draw-polygon-midpoint',
                        type: 'circle',
                        filter: ['all', ['==', '$type', 'Point'], ['==', 'meta', 'midpoint']],
                        paint: {
                            'circle-radius': 4,
                            'circle-color': sectionColor,
                        },
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
            return drawRef.current;
        },
        ({ map }) => {
            map.on('draw.create', (e) => {
                if (e.features[0]) {
                    onCreate(e.features[0] as MapboxGeoJSONFeature);
                }
            });
            map.on('draw.update', (e) => {
                if (e.features[0]) {
                    onUpdate(e.features[0] as MapboxGeoJSONFeature);
                }
            });
            map.on('draw.delete', () => {
                onDelete();
            });

            if (initialGeometry && drawRef.current) {
                drawRef.current.add(initialGeometry);
            }

            if (drawRef.current) {
                onDrawReady(drawRef.current);
            }
        },
        ({ map }) => {
            map.off('draw.create', onCreate);
            map.off('draw.update', onUpdate);
            map.off('draw.delete', onDelete);
        },
        { position: 'top-left' }
    );

    return null;
}

export function SectionMapDrawer({
    mapboxToken,
    centerCoordinates,
    initialGeometry,
    sectionColor,
    onGeometryChange,
}: SectionMapDrawerProps) {
    const mapRef = useRef<MapRef>(null);
    const drawControlRef = useRef<MapboxDraw | null>(null);
    const [drawMode, setDrawMode] = useState<'polygon' | 'line' | null>(null);
    const [isDrawReady, setIsDrawReady] = useState(false);

    const handleDrawReady = (draw: MapboxDraw) => {
        console.log('Draw control passed to handleDrawReady:', draw);
        drawControlRef.current = draw;
    };

    // Wait for map to be fully loaded before enabling draw tools
    useEffect(() => {
        const map = mapRef.current?.getMap();
        if (!map) return;

        const handleMapLoad = () => {
            console.log('Map loaded, waiting for draw control to be ready...');
            // Give MapboxDraw extra time to initialize its internal store
            setTimeout(() => {
                if (drawControlRef.current) {
                    console.log('Draw control should be ready now');
                    setIsDrawReady(true);
                }
            }, 500);
        };

        if (map.loaded()) {
            handleMapLoad();
        } else {
            map.on('load', handleMapLoad);
        }

        return () => {
            map.off('load', handleMapLoad);
        };
    }, []);

    const handleCreate = (feature: MapboxGeoJSONFeature) => {
        const geometryType =
            feature.geometry.type === 'Polygon' ? 'polygon' : 'line';

        const geometry: SectionGeometry = {
            type: 'Feature',
            geometry: {
                type: feature.geometry.type as 'Polygon' | 'LineString',
                coordinates: feature.geometry.coordinates as
                    | number[][]
                    | number[][][],
            },
            properties: {
                geometryType,
            },
        };

        onGeometryChange(geometry, geometryType);
        setDrawMode(null);
    };

    const handleUpdate = (feature: MapboxGeoJSONFeature) => {
        const geometryType =
            feature.geometry.type === 'Polygon' ? 'polygon' : 'line';

        const geometry: SectionGeometry = {
            type: 'Feature',
            geometry: {
                type: feature.geometry.type as 'Polygon' | 'LineString',
                coordinates: feature.geometry.coordinates as
                    | number[][]
                    | number[][][],
            },
            properties: {
                geometryType,
            },
        };

        onGeometryChange(geometry, geometryType);
    };

    const handleDelete = () => {
        onGeometryChange(null, null);
    };

    const startDrawing = (mode: 'polygon' | 'line') => {
        if (!drawControlRef.current) {
            console.error('Draw control not initialized');
            return;
        }

        try {
            // Try to delete existing features, but don't fail if there's an error
            try {
                const existingFeatures = drawControlRef.current.getAll();
                if (existingFeatures && existingFeatures.features && existingFeatures.features.length > 0) {
                    drawControlRef.current.deleteAll();
                }
            } catch (e) {
                console.log('Could not delete existing features, continuing anyway');
            }

            if (mode === 'polygon') {
                drawControlRef.current.changeMode('draw_polygon');
            } else {
                drawControlRef.current.changeMode('draw_line_string');
            }
            setDrawMode(mode);
        } catch (error) {
            console.error('Error starting drawing:', error);
        }
    };

    const clearDrawing = () => {
        if (!drawControlRef.current) return;

        try {
            drawControlRef.current.deleteAll();
            drawControlRef.current.changeMode('simple_select');
            onGeometryChange(null, null);
            setDrawMode(null);
        } catch (error) {
            console.error('Error clearing drawing:', error);
        }
    };

    const editDrawing = () => {
        if (!drawControlRef.current) return;

        try {
            const features = drawControlRef.current.getAll().features;
            if (features.length > 0) {
                drawControlRef.current.changeMode('direct_select', {
                    featureId: features[0].id,
                });
            }
        } catch (error) {
            console.error('Error editing drawing:', error);
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
            >
                <DrawControl
                    onCreate={handleCreate}
                    onUpdate={handleUpdate}
                    onDelete={handleDelete}
                    sectionColor={sectionColor}
                    initialGeometry={initialGeometry}
                    onDrawReady={handleDrawReady}
                />
                <NavigationControl position="top-right" />
            </Map>

            <div className="absolute bottom-4 left-4 flex gap-2">
                <Button
                    type="button"
                    size="sm"
                    variant={drawMode === 'polygon' ? 'default' : 'outline'}
                    onClick={() => startDrawing('polygon')}
                    className="bg-background"
                    disabled={!isDrawReady}
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
                    disabled={!isDrawReady}
                >
                    <Minus className="h-4 w-4 mr-2" />
                    Draw Line
                </Button>
                {initialGeometry && (
                    <>
                        <Button
                            type="button"
                            size="sm"
                            variant="outline"
                            onClick={editDrawing}
                            className="bg-background"
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
