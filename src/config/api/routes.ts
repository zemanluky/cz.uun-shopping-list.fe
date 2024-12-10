export type THttpMethod = 'GET'|'POST'|'PUT'|'PATCH'|'DELETE';
type TRouteTuple = [THttpMethod, string];
type TApiRoute = { [k: string]: TRouteTuple | TApiRoute };

/**
 * Declares all API routes with their respective HTTP method.
 */
export const apiRoutes = {
    auth: {
        login: ['POST', '/auth/login'],
        logout: ['DELETE', '/auth/logout'],
        identity: ['GET', '/auth/identity'],
        refresh: ['GET', '/auth/refresh'],
    },
    user: {
        listUsers: ['GET', '/user'],
        userDetail: ['GET', '/user/:id'],
        registerAvailability: ['GET', '/user/registration/availability'],
        register: ['POST', '/user/registration'],
        updateProfile: ['PUT', '/user/profile'],
    },
    shoppingList: {
        items: {
            addItem: ['POST', '/shopping-list/:id/item'],
            removeItem: ['DELETE', '/shopping-list/:id/item/:itemId'],
            updateItem: ['PUT', '/shopping-list/:id/item/:itemId'],
            toggleItemStatus: ['PATCH', '/shopping-list/:id/item/:itemId/completed-status'],
        },
        members: {
            addMember: ['POST', '/shopping-list/:id/member'],
            removeMember: ['DELETE', '/shopping-list/:id/member/:memberId'],
            updatePermissions: ['PATCH', '/shopping-list/:id/member/:memberId/permission'],
            leaveList: ['DELETE', '/shopping-list/:id/member'],
        },
        listShoppingLists: ['GET', '/shopping-list'],
        shoppingListDetail: ['GET', '/shopping-list/:id'],
        createShoppingList: ['POST', '/shopping-list'],
        updateShoppingList: ['PUT', '/shopping-list/:id'],
        deleteShoppingList: ['DELETE', '/shopping-list/:id'],
        closeShoppingList: ['PATCH', '/shopping-list/:id/completed-status'],
    },
} satisfies TApiRoute;

export type TMutatorArguments<TData = any> = { arg: TData };