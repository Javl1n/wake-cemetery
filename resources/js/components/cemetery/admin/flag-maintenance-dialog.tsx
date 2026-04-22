import { useForm } from '@inertiajs/react';
import { FormEventHandler } from 'react';
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
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import type { CemeteryPlot } from '@/types/cemetery';

interface FlagMaintenanceDialogProps {
    plot: CemeteryPlot;
    open: boolean;
    onClose: () => void;
}

export default function FlagMaintenanceDialog({ plot, open, onClose }: FlagMaintenanceDialogProps) {
    const { data, setData, patch, processing, errors, reset } = useForm({
        notes: plot.notes ?? '',
    });

    const submit: FormEventHandler = (e) => {
        e.preventDefault();
        patch(`/cemetery-plots/${plot.id}/flag-maintenance`, {
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
                        Flag for Maintenance
                    </DialogTitle>
                    <DialogDescription>
                        Plot {plot.plot_number} — {plot.section.name}
                    </DialogDescription>
                </DialogHeader>
                <form onSubmit={submit}>
                    <div className="py-4 space-y-2">
                        <Label htmlFor="flag-notes">Maintenance Notes</Label>
                        <Textarea
                            id="flag-notes"
                            value={data.notes}
                            onChange={(e) => setData('notes', e.target.value)}
                            placeholder="Describe what maintenance is needed..."
                            rows={4}
                            required
                        />
                        {errors.notes && (
                            <p className="text-sm text-destructive">{errors.notes}</p>
                        )}
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
                            {processing ? 'Flagging...' : 'Flag for Maintenance'}
                        </Button>
                    </DialogFooter>
                </form>
            </DialogContent>
        </Dialog>
    );
}
