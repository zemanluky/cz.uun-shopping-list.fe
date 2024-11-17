import {TShoppingList} from "../../types/shopping-list.ts";

type TShoppingItemsCounts = {
    total: number;
    completed: number;
}

/**
 * Counts completed and total items in a given shopping list.
 * @param shoppingList
 */
export const countShoppingListItems = (shoppingList: TShoppingList): TShoppingItemsCounts => ({
    total: shoppingList?.items.length,
    completed: shoppingList?.items.filter(i => i.completed_at !== null).length
});