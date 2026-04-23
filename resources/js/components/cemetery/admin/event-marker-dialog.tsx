import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
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
import { CemeteryEvent, MapCoordinates } from '@/types/cemetery';

const EVENT_TYPES = [
    { value: 'burial', label: 'Burial' },
    { value: 'anniversary', label: 'Anniversary' },
    { value: 'memorial', label: 'Memorial' },
    { value: 'ceremony', label: 'Ceremony' },
    { value: 'other', label: 'Other' },
] as const;

interface EventMarkerDialogProps {
    open: boolean;
    onClose: () => void;
    coordinates?: MapCoordinates | null;
    event?: CemeteryEvent | null;
}

export default function EventMarkerDialog({
    open,
    onClose,
    coordinates,
    event,
}: EventMarkerDialogProps) {
    const isEditing = !!event;

    const { data, setData, post, put, processing, errors, reset } = useForm({
        title: event?.title ?? '',
        type: (event?.type ?? 'other') as CemeteryEvent['type'],
        description: event?.description ?? '',
        latitude: event?.latitude ?? coordinates?.lat ?? 0,
        longitude: event?.longitude ?? coordinates?.lng ?? 0,
        starts_at: event ? event.starts_at.slice(0, 16) : '',
        ends_at: event?.ends_at ? event.ends_at.slice(0, 16) : '',
        color: event?.color ?? '#ef4444',
    });

    useEffect(() => {
        if (!isEditing && coordinates) {
            setData((prev) => ({
                ...prev,
                latitude: coordinates.lat,
                longitude: coordinates.lng,
            }));
        }
    }, [coordinates]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        if (isEditing) {
            put(`/cemetery-events/${event!.id}`, {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        } else {
            post('/cemetery-events', {
                onSuccess: () => {
                    reset();
                    onClose();
                },
            });
        }
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[520px]">
                <DialogHeader>
                    <DialogTitle>{isEditing ? 'Edit Event Marker' : 'Add Event Marker'}</DialogTitle>
                    <DialogDescription>
                        {isEditing
                            ? 'Update the details of this event marker.'
                            : 'Place an event marker to notify visitors of an ongoing event at this location.'}
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit}>
                    <div className="space-y-4 py-4">
                        <div className="grid gap-2">
                            <Label htmlFor="title">Title</Label>
                            <Input
                                id="title"
                                value={data.title}
                                onChange={(e) => setData('title', e.target.value)}
                                placeholder="e.g., Santos Family Burial"
                                required
                            />
                            {errors.title && (
                                <p className="text-sm text-destructive">{errors.title}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="type">Event Type</Label>
                            <Select
                                value={data.type}
                                onValueChange={(v) => setData('type', v as CemeteryEvent['type'])}
                            >
                                <SelectTrigger id="type">
                                    <SelectValue placeholder="Select type" />
                                </SelectTrigger>
                                <SelectContent>
                                    {EVENT_TYPES.map((t) => (
                                        <SelectItem key={t.value} value={t.value}>
                                            {t.label}
                                        </SelectItem>
                                    ))}
                                </SelectContent>
                            </Select>
                            {errors.type && (
                                <p className="text-sm text-destructive">{errors.type}</p>
                            )}
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="description">Description (Optional)</Label>
                            <Textarea
                                id="description"
                                value={data.description}
                                onChange={(e) => setData('description', e.target.value)}
                                placeholder="Brief description for visitors..."
                                rows={2}
                            />
                            {errors.description && (
                                <p className="text-sm text-destructive">{errors.description}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="starts_at">Starts At</Label>
                                <Input
                                    id="starts_at"
                                    type="datetime-local"
                                    value={data.starts_at}
                                    onChange={(e) => setData('starts_at', e.target.value)}
                                    required
                                />
                                {errors.starts_at && (
                                    <p className="text-sm text-destructive">{errors.starts_at}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="ends_at">Ends At (Optional)</Label>
                                <Input
                                    id="ends_at"
                                    type="datetime-local"
                                    value={data.ends_at}
                                    onChange={(e) => setData('ends_at', e.target.value)}
                                    min={data.starts_at}
                                />
                                {errors.ends_at && (
                                    <p className="text-sm text-destructive">{errors.ends_at}</p>
                                )}
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label htmlFor="color">Marker Color</Label>
                            <div className="flex gap-2 items-center">
                                <Input
                                    id="color"
                                    type="color"
                                    value={data.color}
                                    onChange={(e) => setData('color', e.target.value)}
                                    className="w-20 h-10"
                                    required
                                />
                                <span className="text-sm text-muted-foreground">
                                    Color shown on the map marker
                                </span>
                            </div>
                            {errors.color && (
                                <p className="text-sm text-destructive">{errors.color}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label htmlFor="latitude">Latitude</Label>
                                <Input
                                    id="latitude"
                                    type="number"
                                    step="any"
                                    value={data.latitude}
                                    onChange={(e) => setData('latitude', parseFloat(e.target.value))}
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
                                    step="any"
                                    value={data.longitude}
                                    onChange={(e) => setData('longitude', parseFloat(e.target.value))}
                                    required
                                />
                                {errors.longitude && (
                                    <p className="text-sm text-destructive">{errors.longitude}</p>
                                )}
                            </div>
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : isEditing ? 'Save Changes' : 'Add Marker'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
