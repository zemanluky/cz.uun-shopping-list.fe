import * as React from 'react';
import {createContext, useContext, useEffect, useMemo, useState} from "react";
import {ShoppingList, ShoppingListItem} from "../types/shopping-list.ts";
import {useShoppingLists} from "./ShoppingListsContext.tsx";
import {TUser} from "../types/auth.ts";
import {DateTime} from "luxon";

interface ShoppingListContextType {
    shoppingList: ShoppingList|null;
    setShoppingList: (id: number|null) => void;
    items: Array<ShoppingListItem>|null;
    saveItem: (item: ShoppingListItem) => void;
    toggleItem: (id: number, user: TUser) => void;
    removeItem: (id: number) => void;
    addMember: (id: number) => void;
    removeMember: (id: number) => void;
}

const ShoppingListContext = createContext<ShoppingListContextType|undefined>(undefined);

export const ShoppingListProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const {shoppingLists, saveShoppingList} = useShoppingLists();

    const [shoppingListId, setShoppingListId] = useState<number|null>(null);

    const shoppingList = useMemo(
        () => shoppingLists.find(sl => sl.id === shoppingListId) || null,
        [shoppingListId, shoppingLists]
    );
    const items = useMemo<Array<ShoppingListItem>|null>(() => {
        if (!shoppingList) return null;
        return shoppingList.items;
    }, [shoppingListId, shoppingLists, shoppingList]);

    /**
     * Adds or updates item to the current shopping list.
     * @param item
     */
    const saveItem = (item: ShoppingListItem): void => {
        if (!shoppingListId) {
            console.error('Cannot save a ');
            return;
        }
    }

    /**
     * Removes item from the current shopping list.
     * @param id
     */
    const removeItem = (id: number): void => {

    }

    /**
     * Toggles completeness of a given item.
     * @param id
     * @param user
     */
    const toggleItem = (id: number, user: TUser): void => {
        if (!shoppingList || !items) return;

        const newItems = items.map(item => {
            if (item.id === id) {
                if (item.completed_at === null) {
                    item.completed_at = DateTime.now();
                    item.completed_by = user.id;
                }
                else {
                    item.completed_at = null;
                    item.completed_by = null;
                }
            }

            return item;
        });

        saveShoppingList({ ...shoppingList, items: newItems }, shoppingList.id);
    }

    /**
     * Adds a member to the current shopping list.
     * NOTE: This logic will probably be handled via API mutations in the future, rather than here.
     * @param id
     */
    const addMember = (id: number): void => {
        if (!shoppingList) return;

        // we could probably verify whether the user currently logged-in is the owner of the shopping list.
        // however, in the future, when we connect this app to BE, it will be verified on the BE, rather than here...
        // because of that, the only place where we verify this condition is in the UI (only the author will see the 'add member' button)

        const set = new Set(shoppingList.members);
        set.add(id);

        saveShoppingList({ ...shoppingList, members: Array.from(set.values()) }, shoppingList.id);
    }

    /**
     * Removes member from the current shopping list.
     * NOTE: This logic will probably be handled via API mutations in the future, rather than here.
     * @param id
     */
    const removeMember = (id: number): void => {
        if (!shoppingList) return;

        const set = new Set(shoppingList.members);
        set.delete(id);

        saveShoppingList({ ...shoppingList, members: Array.from(set.values()) }, shoppingList.id);
    }

    return <ShoppingListContext.Provider value={{
        shoppingList, items,
        addMember, removeMember,
        saveItem, removeItem, toggleItem,
        setShoppingList: (id: number|null) => setShoppingListId(id)
    }}>
        {children}
    </ShoppingListContext.Provider>;
};

export const useShoppingList = (id?: number): ShoppingListContextType => {
    const ctx = useContext(ShoppingListContext);

    if (!ctx)
        throw new Error(
            "The 'useShoppingList' hook may only be used in components wrapped inside the ShoppingListProvider. " +
            "Please, ensure your component is inside the provider."
        );

    useEffect(() => {
        if (id !== undefined) ctx.setShoppingList(id);

        return () => {
            if (id !== undefined) ctx.setShoppingList(null);
        }
    }, [id]);

    return ctx;
}