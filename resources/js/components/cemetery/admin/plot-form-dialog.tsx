import { useForm } from '@inertiajs/react';
import { FormEventHandler, useState, useRef, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import Map, { Marker } from 'react-map-gl/mapbox';
import { MapPin } from 'lucide-react';
import type { CemeterySection, CemeteryPlot } from '@/types/cemetery';

interface PlotFormDialogProps {
    plot?: CemeteryPlot;
    sections: CemeterySection[];
    deceased: Array<{ id: number; name: string; date_of_death: string }>;
    mapboxToken: string;
    centerCoordinates: { lat: number; lng: number };
    open: boolean;
    onClose: () => void;
}

export default function PlotFormDialog({
    plot,
    sections,
    deceased,
    mapboxToken,
    centerCoordinates,
    open,
    onClose,
}: PlotFormDialogProps) {
    const mapRef = useRef<any>(null);
    const [viewport, setViewport] = useState({
        latitude: plot?.latitude || centerCoordinates.lat,
        longitude: plot?.longitude || centerCoordinates.lng,
        zoom: 18,
    });

    const { data, setData, post, put, processing, errors, reset } = useForm({
        section_id: plot?.section.id || '',
        deceased_id: plot?.deceased?.id || '',
        plot_number: plot?.plot_number || '',
        latitude: plot?.latitude || centerCoordinates.lat,
        longitude: plot?.longitude || centerCoordinates.lng,
        status: plot?.status || 'available',
        burial_date: plot?.burial_date || '',
        notes: plot?.notes || '',
    });

    // Update viewport when plot changes
    useEffect(() => {
        if (plot) {
            setViewport({
                latitude: plot.latitude,
                longitude: plot.longitude,
                zoom: 18,
            });
        }
    }, [plot]);

    const handleMapClick = (event: any) => {
        const { lng, lat } = event.lngLat;
        setData({
            ...data,
            latitude: lat,
            longitude: lng,
        });
        setViewport({
            latitude: lat,
            longitude: lng,
            zoom: viewport.zoom,
        });
    };

    const submit: FormEventHandler = (e) => {
        e.preventDefault();

        if (plot) {
            put(`/cemetery-plots/${plot.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post('/cemetery-plots', {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[900px] max-h-[90vh] overflow-y-auto">
                <DialogHeader>
                    <DialogTitle>
                        {plot ? 'Edit Cemetery Plot' : 'Create Cemetery Plot'}
                    </DialogTitle>
                    <DialogDescription>
                        {plot
                            ? 'Update the cemetery plot details below.'
                            : 'Add a new cemetery plot. Click on the map to set coordinates.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit}>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 py-4">
                        {/* Left Column: Form Fields */}
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="section_id">Section</Label>
                                <Select
                                    value={data.section_id ? data.section_id.toString() : 'none'}
                                    onValueChange={(value) => setData('section_id', value === 'none' ? '' : parseInt(value))}
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select a section" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">Select a section</SelectItem>
                                        {sections.map((section) => (
                                            <SelectItem
                                                key={section.id}
                                                value={section.id.toString()}
                                            >
                                                <div className="flex items-center gap-2">
                                                    <div
                                                        className="w-3 h-3 rounded-full"
                                                        style={{ backgroundColor: section.color }}
                                                    />
                                                    {section.name} ({section.code})
                                                </div>
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.section_id && (
                                    <p className="text-sm text-destructive">{errors.section_id}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="plot_number">Plot Number</Label>
                                <Input
                                    id="plot_number"
                                    value={data.plot_number}
                                    onChange={(e) => setData('plot_number', e.target.value)}
                                    placeholder="e.g., A-001"
                                    required
                                />
                                {errors.plot_number && (
                                    <p className="text-sm text-destructive">{errors.plot_number}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="latitude">Latitude</Label>
                                    <Input
                                        id="latitude"
                                        type="number"
                                        step="0.00000001"
                                        value={data.latitude}
                                        onChange={(e) =>
                                            setData('latitude', parseFloat(e.target.value))
                                        }
                                        required
                                    />
                                    {errors.latitude && (
                                        <p className="text-sm text-destructive">{errors.latitude}</p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="longitude">Longitude</Label>
                                    <Input
                                        id="longitude"
                                        type="number"
                                        step="0.00000001"
                                        value={data.longitude}
                                        onChange={(e) =>
                                            setData('longitude', parseFloat(e.target.value))
                                        }
                                        required
                                    />
                                    {errors.longitude && (
                                        <p className="text-sm text-destructive">{errors.longitude}</p>
                                    )}
                                </div>
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="status">Status</Label>
                                <Select
                                    value={data.status}
                                    onValueChange={(value) => setData('status', value as any)}
                                >
                                    <SelectTrigger>
                                        <SelectValue />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="available">Available</SelectItem>
                                        <SelectItem value="occupied">Occupied</SelectItem>
                                        <SelectItem value="reserved">Reserved</SelectItem>
                                        <SelectItem value="maintenance">Maintenance</SelectItem>
                                    </SelectContent>
                                </Select>
                                {errors.status && (
                                    <p className="text-sm text-destructive">{errors.status}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="deceased_id">
                                    Deceased (Optional)
                                </Label>
                                <Select
                                    value={data.deceased_id ? data.deceased_id.toString() : 'none'}
                                    onValueChange={(value) =>
                                        setData('deceased_id', value === 'none' ? '' : parseInt(value))
                                    }
                                >
                                    <SelectTrigger>
                                        <SelectValue placeholder="Select deceased" />
                                    </SelectTrigger>
                                    <SelectContent>
                                        <SelectItem value="none">None</SelectItem>
                                        {deceased.map((d) => (
                                            <SelectItem key={d.id} value={d.id.toString()}>
                                                {d.name} ({d.date_of_death})
                                            </SelectItem>
                                        ))}
                                    </SelectContent>
                                </Select>
                                {errors.deceased_id && (
                                    <p className="text-sm text-destructive">{errors.deceased_id}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="burial_date">Burial Date (Optional)</Label>
                                <Input
                                    id="burial_date"
                                    type="date"
                                    value={data.burial_date}
                                    onChange={(e) => setData('burial_date', e.target.value)}
                                />
                                {errors.burial_date && (
                                    <p className="text-sm text-destructive">{errors.burial_date}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="notes">Notes (Optional)</Label>
                                <Textarea
                                    id="notes"
                                    value={data.notes}
                                    onChange={(e) => setData('notes', e.target.value)}
                                    placeholder="Additional notes..."
                                    rows={3}
                                />
                                {errors.notes && (
                                    <p className="text-sm text-destructive">{errors.notes}</p>
                                )}
                            </div>
                        </div>

                        {/* Right Column: Interactive Map */}
                        <div className="space-y-2">
                            <Label>Plot Location</Label>
                            <p className="text-sm text-muted-foreground">
                                Click on the map to set the plot coordinates
                            </p>
                            <div className="h-[500px] rounded-lg overflow-hidden border">
                                <Map
                                    ref={mapRef}
                                    {...viewport}
                                    onMove={(evt) => setViewport(evt.viewState)}
                                    onClick={handleMapClick}
                                    mapboxAccessToken={mapboxToken}
                                    mapStyle="mapbox://styles/mapbox/satellite-streets-v12"
                                    style={{ width: '100%', height: '100%' }}
                                >
                                    <Marker
                                        latitude={data.latitude}
                                        longitude={data.longitude}
                                        anchor="bottom"
                                        draggable
                                        onDragEnd={(event) => {
                                            setData({
                                                ...data,
                                                latitude: event.lngLat.lat,
                                                longitude: event.lngLat.lng,
                                            });
                                        }}
                                    >
                                        <MapPin className="h-8 w-8 text-red-500 fill-red-500/50" />
                                    </Marker>
                                </Map>
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button
                            type="button"
                            variant="outline"
                            onClick={onClose}
                            disabled={processing}
                        >
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : plot ? 'Update Plot' : 'Create Plot'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
