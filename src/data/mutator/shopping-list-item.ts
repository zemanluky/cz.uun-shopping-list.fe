import {authenticatedMutator, TFetcherKey, TMutatorKey} from "@Utils/axios.config.ts";
import {apiRoutes, TMutatorArguments} from "../../config/api/routes.ts";
import {TShoppingListDetail} from "../../types/shopping-list.ts";

interface ICreateShoppingListItemParam {
    // ID of the shopping list to which the item belongs.
    shoppingListId: string;
}

interface ICreateShoppingListItem {
    // Quantity of the item
    quantity: string;
    // Name of the item
    name: string;
}

interface ICreateShoppingListItemArgs extends ICreateShoppingListItemParam, ICreateShoppingListItem {}

export type TShoppingListItemsUpdate = {
    items: TShoppingListDetail['items']
}

/**
 * Creates a new shopping list item in a given list.
 * @param _
 * @param arg
 */
export function createItemMutator(_: TFetcherKey|TMutatorKey, {arg}: TMutatorArguments<ICreateShoppingListItemArgs>) {
    const {shoppingListId, ...data} = arg;
    return authenticatedMutator<TShoppingListItemsUpdate>(
        [...apiRoutes.shoppingList.items.addItem, { id: shoppingListId }],
        data
    );
}

interface IUpdateShoppingListItemParam extends ICreateShoppingListItemParam {
    // ID of the shopping list item to modify/delete.
    itemId: string;
}

interface IUpdateShoppingListItemArgs extends IUpdateShoppingListItemParam, ICreateShoppingListItem {}

/**
 * Updates an existing shopping list item.
 * @param _
 * @param arg
 */
export function updateItemMutator(_: TFetcherKey|TMutatorKey, {arg}: TMutatorArguments<IUpdateShoppingListItemArgs>) {
    const {shoppingListId, itemId, ...data} = arg;
    return authenticatedMutator<TShoppingListItemsUpdate>(
        [...apiRoutes.shoppingList.items.updateItem, { id: shoppingListId, itemId }],
        data
    );
}

interface IToggleItemStateArgs extends IUpdateShoppingListItemParam {
    // New state of the item.
    bought: boolean;
}

/**
 * Toggles bought state of a given shopping list item.
 * @param _
 * @param arg
 */
export function toggleItemStateMutator(_: TFetcherKey|TMutatorKey, {arg}: TMutatorArguments<IToggleItemStateArgs>) {
    const {shoppingListId, itemId, bought} = arg;
    return authenticatedMutator<TShoppingListItemsUpdate>(
        [...apiRoutes.shoppingList.items.toggleItemStatus, { id: shoppingListId, itemId }],
        { bought }
    );
}

/**
 * Deletes an existing shopping list item.
 * @param _
 * @param arg
 */
export function deleteItemMutator(_: TFetcherKey|TMutatorKey, {arg}: TMutatorArguments<IUpdateShoppingListItemParam>) {
    const {shoppingListId, itemId} = arg;
    return authenticatedMutator<undefined>([...apiRoutes.shoppingList.items.removeItem, { id: shoppingListId, itemId }]);
}