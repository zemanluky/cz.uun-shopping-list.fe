import {TUser} from "./user.ts";

export enum EShoppingListMemberPermission {
    read = 'read',
    write = 'write'
}

export type TShoppingListMember = {
    user: TUser,
    permission?: EShoppingListMemberPermission
}