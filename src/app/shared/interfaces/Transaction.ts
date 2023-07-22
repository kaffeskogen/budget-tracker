export interface Transaction {
    estimation?: number;
    value?: number;
    title: string;
    category: string;
    groupId: string;
    currency: string;
    subcategory?: string;
    date: Date;
    recurring?: boolean;
}