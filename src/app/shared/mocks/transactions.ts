import { Transaction } from "../interfaces/Transaction";

const transactions: Transaction[] = [
    {
        icon: 'CurrencyEuro',
        value: 50_000,
        currency: 'SEK',
        groupId: 'income',
        title: 'Salary husband',
        category: 'Wage',
        date: new Date('2022-01-07'),
        recurring: true
    },
    {
        icon: 'CurrencyEuro',
        value: 50_000,
        title: 'Salary wife',
        category: 'Wage',
        currency: 'SEK',
        groupId: 'income',
        date: new Date('2022-01-09'),
        recurring: true
    },
    {
        icon: 'CheckBadge',
        value: 1250,
        title: 'Child benefit',
        category: 'Allowance',
        currency: 'SEK',
        groupId: 'income',
        date: new Date('2022-01-12'),
        recurring: true
    },
    {
        icon: 'CheckBadge',
        value: 3442,
        title: 'Childcare (Wife)',
        category: 'Allowance',
        currency: 'SEK',
        groupId: 'income',
        date: new Date('2022-01-12'),
        recurring: true
    },
    {
        icon: 'BuildingStorefront',
        value: -50.0,
        title: 'Grocery shopping',
        category: 'Food',
        currency: 'SEK',
        groupId: 'food',
        date: new Date('2022-01-07')
    },
    {
        icon: 'BuildingLibrary',
        value: -15.5,
        title: 'Laundry detergent',
        category: 'Household Supplies',
        currency: 'SEK',
        groupId: 'food',
        date: new Date('2022-01-09')
    },
    {
        icon: 'EllipsisHorizontalCircle',
        value: -100.0,
        estimation: 120.0,
        title: 'Oil change',
        category: 'Transportation',
        currency: 'SEK',
        groupId: 'planned',
        date: new Date('2022-01-12')
    },
    {
        icon: 'Heart',
        value: -20.0,
        title: 'Coffee with friends',
        category: 'Entertainment',
        currency: 'SEK',
        groupId: 'other',
        date: new Date('2022-01-15')
    },
    {
        icon: 'Inbox',
        value: -150.0,
        title: 'New shoes',
        category: 'Shopping',
        currency: 'SEK',
        groupId: 'other',
        date: new Date('2022-01-18')
    }
];

export const MOCK_TRANSACTIONS = transactions as Transaction[];