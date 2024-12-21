import {authenticatedMutator, TFetcherKey, TMutatorKey} from "@Utils/axios.config";
import {apiRoutes, TMutatorArguments } from "src/config/api/routes";
import { IPatchShoppingList } from "./shopping-list";
import {EShoppingListMemberPermission} from "../../types/shopping-list-member.ts";
import {TShoppingListDetail} from "../../types/shopping-list.ts";

/**
 * Closes existing shopping list.
 * @param _
 * @param arg ID of the shopping list to close.
 */
export function leaveShoppingListMutator(_: TFetcherKey|TMutatorKey, {arg}: TMutatorArguments<IPatchShoppingList>) {
    const {id} = arg;
    return authenticatedMutator<undefined>([...apiRoutes.shoppingList.members.leaveList, { id }]);
}

interface IListMemberArgs extends IPatchShoppingList {
    // ID of the user to add to the list
    userId: string;
    // permission to grant to the user
    permission: EShoppingListMemberPermission
}

export type TShoppingListMembersUpdate = {
    members: TShoppingListDetail['members']
}

/**
 * Adds a member to a shopping list.
 * @param _
 * @param arg
 */
export function addListMemberMutator(_: TFetcherKey|TMutatorKey, {arg}: TMutatorArguments<IListMemberArgs>) {
    const {id, userId, permission} = arg;
    return authenticatedMutator<TShoppingListMembersUpdate>(
        [...apiRoutes.shoppingList.members.addMember, { id, userId }],
        { members: [{ user: userId, permission }] }
    );
}

/**
 * Updates a member's permission in a shopping list.
 * @param _
 * @param arg
 */
export function updateMemberPermissionMutator(_: TFetcherKey|TMutatorKey, {arg}: TMutatorArguments<IListMemberArgs>) {
    const {id, userId, permission} = arg;
    return authenticatedMutator<TShoppingListMembersUpdate>(
        [...apiRoutes.shoppingList.members.updatePermissions, { id, memberId: userId }],
        { permission }
    );
}

/**
 * Removes a member from a shopping list.
 * @param _
 * @param arg
 */
export function removeMemberMutator(_: TFetcherKey|TMutatorKey, {arg}: TMutatorArguments<Omit<IListMemberArgs, 'permission'>>) {
    const {id, userId} = arg;
    return authenticatedMutator<TShoppingListMembersUpdate>([...apiRoutes.shoppingList.members.removeMember, { id, memberId: userId }]);
}