import {authenticatedMutator, TFetcherKey, TMutatorKey} from "@Utils/axios.config";
import {apiRoutes, TMutatorArguments } from "src/config/api/routes";
import { IPatchShoppingList } from "./shopping-list";

/**
 * Closes existing shopping list.
 * @param _
 * @param arg ID of the shopping list to close.
 */
export function leaveShoppingListMutator(_: TFetcherKey|TMutatorKey, {arg}: TMutatorArguments<IPatchShoppingList>) {
    const {id} = arg;
    return authenticatedMutator<undefined>([...apiRoutes.shoppingList.members.leaveList, { id }]);
}