import {TUser} from "./user.ts";

export type TShoppingListCompletedMetadata = {
    completed_by: TUser
    completed_at: string
}

export type TShoppingListItem = {
    _id: string
    name: string,
    quantity: string,
    completed: TShoppingListCompletedMetadata|null,
}