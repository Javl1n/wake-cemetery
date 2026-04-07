import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Checkbox } from '@/components/ui/checkbox';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { CemeterySection } from '@/types/cemetery';

interface MapFiltersProps {
    sections: CemeterySection[];
    selectedSections: number[];
    onSectionChange: (sections: number[]) => void;
    dateRange: { from: Date | null; to: Date | null };
    onDateRangeChange: (range: { from: Date | null; to: Date | null }) => void;
    onApplyFilters: () => void;
}

export default function MapFilters({
    sections,
    selectedSections,
    onSectionChange,
    dateRange,
    onDateRangeChange,
    onApplyFilters,
}: MapFiltersProps) {
    const toggleSection = (sectionId: number) => {
        if (selectedSections.includes(sectionId)) {
            onSectionChange(
                selectedSections.filter((id) => id !== sectionId),
            );
        } else {
            onSectionChange([...selectedSections, sectionId]);
        }
    };

    return (
        <Card className="backdrop-blur-sm bg-background/95 shadow-lg">
            <CardHeader>
                <CardTitle className="text-lg">Filters</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
                {/* Section Filters */}
                <div>
                    <Label className="text-sm font-medium mb-2 block">
                        Cemetery Sections
                    </Label>
                    <div className="space-y-2 max-h-48 overflow-y-auto">
                        {sections.map((section) => (
                            <div
                                key={section.id}
                                className="flex items-center space-x-2"
                            >
                                <Checkbox
                                    id={`section-${section.id}`}
                                    checked={selectedSections.includes(
                                        section.id,
                                    )}
                                    onCheckedChange={() =>
                                        toggleSection(section.id)
                                    }
                                />
                                <label
                                    htmlFor={`section-${section.id}`}
                                    className="text-sm cursor-pointer flex items-center gap-2"
                                >
                                    <div
                                        className="w-3 h-3 rounded-full"
                                        style={{
                                            backgroundColor: section.color,
                                        }}
                                    />
                                    {section.name}
                                </label>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Date Range Filter */}
                <div>
                    <Label className="text-sm font-medium mb-2 block">
                        Burial Date Range
                    </Label>
                    <div className="space-y-2">
                        <Input
                            type="date"
                            value={
                                dateRange.from
                                    ?.toISOString()
                                    .split('T')[0] || ''
                            }
                            onChange={(e) =>
                                onDateRangeChange({
                                    ...dateRange,
                                    from: e.target.value
                                        ? new Date(e.target.value)
                                        : null,
                                })
                            }
                            placeholder="From"
                        />
                        <Input
                            type="date"
                            value={
                                dateRange.to?.toISOString().split('T')[0] || ''
                            }
                            onChange={(e) =>
                                onDateRangeChange({
                                    ...dateRange,
                                    to: e.target.value
                                        ? new Date(e.target.value)
                                        : null,
                                })
                            }
                            placeholder="To"
                        />
                    </div>
                </div>

                <Button onClick={onApplyFilters} className="w-full">
                    Apply Filters
                </Button>

                <Button
                    variant="outline"
                    onClick={() => {
                        onSectionChange([]);
                        onDateRangeChange({ from: null, to: null });
                        onApplyFilters();
                    }}
                    className="w-full"
                >
                    Clear Filters
                </Button>
            </CardContent>
        </Card>
    );
}
