import { Group } from "./Group";
import { Transaction } from "./Transaction";

export interface AppStorage {
    transactions: Transaction[];
    groups: Group[];
}