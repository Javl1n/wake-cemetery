export type InsuranceProduct = {
    id: number;
    name: string;
    description: string;
    beneficiaries: number;
    premium: number;
    frequency: 'monthly' | 'semi-anually' | 'anually';
};
