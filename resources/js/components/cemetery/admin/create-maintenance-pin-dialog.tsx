import { useForm } from '@inertiajs/react';
import { FormEventHandler, useEffect } from 'react';
import { AlertTriangle } from 'lucide-react';
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
import {
    Select,
    SelectContent,
    SelectItem,
    SelectTrigger,
    SelectValue,
} from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import type { CemeterySection, MapCoordinates } from '@/types/cemetery';

interface CreateMaintenancePinDialogProps {
    coordinates: MapCoordinates | null;
    sections: CemeterySection[];
    open: boolean;
    onClose: () => void;
}

export default function CreateMaintenancePinDialog({
    coordinates,
    sections,
    open,
    onClose,
}: CreateMaintenancePinDialogProps) {
    const { data, setData, post, processing, errors, reset } = useForm({
        section_id: '' as string | number,
        label: `MAINT-${Date.now()}`,
        latitude: coordinates?.lat ?? 0,
        longitude: coordinates?.lng ?? 0,
        notes: '',
    });

    useEffect(() => {
        if (open) {
            setData((prev) => ({
                ...prev,
                label: `MAINT-${Date.now()}`,
                latitude: coordinates?.lat ?? prev.latitude,
                longitude: coordinates?.lng ?? prev.longitude,
            }));
        }
    }, [open, coordinates]);

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        post('/maintenance-pins', {
            onSuccess: () => {
                reset();
                onClose();
            },
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[480px]">
                <DialogHeader>
                    <DialogTitle className="flex items-center gap-2">
                        <AlertTriangle className="h-5 w-5 text-orange-500" />
                        Pin Maintenance Location
                    </DialogTitle>
                    <DialogDescription>
                        Create a maintenance marker at the selected location.
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="py-4 space-y-4">
                        <div className="grid gap-2">
                            <Label>Section</Label>
                            <Select
                                value={data.section_id ? data.section_id.toString() : ''}
                                onValueChange={(v) => setData('section_id', parseInt(v))}
                            >
                                <SelectTrigger>
                                    <SelectValue placeholder="Select a section..." />
                                </SelectTrigger>
                                <SelectContent>
                                    {sections.map((s) => (
                                        <SelectItem key={s.id} value={s.id.toString()}>
                                            <div className="flex items-center gap-2">
                                                <div
                                                    className="w-3 h-3 rounded-full shrink-0"
                                                    style={{ backgroundColor: s.color }}
                                                />
                                                {s.name} ({s.code})
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
                            <Label>Label</Label>
                            <Input
                                value={data.label}
                                onChange={(e) => setData('label', e.target.value)}
                                required
                            />
                            {errors.label && (
                                <p className="text-sm text-destructive">{errors.label}</p>
                            )}
                        </div>

                        <div className="grid grid-cols-2 gap-4">
                            <div className="grid gap-2">
                                <Label>Latitude</Label>
                                <Input
                                    value={data.latitude.toFixed(6)}
                                    readOnly
                                    className="bg-muted"
                                />
                            </div>
                            <div className="grid gap-2">
                                <Label>Longitude</Label>
                                <Input
                                    value={data.longitude.toFixed(6)}
                                    readOnly
                                    className="bg-muted"
                                />
                            </div>
                        </div>

                        <div className="grid gap-2">
                            <Label>Maintenance Notes</Label>
                            <Textarea
                                value={data.notes}
                                onChange={(e) => setData('notes', e.target.value)}
                                placeholder="Describe what maintenance is needed..."
                                rows={3}
                            />
                            {errors.notes && (
                                <p className="text-sm text-destructive">{errors.notes}</p>
                            )}
                        </div>
                    </div>
                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button
                            type="submit"
                            className="bg-orange-500 hover:bg-orange-600"
                            disabled={processing}
                        >
                            {processing ? 'Creating...' : 'Create Maintenance Pin'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
