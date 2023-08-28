import { IconComponents } from "../icons";

export interface Transaction {
    id: string;
    icon: keyof typeof IconComponents;
    estimation?: number;
    value?: number;
    title: string;
    category: string;
    groupId: string;
    subcategory?: string;
    date: string;
    recurring?: boolean;
}