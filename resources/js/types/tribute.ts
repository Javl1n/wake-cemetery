export interface TributeObituary {
    id: number;
    template: number;
    image: string;
    description: string | null;
    tribute_token: string;
}

export interface TributeDeceased {
    id: number;
    date_of_death: string;
    cause_of_death: string;
    beneficiary: {
        name: string;
        relationship: string;
    };
}

export interface Tribute {
    id: number;
    uploader_name: string;
    special_relations: string;
    image: string;
    description: string | null;
    created_at: string;
}

export interface TributePageProps {
    obituary: TributeObituary;
    deceased: TributeDeceased;
    tributes: Tribute[];
}

export interface ObituaryPageProps {
    obituary: TributeObituary;
    deceased: TributeDeceased;
}
