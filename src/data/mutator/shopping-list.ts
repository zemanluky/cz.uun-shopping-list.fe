import {authenticatedMutator} from "@Utils/axios.config.ts";
import {apiRoutes, TMutatorArguments} from "../../config/api/routes.ts";
import {TShoppingListDetail} from "../../types/shopping-list.ts";

export interface ICreateShoppingList {
    name: string;
    complete_by: Date;
}

/**
 * Creates new shopping list.
 */
export function addShoppingListMutator(_: string, {arg}: TMutatorArguments<ICreateShoppingList>) {
    return authenticatedMutator<TShoppingListDetail>(apiRoutes.shoppingList.createShoppingList, arg);
}

export interface IUpdateShoppingList extends Pick<ICreateShoppingList, "name"> {
    complete_by?: Date;
    id: string;
}

/**
 * Updates existing shopping list.
 */
export function updateShoppingListMutator(_: string, {arg}: TMutatorArguments<IUpdateShoppingList>) {
    const {id, ...rest} = arg;

    return authenticatedMutator<TShoppingListDetail>(
        [...apiRoutes.shoppingList.updateShoppingList, { id }],
        rest
    );
}