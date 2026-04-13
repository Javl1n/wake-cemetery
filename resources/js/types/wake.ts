export interface InventoryCategory {
    id: number;
    name: string;
    created_at: string;
    updated_at: string;
    items?: InventoryItem[];
}

export interface WakeRoom {
    id: number;
    code: string;
    name: string;
    description?: string;
    capacity: number;
    features?: string[];
    hourly_rate?: number;
    status: 'active' | 'maintenance' | 'unavailable';
    image?: string;
    created_at: string;
    updated_at: string;
}

export interface WakePackage {
    id: number;
    name: string;
    description: string;
    base_price: number;
    is_active: boolean;
    created_at: string;
    updated_at: string;
    services?: WakeService[];
    items?: InventoryItem[];
}

export interface WakeService {
    id: number;
    name: string;
    description: string;
    price: number;
    created_at: string;
    updated_at: string;
    pivot?: {
        schedule_id: number;
        service_id: number;
        status: 'pending' | 'completed';
        completed_at?: string;
        fee: number;
    };
}

export interface InventoryItem {
    id: number;
    category_id: number;
    name: string;
    description: string;
    price: number;
    stock: number;
    unit: string;
    available: boolean;
    image?: string;
    created_at: string;
    updated_at: string;
    pivot?: {
        order_id: number;
        item_id: number;
        quantity: number;
        unit_price: number;
        notes?: string;
    };
}

export interface InventoryOrder {
    id: number;
    schedule_id: number;
    status: 'pending' | 'completed';
    amount: number;
    notes?: string;
    created_at: string;
    updated_at: string;
    items: InventoryItem[];
}

export interface InsuranceClaim {
    id: number;
    subscription_id: number;
    schedule_id?: number;
    reviewer_id?: number;
    approved_amount?: number;
    status: 'pending' | 'approved' | 'rejected';
    filed_at: string;
    reviewed_at?: string;
    created_at: string;
    updated_at: string;
}

export interface WakeSchedule {
    id: number;
    deceased_id: number;
    room_id: number;
    package_id: number;
    date_start: string;
    date_end: string;
    total_amount: number;
    status: 'pending' | 'confirmed' | 'in_progress' | 'completed' | 'cancelled';
    notes?: string;
    created_by?: number;
    approved_by?: number;
    approved_at?: string;
    created_at: string;
    updated_at: string;

    // Relationships
    deceased: {
        id: number;
        date_of_death: string;
        cause_of_death?: string;
        member?: {
            id: number;
            member_number: string;
            user: {
                id: number;
                name: string;
                email: string;
            };
        };
        beneficiary?: {
            id: number;
            name: string;
            relationship: string;
            contact: string;
            subscription: {
                id: number
            }
        };
    };
    room: WakeRoom;
    package: WakePackage;
    services: WakeService[];
    orders: InventoryOrder[];
    claims?: InsuranceClaim;
}
