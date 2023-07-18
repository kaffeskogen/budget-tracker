export interface Transaction {
    estimation?: number;
    value?: number;
    title: string;
    category: string;
    currency: string;
    subcategory?: string;
    date: Date;
    recurring?: boolean;
}