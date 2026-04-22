export interface SectionGeometry {
    type: 'Feature';
    geometry: {
        type: 'Polygon' | 'LineString';
        coordinates: number[][] | number[][][];
    };
    properties: {
        geometryType: 'polygon' | 'line';
    };
}

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
    geometry?: SectionGeometry | null;
    geometry_type?: 'polygon' | 'line' | null;
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

export interface MapCoordinates {
    lat: number;
    lng: number;
}

export interface CemeteryMapPageProps {
    sections: CemeterySection[];
    mapboxToken: string;
    centerCoordinates: MapCoordinates;
    initialZoom: number;
}

export interface CemeterySectionPageProps {
    section: CemeterySection;
    plots: CemeteryPlot[];
}
