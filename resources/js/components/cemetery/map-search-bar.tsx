import { useState, useCallback } from 'react';
import { Input } from '@/components/ui/input';
import { Search } from 'lucide-react';
import { CemeteryPlot } from '@/types/cemetery';
import { Card, CardContent } from '@/components/ui/card';
import { debounce } from '@/lib/utils';

interface MapSearchBarProps {
    onPlotSelect: (plot: CemeteryPlot) => void;
}

export default function MapSearchBar({ onPlotSelect }: MapSearchBarProps) {
    const [query, setQuery] = useState('');
    const [results, setResults] = useState<CemeteryPlot[]>([]);
    const [isSearching, setIsSearching] = useState(false);

    const searchPlots = useCallback(
        debounce(async (searchQuery: string) => {
            if (searchQuery.length < 2) {
                setResults([]);
                return;
            }

            setIsSearching(true);
            try {
                const response = await fetch(
                    `/cemetery/search?query=${encodeURIComponent(searchQuery)}`,
                );
                const data = await response.json();
                setResults(data.results);
            } catch (error) {
                console.error('Search error:', error);
            } finally {
                setIsSearching(false);
            }
        }, 300),
        [],
    );

    const handleSearch = (value: string) => {
        setQuery(value);
        searchPlots(value);
    };

    return (
        <Card className="backdrop-blur-sm bg-background/95 shadow-lg">
            <CardContent className="p-4">
                <div className="relative">
                    <Search className="absolute left-3 top-3 h-4 w-4 text-muted-foreground" />
                    <Input
                        type="text"
                        placeholder="Search by deceased name..."
                        value={query}
                        onChange={(e) => handleSearch(e.target.value)}
                        className="pl-10"
                    />
                </div>

                {isSearching && (
                    <div className="mt-2 text-sm text-muted-foreground">
                        Searching...
                    </div>
                )}

                {results.length > 0 && (
                    <div className="mt-2 space-y-2 max-h-64 overflow-y-auto">
                        {results.map((plot) => (
                            <button
                                key={plot.id}
                                onClick={() => {
                                    onPlotSelect(plot);
                                    setQuery('');
                                    setResults([]);
                                }}
                                className="w-full text-left p-2 rounded hover:bg-accent transition-colors"
                            >
                                <div className="font-medium">
                                    {plot.deceased?.name}
                                </div>
                                <div className="text-sm text-muted-foreground">
                                    {plot.plot_number} - {plot.section.name}
                                </div>
                            </button>
                        ))}
                    </div>
                )}
            </CardContent>
        </Card>
    );
}
