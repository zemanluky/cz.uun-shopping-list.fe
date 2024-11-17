import React, {useRef} from "react";
import {TShoppingList} from "../../../types/shopping-list.ts";
import {Grid} from "../../../../styled-system/jsx";
import {ShoppingListCard} from "@Components/features/ShoppingList/ShoppingListCard.tsx";
import {IShoppingListModalRef, ShoppingListModal} from "@Components/features/ShoppingList/ShoppingListModal.tsx";

interface IProps {
    shoppingLists: Array<TShoppingList>
}

export const ShoppingListGrid: React.FC<IProps> = ({shoppingLists}) => {
    const shoppingModalRef = useRef<IShoppingListModalRef>(null);

    return <>
        <Grid columns={2} gap='4'>
            {shoppingLists.map(list =>
                <ShoppingListCard key={list.id} shoppingList={list} shoppingModalRef={shoppingModalRef}/>
            )}
        </Grid>
        <ShoppingListModal ref={shoppingModalRef}/>
    </>
}