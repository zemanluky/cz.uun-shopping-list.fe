import {TUser} from "./user.ts";
import {TShoppingListItem} from "./shopping-list-item.ts";
import {TShoppingListMember} from "./shopping-list-member.ts";

export const temporaryShoppingListId = 'temp';

export type TShoppingListItemStatistics = {
    total_items: number;
    completed_items: number;
};

export type TShoppingListOverview = {
    _id: string,
    name: string,
    complete_by: string,
    closed_at: string|null,
    created_at: string,
    updated_at: string,
    author: TUser,
    has_photo: boolean,
    stats: TShoppingListItemStatistics
}

export type TShoppingListDetail = TShoppingListOverview &{
    items: Array<TShoppingListItem>,
    members: Array<TShoppingListMember>
}

export enum EShoppingListView {
    all = 'all',
    own = 'own',
    shared = 'shared'
}

export type TShoppingListListQueryParams = {
    page?: number,
    pageSize?: number,
    search?: string
    includeOnly?: EShoppingListView,
    includeCompleted?: boolean,
    completeBy?: string,
    author?: string
}