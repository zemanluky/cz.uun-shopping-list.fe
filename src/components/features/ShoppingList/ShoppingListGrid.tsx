import React, {useMemo, useRef} from "react";
import {TShoppingList} from "../../../types/shopping-list.ts";
import {Grid, GridProps} from "../../../../styled-system/jsx";
import {ShoppingListCard} from "@Components/features/ShoppingList/ShoppingListCard.tsx";
import {IShoppingListModalRef, ShoppingListModal} from "@Components/features/ShoppingList/ShoppingListModal.tsx";
import {TShoppingListFilters} from "@Components/features/ShoppingList/ShoppingListFilters.tsx";
import {useAuth} from "../../../contexts";
import {isAfter} from "date-fns";

interface IProps extends Omit<GridProps, 'filter'> {
    shoppingLists: Array<TShoppingList>,
    filter?: TShoppingListFilters
}

export const ShoppingListGrid: React.FC<IProps> = ({filter, shoppingLists, ...gridProps}) => {
    const {user} = useAuth();
    const shoppingModalRef = useRef<IShoppingListModalRef>(null);

    const filteredItems = useMemo(
        () => shoppingLists.filter(listItem => {
            if (!user) return false;
            if (listItem.author_id !== user.id && !listItem.members.includes(user.id)) return false;

            // if filters are not set, we can safely add the item
            if (!filter) return true;

            if (filter.search !== null && !listItem.name.includes(filter.search)) return false;
            if (!filter.showCompleted && listItem.completed_at !== null) return false;
            if (filter.completeBefore && isAfter(listItem.complete_by, filter.completeBefore)) return false;

            return true;
        }),
        [shoppingLists, user, filter]
    );

    return <>
        <Grid {...gridProps} columns={2} gap='4'>
            {filteredItems.map(list =>
                <ShoppingListCard key={list.id} shoppingList={list} shoppingModalRef={shoppingModalRef}/>
            )}
        </Grid>
        <ShoppingListModal ref={shoppingModalRef}/>
    </>
}