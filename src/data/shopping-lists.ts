import { parse, parseISO } from "date-fns";
import {TShoppingList} from "../types/shopping-list.ts";

export const shoppingLists: Array<TShoppingList> = [
    {
        id: 1,
        name: "Mexico 🌮",
        author_id: 1,
        complete_by: parse('2024-11-04', 'y-MM-dd', new Date()),
        completed_at: null,
        completed_by: null,
        last_updated: parseISO('2024-10-31T17:24:00'),
        items: [
            {
                id: 1,
                name: "Nachos",
                amount: "2x",
                completed_at: null,
                completed_by: null
            },
            {
                id: 2,
                name: "Spicy salsa",
                amount: "2x",
                completed_at: null,
                completed_by: null
            },
            {
                id: 3,
                name: "Sýrová omáčka",
                amount: "2x",
                completed_at: null,
                completed_by: null
            },
            {
                id: 4,
                name: "Popcorn",
                amount: "4 sáčky",
                completed_at: null,
                completed_by: null
            },
            {
                id: 5,
                name: "Hrozny",
                amount: "500g",
                completed_at: null,
                completed_by: null
            }
        ],
        members: [2]
    },
    {
        id: 2,
        name: "Caesar salát",
        author_id: 1,
        complete_by:  parse('2024-11-05', 'y-MM-dd', new Date()),
        completed_at: null,
        completed_by: null,
        last_updated: parseISO('2024-11-01T15:14:00'),
        items: [
            {
                id: 1,
                name: "Kuřecí",
                amount: "500g",
                completed_at: null,
                completed_by: null
            },
            {
                id: 2,
                name: "Little gem salát",
                amount: "2x",
                completed_at: null,
                completed_by: null
            },
            {
                id: 3,
                name: "Caesar zálivka",
                amount: "1",
                completed_at: null,
                completed_by: null
            },
            {
                id: 4,
                name: "Krutony",
                amount: "2 sáčky",
                completed_at: null,
                completed_by: null
            },
            {
                id: 5,
                name: "Parmazán",
                amount: "Jeden bloček",
                completed_at: null,
                completed_by: null
            }
        ],
        members: [2, 3]
    },
    {
        id: 3,
        name: "Mekáč",
        author_id: 2,
        complete_by: parse('2024-11-07', 'y-MM-dd', new Date()),
        completed_at: null,
        completed_by: null,
        last_updated: parseISO('2024-10-28T15:14:00'),
        items: [
            {
                id: 1,
                name: "Telefon 📱",
                amount: "1",
                completed_at: null,
                completed_by: null
            },
            {
                id: 2,
                name: "Wolt 💿",
                amount: "1",
                completed_at: null,
                completed_by: null
            },
            {
                id: 3,
                name: "Kurýr/ka 🧑",
                amount: "1",
                completed_at: null,
                completed_by: null
            },
            {
                id: 4,
                name: "Auto 🚗",
                amount: "1",
                completed_at: null,
                completed_by: null
            },
        ],
        members: [3]
    }
];