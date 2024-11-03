import {DateTime} from "luxon";

export type ShoppingList = {
    id: number;
    name: string;
    author_id: number;
    complete_by: DateTime;
    completed_at: DateTime|null;
    completed_by: number|null;
    last_updated: DateTime;
    items: Array<ShoppingListItem>;
    members: Array<number>;
}

export type ShoppingListItem = {
    id: number;
    name: string;
    amount: string;
    completed_at: DateTime|null;
    completed_by: number|null;
}