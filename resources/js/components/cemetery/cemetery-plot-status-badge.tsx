import { Badge } from '@/components/ui/badge';

interface CemeteryPlotStatusBadgeProps {
    status: 'available' | 'occupied' | 'reserved' | 'maintenance';
}

export default function CemeteryPlotStatusBadge({
    status,
}: CemeteryPlotStatusBadgeProps) {
    const variants = {
        available: 'default',
        occupied: 'secondary',
        reserved: 'outline',
        maintenance: 'destructive',
    } as const;

    const labels = {
        available: 'Available',
        occupied: 'Occupied',
        reserved: 'Reserved',
        maintenance: 'Maintenance',
    };

    return (
        <Badge variant={variants[status]} className="text-xs">
            {labels[status]}
        </Badge>
    );
}
