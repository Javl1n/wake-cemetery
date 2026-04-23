export interface CemeterySection {
    id: number;
    name: string;
    code: string;
    color: string;
    description?: string;
    total_plots?: number;
    available_plots?: number;
    plots_count?: number;
    occupied_plots_count?: number;
}

export interface Deceased {
    id: number;
    name: string;
    date_of_death: string;
    cause_of_death: string;
}

export interface CemeteryPlot {
    id: number;
    plot_number: string;
    latitude: number;
    longitude: number;
    status: 'available' | 'occupied' | 'reserved' | 'maintenance';
    burial_date: string | null;
    notes: string | null;
    section: {
        id: number;
        name: string;
        code: string;
        color: string;
    };
    deceased: Deceased | null;
    beneficiary?: { id: number; name: string } | null;
}

export interface CemeteryEvent {
    id: number;
    title: string;
    type: 'burial' | 'anniversary' | 'memorial' | 'ceremony' | 'other';
    description: string | null;
    latitude: number;
    longitude: number;
    starts_at: string;
    ends_at: string | null;
    color: string;
    created_by?: string;
    is_active?: boolean;
}

export interface MapCoordinates {
    lat: number;
    lng: number;
}

export interface CemeteryMapPageProps {
    sections: CemeterySection[];
    plots: CemeteryPlot[];
    events: CemeteryEvent[];
    mapboxToken: string;
    centerCoordinates: MapCoordinates;
    initialZoom: number;
}

export interface CemeterySectionPageProps {
    section: CemeterySection;
    plots: CemeteryPlot[];
}
