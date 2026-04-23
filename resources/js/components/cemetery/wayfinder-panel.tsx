import { Navigation2, NavigationOff, X } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import type { CemeteryPlot, MapCoordinates } from '@/types/cemetery';

interface WayfinderPanelProps {
    plot: CemeteryPlot;
    userLocation: MapCoordinates | null;
    fallbackLocation: MapCoordinates;
    onStop: () => void;
}

function haversineMeters(a: MapCoordinates, b: MapCoordinates): number {
    const R = 6371000;
    const phi1 = (a.lat * Math.PI) / 180;
    const phi2 = (b.lat * Math.PI) / 180;
    const dPhi = ((b.lat - a.lat) * Math.PI) / 180;
    const dLambda = ((b.lng - a.lng) * Math.PI) / 180;
    const x =
        Math.sin(dPhi / 2) * Math.sin(dPhi / 2) +
        Math.cos(phi1) * Math.cos(phi2) * Math.sin(dLambda / 2) * Math.sin(dLambda / 2);
    return R * 2 * Math.atan2(Math.sqrt(x), Math.sqrt(1 - x));
}

function bearingLabel(a: MapCoordinates, b: MapCoordinates): string {
    const dLng = ((b.lng - a.lng) * Math.PI) / 180;
    const lat1 = (a.lat * Math.PI) / 180;
    const lat2 = (b.lat * Math.PI) / 180;
    const y = Math.sin(dLng) * Math.cos(lat2);
    const x = Math.cos(lat1) * Math.sin(lat2) - Math.sin(lat1) * Math.cos(lat2) * Math.cos(dLng);
    const deg = ((Math.atan2(y, x) * 180) / Math.PI + 360) % 360;
    const dirs = ['N', 'NE', 'E', 'SE', 'S', 'SW', 'W', 'NW'];
    return dirs[Math.round(deg / 45) % 8];
}

function formatDistance(metres: number): string {
    return metres < 1000 ? `${Math.round(metres)} m` : `${(metres / 1000).toFixed(2)} km`;
}

export default function WayfinderPanel({ plot, userLocation, fallbackLocation, onStop }: WayfinderPanelProps) {
    const origin = userLocation ?? fallbackLocation;
    const dest: MapCoordinates = { lat: plot.latitude, lng: plot.longitude };
    const distance = haversineMeters(origin, dest);
    const bearing = bearingLabel(origin, dest);
    const usingGps = userLocation !== null;

    return (
        <Card className="w-72 max-w-[calc(100vw-2rem)] backdrop-blur-sm bg-background/95 shadow-lg border">
            <CardContent className="p-4 space-y-3">
                <div className="flex items-start justify-between">
                    <div className="flex items-center gap-2">
                        <Navigation2 className="h-4 w-4 text-primary shrink-0" />
                        <span className="font-semibold text-sm">Navigating to Plot</span>
                    </div>
                    <Button
                        size="icon"
                        variant="ghost"
                        className="h-6 w-6 -mr-1 -mt-1"
                        onClick={onStop}
                        aria-label="Stop navigation"
                    >
                        <X className="h-3 w-3" />
                    </Button>
                </div>

                <Separator />

                <div className="space-y-1.5 text-sm">
                    <div className="flex items-center gap-2">
                        <span
                            className="inline-block h-3 w-3 rounded-full shrink-0"
                            style={{ backgroundColor: plot.section.color }}
                        />
                        <span className="font-medium">{plot.plot_number}</span>
                        <span className="text-muted-foreground">— {plot.section.name}</span>
                    </div>
                    {plot.deceased && (
                        <p className="text-muted-foreground text-xs pl-5">{plot.deceased.name}</p>
                    )}
                </div>

                <Separator />

                <div className="grid grid-cols-2 gap-3 text-sm">
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">Distance</p>
                        <p className="font-semibold">{formatDistance(distance)}</p>
                    </div>
                    <div className="text-center">
                        <p className="text-xs text-muted-foreground">Direction</p>
                        <p className="font-semibold">{bearing}</p>
                    </div>
                </div>

                {!usingGps && (
                    <p className="text-xs text-muted-foreground text-center">
                        From cemetery entrance — tap locate to use GPS
                    </p>
                )}

                <Button variant="destructive" size="sm" className="w-full" onClick={onStop}>
                    <NavigationOff className="h-4 w-4" />
                    Stop Navigation
                </Button>
            </CardContent>
        </Card>
    );
}
