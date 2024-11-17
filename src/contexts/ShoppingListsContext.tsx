import * as React from 'react';
import {createContext, useContext, useState} from "react";
import {TShoppingList} from "../types/shopping-list.ts";
import {shoppingLists as initialShoppingLists} from "../data/shopping-lists.ts";

interface ShoppingListsContextType {
    shoppingLists: Array<TShoppingList>;
    saveShoppingList: (data: Omit<TShoppingList, 'id'|'last_updated'>, id?: number|null) => void;
    deleteShoppingList: (id: number) => void;
}

const ShoppingListsContext = createContext<ShoppingListsContextType|undefined>(undefined);

export const ShoppingListsProvider: React.FC<{children: React.ReactNode}> = ({ children }) => {
    const [shoppingLists, setShoppingLists] = useState<Array<TShoppingList>>(initialShoppingLists);

    /** Helper function to retrieve index in the mock array. */
    const getShoppingListIndex = (id: number) => shoppingLists.findIndex(list => list.id === id);

    /**
     * Creates or updates an existing list.
     * @param data
     * @param id
     */
    const saveShoppingList = (data: Omit<TShoppingList, 'id'|'last_updated'>, id: number|null = null): void => {
        // creating new list
        if (id === null) {
            const lastId = Math.max(...shoppingLists.map(sl => sl.id));
            const newList: TShoppingList = { ...data, id: lastId + 1, last_updated: new Date() };

            setShoppingLists(prev => [...prev, newList]);
            return;
        }

        const updatedList: TShoppingList = { ...data, id, last_updated: new Date() };
        const index = getShoppingListIndex(id);

        // we did not find the index, let's create the entry instead
        if (index === -1) {
            setShoppingLists(prev => [...prev, updatedList]);
            return;
        }

        setShoppingLists(shoppingLists.map((sl, idx): TShoppingList => {
            if (idx === index)
                return updatedList;

            return sl;
        }));
    }

    /**
     * Deletes a given shopping list.
     */
    const deleteShoppingList = (id: number): void => {
        setShoppingLists(shoppingLists.filter(list => list.id !== id));
    }

    return <ShoppingListsContext.Provider value={{
        shoppingLists,
        saveShoppingList,
        deleteShoppingList
    }}>
        {children}
    </ShoppingListsContext.Provider>;
};

export const useShoppingLists = (): ShoppingListsContextType => {
    const ctx = useContext(ShoppingListsContext);

    if (!ctx)
        throw new Error(
            "The 'useShoppingList' hook may only be used in components wrapped inside the ShoppingListProvider. " +
            "Please, ensure your component is inside the provider."
        );

    return ctx;
}