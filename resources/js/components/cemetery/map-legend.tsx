import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CemeterySection } from '@/types/cemetery';

interface MapLegendProps {
    sections: CemeterySection[];
}

export default function MapLegend({ sections }: MapLegendProps) {
    return (
        <Card className="backdrop-blur-sm bg-background/95 shadow-lg">
            <CardHeader>
                <CardTitle className="text-lg">Legend</CardTitle>
            </CardHeader>
            <CardContent>
                <div className="space-y-2">
                    {sections.map((section) => (
                        <div key={section.id} className="flex items-center gap-2">
                            <div
                                className="w-4 h-4 rounded-full flex-shrink-0"
                                style={{ backgroundColor: section.color }}
                            />
                            <div className="flex-1">
                                <div className="text-sm font-medium">
                                    {section.name}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                    {section.occupied_plots_count || 0} /{' '}
                                    {section.plots_count || 0} occupied
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            </CardContent>
        </Card>
    );
}
