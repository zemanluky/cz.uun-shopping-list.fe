export type ShoppingList = {
    id: number;
    name: string;
    author_id: number;
    complete_by: Date;
    completed_at: Date|null;
    completed_by: number|null;
    last_updated: Date;
    items: Array<ShoppingListItem>;
    members: Array<number>;
}

export type ShoppingListItem = {
    id: number;
    name: string;
    amount: string;
    completed_at: Date|null;
    completed_by: number|null;
}