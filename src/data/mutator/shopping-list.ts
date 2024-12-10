import {authenticatedMutator, TFetcherKey, TMutatorKey} from "@Utils/axios.config.ts";
import {apiRoutes, TMutatorArguments} from "../../config/api/routes.ts";
import {TShoppingListDetail} from "../../types/shopping-list.ts";

export interface ICreateShoppingList {
    name: string;
    complete_by: Date;
}

/**
 * Creates new shopping list.
 */
export function addShoppingListMutator(_: TFetcherKey|TMutatorKey, {arg}: TMutatorArguments<ICreateShoppingList>) {
    return authenticatedMutator<TShoppingListDetail>(apiRoutes.shoppingList.createShoppingList, arg);
}

export interface IUpdateShoppingList extends Pick<ICreateShoppingList, "name"> {
    complete_by?: Date;
    id: string;
}

/**
 * Updates existing shopping list.
 */
export function updateShoppingListMutator(_: TFetcherKey|TMutatorKey, {arg}: TMutatorArguments<IUpdateShoppingList>) {
    const {id, ...rest} = arg;

    return authenticatedMutator<TShoppingListDetail>(
        [...apiRoutes.shoppingList.updateShoppingList, { id }],
        rest
    );
}

export interface IPatchShoppingList {
    id: string
}

/**
 * Deletes existing shopping list.
 * @param _
 * @param arg ID of the shopping list to delete.
 */
export function deleteShoppingListMutator(_: TFetcherKey|TMutatorKey, {arg}: TMutatorArguments<IPatchShoppingList>) {
    const {id} = arg;
    return authenticatedMutator<undefined>([...apiRoutes.shoppingList.deleteShoppingList, { id }]);
}

/**
 * Closes existing shopping list.
 * @param _
 * @param arg ID of the shopping list to close.
 */
export function closeShoppingListMutator(_: TFetcherKey|TMutatorKey, {arg}: TMutatorArguments<IPatchShoppingList>) {
    const {id} = arg;
    return authenticatedMutator<TShoppingListDetail>([...apiRoutes.shoppingList.closeShoppingList, { id }]);
}