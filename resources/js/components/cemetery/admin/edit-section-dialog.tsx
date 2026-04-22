import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
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
import type { CemeterySection, SectionGeometry } from '@/types/cemetery';
import { SectionMapDrawer } from './section-map-drawer';

interface EditSectionDialogProps {
    section: CemeterySection;
    open: boolean;
    onClose: () => void;
    mapboxToken: string;
    centerCoordinates: { lat: number; lng: number };
}

export default function EditSectionDialog({
    section,
    open,
    onClose,
    mapboxToken,
    centerCoordinates,
}: EditSectionDialogProps) {
    const { data, setData, put, processing, errors } = useForm({
        name: section.name,
        code: section.code,
        description: section.description ?? '',
        color: section.color,
        total_plots: section.total_plots ?? 0,
        available_plots: section.available_plots ?? 0,
        geometry: (section.geometry ?? null) as SectionGeometry | null,
        geometry_type: (section.geometry_type ?? null) as 'polygon' | 'line' | null,
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        put(`/cemetery-sections/${section.id}`, {
            onSuccess: onClose,
        });
    };

    return (
        <Dialog open={open} onOpenChange={onClose}>
            <DialogContent className="sm:max-w-[1200px]">
                <DialogHeader>
                    <DialogTitle>Edit Cemetery Section</DialogTitle>
                    <DialogDescription>
                        Update the details for <strong>{section.name}</strong>.
                    </DialogDescription>
                </DialogHeader>

                <form onSubmit={submit}>
                    <div className="grid md:grid-cols-2 gap-6 py-4">
                        <div className="space-y-4">
                            <div className="grid gap-2">
                                <Label htmlFor="name">Section Name</Label>
                                <Input
                                    id="name"
                                    value={data.name}
                                    onChange={(e) => setData('name', e.target.value)}
                                    placeholder="e.g., Garden of Peace"
                                    required
                                />
                                {errors.name && (
                                    <p className="text-sm text-destructive">{errors.name}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="code">Section Code</Label>
                                <Input
                                    id="code"
                                    value={data.code}
                                    onChange={(e) =>
                                        setData('code', e.target.value.toUpperCase())
                                    }
                                    placeholder="e.g., SEC-A"
                                    required
                                />
                                {errors.code && (
                                    <p className="text-sm text-destructive">{errors.code}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="description">Description (Optional)</Label>
                                <Textarea
                                    id="description"
                                    value={data.description}
                                    onChange={(e) => setData('description', e.target.value)}
                                    placeholder="Brief description of this section..."
                                    rows={3}
                                />
                                {errors.description && (
                                    <p className="text-sm text-destructive">{errors.description}</p>
                                )}
                            </div>

                            <div className="grid gap-2">
                                <Label htmlFor="color">Section Color</Label>
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
                                        Used for map markers and visual identification
                                    </span>
                                </div>
                                {errors.color && (
                                    <p className="text-sm text-destructive">{errors.color}</p>
                                )}
                            </div>

                            <div className="grid grid-cols-2 gap-4">
                                <div className="grid gap-2">
                                    <Label htmlFor="total_plots">Total Plots</Label>
                                    <Input
                                        id="total_plots"
                                        type="number"
                                        min="0"
                                        value={data.total_plots}
                                        onChange={(e) =>
                                            setData('total_plots', parseInt(e.target.value) || 0)
                                        }
                                        required
                                    />
                                    {errors.total_plots && (
                                        <p className="text-sm text-destructive">{errors.total_plots}</p>
                                    )}
                                </div>

                                <div className="grid gap-2">
                                    <Label htmlFor="available_plots">Available Plots</Label>
                                    <Input
                                        id="available_plots"
                                        type="number"
                                        min="0"
                                        value={data.available_plots}
                                        onChange={(e) =>
                                            setData(
                                                'available_plots',
                                                parseInt(e.target.value) || 0,
                                            )
                                        }
                                        required
                                    />
                                    {errors.available_plots && (
                                        <p className="text-sm text-destructive">
                                            {errors.available_plots}
                                        </p>
                                    )}
                                </div>
                            </div>
                        </div>

                        <div className="space-y-2">
                            <Label>Section Boundary (Optional)</Label>
                            <p className="text-sm text-muted-foreground">
                                Draw the section boundary on the map using polygon or line tools
                            </p>
                            <div className="h-[500px] rounded-lg overflow-hidden border">
                                <SectionMapDrawer
                                    mapboxToken={mapboxToken}
                                    centerCoordinates={centerCoordinates}
                                    initialGeometry={data.geometry}
                                    sectionColor={data.color}
                                    onGeometryChange={(geometry, type) => {
                                        setData({ ...data, geometry, geometry_type: type });
                                    }}
                                />
                            </div>
                            {errors.geometry && (
                                <p className="text-sm text-destructive">{errors.geometry}</p>
                            )}
                        </div>
                    </div>

                    <DialogFooter>
                        <Button type="button" variant="outline" onClick={onClose} disabled={processing}>
                            Cancel
                        </Button>
                        <Button type="submit" disabled={processing}>
                            {processing ? 'Saving...' : 'Update Section'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
