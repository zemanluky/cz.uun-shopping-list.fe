import {ShoppingList} from "../types/shopping-list.ts";

export const shoppingLists: Array<ShoppingList> = [
    {
        id: 1,
        name: "První nákupní seznam",
        author_id: 1,
        complete_by: new Date('2024-11-04'),
        completed_at: null,
        completed_by: null,
        last_updated: new Date('2024-10-31T17:24:00'),
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
                name: "Salsa spicy",
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
        name: "Druhý nákupní seznam",
        author_id: 1,
        complete_by:  new Date('2024-11-05'),
        completed_at: null,
        completed_by: null,
        last_updated: new Date('2024-11-01T15:14:00'),
        items: [
            {
                id: 1,
                name: "Tortilly",
                amount: "6 ks",
                completed_at: null,
                completed_by: null
            },
            {
                id: 2,
                name: "",
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
        members: [2, 3]
    },
    {
        id: 4,
        name: "Třetí nákupní seznam",
        author_id: 2,
        complete_by:  new Date('2024-11-07'),
        completed_at: null,
        completed_by: null,
        last_updated: new Date('2024-10-28T15:14:00'),
        items: [
            {
                id: 1,
                name: "Tortilly",
                amount: "6 ks",
                completed_at: null,
                completed_by: null
            },
            {
                id: 2,
                name: "",
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
        members: [3]
    }
];