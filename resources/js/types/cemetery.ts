export interface CemeterySection {
    id: number;
    name: string;
    code: string;
    color: string;
    description?: string;
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
    section: {
        id: number;
        name: string;
        code: string;
        color: string;
    };
    deceased: Deceased | null;
}

export interface MapCoordinates {
    lat: number;
    lng: number;
}

export interface CemeteryMapPageProps {
    sections: CemeterySection[];
    plots: CemeteryPlot[];
    mapboxToken: string;
    centerCoordinates: MapCoordinates;
    initialZoom: number;
}
