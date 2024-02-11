import { Transaction } from "../interfaces/Transaction";

const transactions: Transaction[] = [
    {
        id: '1',
        icon: 'CurrencyEuro',
        value: 20_000,
        groupId: 'income',
        title: 'Salary husband',
        category: 'Wage',
        date: '2022-01-07',
        recurring: true
    },
    {
        id: '2',
        icon: 'CurrencyEuro',
        value: 20_000,
        title: 'Salary wife',
        category: 'Wage',
        groupId: 'income',
        date: '2022-01-09',
        recurring: true
    },
    {
        id: '3',
        icon: 'CheckBadge',
        value: 1250,
        title: 'Child benefit',
        category: 'Allowance',
        groupId: 'income',
        date: '2022-01-12',
        recurring: true
    },
    {
        id: '4',
        icon: 'CheckBadge',
        value: 3442,
        title: 'Childcare (Wife)',
        category: 'Allowance',
        groupId: 'income',
        date: '2022-01-12',
        recurring: true
    },
    {
        id: '5',
        icon: 'BuildingStorefront',
        value: -50.0,
        title: 'Grocery shopping',
        category: 'Food',
        groupId: 'food',
        date: '2022-01-07'
    },
    {
        id: '6',
        icon: 'BuildingLibrary',
        value: -15.5,
        title: 'Laundry detergent',
        category: 'Household Supplies',
        groupId: 'food',
        date: '2022-01-09'
    },
    {
        id: '7',
        icon: 'EllipsisHorizontalCircle',
        value: -100.0,
        budget: 120.0,
        title: 'Oil change',
        category: 'Transportation',
        groupId: 'planned',
        date: '2022-01-12'
    },
    {
        id: '8',
        icon: 'Heart',
        value: -20.0,
        title: 'Coffee with friends',
        category: 'Entertainment',
        groupId: 'other',
        date: '2022-01-15'
    },
    {
        id: '9',
        icon: 'Inbox',
        value: -150.0,
        title: 'New shoes',
        category: 'Shopping',
        groupId: 'other',
        date: '2022-01-18'
    }
];

export const MOCK_TRANSACTIONS = transactions as Transaction[];