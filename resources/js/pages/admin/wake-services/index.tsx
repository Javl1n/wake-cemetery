import { Head, router } from '@inertiajs/react';
import { useState, useMemo } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Card, CardContent } from '@/components/ui/card';
import {
    Dialog,
    DialogContent,
    DialogDescription,
    DialogFooter,
    DialogHeader,
    DialogTitle,
} from '@/components/ui/dialog';
import { Plus, Edit, Trash2, Wrench } from 'lucide-react';
import AppLayout from '@/layouts/app-layout';
import CreateWakeServiceDialog from '@/components/wake/admin/create-wake-service-dialog';
import EditWakeServiceDialog from '@/components/wake/admin/edit-wake-service-dialog';
import type { WakeService } from '@/types/wake';

interface Props {
    services: WakeService[];
}

export default function WakeServicesIndex({ services }: Props) {
    const [searchQuery, setSearchQuery] = useState('');
    const [showCreateDialog, setShowCreateDialog] = useState(false);
    const [editingService, setEditingService] = useState<WakeService | null>(null);
    const [deletingService, setDeletingService] = useState<WakeService | null>(null);

    const filteredServices = useMemo(
        () =>
            services.filter(
                (s) =>
                    s.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                    s.description.toLowerCase().includes(searchQuery.toLowerCase()),
            ),
        [services, searchQuery],
    );

    const confirmDelete = () => {
        if (!deletingService) { return; }
        router.delete(`/wake-services/${deletingService.id}`, {
            onFinish: () => setDeletingService(null),
        });
    };

    return (
        <AppLayout breadcrumbs={[{ title: 'Wake Services', href: '/wake-services' }]}>
            <Head title="Wake Services" />

            <div className="flex flex-col gap-6 p-6">
                {/* Header */}
                <div className="flex items-center justify-between">
                    <div>
                        <h1 className="text-2xl font-bold">Wake Services</h1>
                        <p className="text-sm text-muted-foreground">
                            {services.length} service{services.length !== 1 ? 's' : ''} total
                        </p>
                    </div>
                    <Button onClick={() => setShowCreateDialog(true)}>
                        <Plus className="mr-2 h-4 w-4" />
                        New Service
                    </Button>
                </div>

                {/* Search */}
                <div className="flex gap-3">
                    <Input
                        placeholder="Search services..."
                        value={searchQuery}
                        onChange={(e) => setSearchQuery(e.target.value)}
                        className="w-72"
                    />
                </div>

                {/* Services grid */}
                {filteredServices.length === 0 ? (
                    <div className="flex flex-col items-center justify-center rounded-lg border border-dashed py-16 text-center">
                        <Wrench className="mb-3 h-10 w-10 text-muted-foreground/50" />
                        <p className="text-sm text-muted-foreground">No services found</p>
                    </div>
                ) : (
                    <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
                        {filteredServices.map((service) => (
                            <Card key={service.id} className="flex flex-col">
                                <CardContent className="flex flex-1 flex-col justify-between p-5">
                                    <div>
                                        <p className="mb-1 font-semibold">{service.name}</p>
                                        <p className="mb-4 line-clamp-3 text-sm text-muted-foreground">
                                            {service.description}
                                        </p>
                                        <p className="text-lg font-bold">
                                            ₱{parseFloat(service.price.toString()).toLocaleString()}
                                        </p>
                                    </div>

                                    <div className="mt-4 flex gap-2">
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="flex-1"
                                            onClick={() => setEditingService(service)}
                                        >
                                            <Edit className="mr-1 h-3 w-3" />
                                            Edit
                                        </Button>
                                        <Button
                                            size="sm"
                                            variant="outline"
                                            className="text-destructive hover:text-destructive"
                                            onClick={() => setDeletingService(service)}
                                        >
                                            <Trash2 className="h-3 w-3" />
                                        </Button>
                                    </div>
                                </CardContent>
                            </Card>
                        ))}
                    </div>
                )}
            </div>

            <CreateWakeServiceDialog
                open={showCreateDialog}
                onClose={() => setShowCreateDialog(false)}
            />

            {editingService && (
                <EditWakeServiceDialog
                    service={editingService}
                    open={!!editingService}
                    onClose={() => setEditingService(null)}
                />
            )}

            <Dialog open={!!deletingService} onOpenChange={() => setDeletingService(null)}>
                <DialogContent className="sm:max-w-[400px]">
                    <DialogHeader>
                        <DialogTitle>Delete service?</DialogTitle>
                        <DialogDescription>
                            This will permanently delete <strong>{deletingService?.name}</strong>. This
                            action cannot be undone.
                        </DialogDescription>
                    </DialogHeader>
                    <DialogFooter>
                        <Button variant="outline" onClick={() => setDeletingService(null)}>
                            Cancel
                        </Button>
                        <Button variant="destructive" onClick={confirmDelete}>
                            Delete
                        </Button>
                    </DialogFooter>
                </DialogContent>
            </Dialog>
        </AppLayout>
    );
}
