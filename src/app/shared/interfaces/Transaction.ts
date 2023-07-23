import { IconComponents } from "../icons";

export interface Transaction {
    icon: keyof typeof IconComponents;
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