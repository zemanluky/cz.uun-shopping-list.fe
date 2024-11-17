import React, {useMemo, useRef} from "react";
import {TShoppingList} from "../../../types/shopping-list.ts";
import {Grid, GridProps} from "../../../../styled-system/jsx";
import {ShoppingListCard} from "@Components/features/ShoppingList/ShoppingListCard.tsx";
import {IShoppingListModalRef, ShoppingListModal} from "@Components/features/ShoppingList/ShoppingListModal.tsx";
import {TShoppingListFilters} from "@Components/features/ShoppingList/ShoppingListFilters.tsx";
import {useAuth, useShoppingLists} from "../../../contexts";
import {isAfter} from "date-fns";
import {ConfirmationDialog, IConfirmationDialogRef} from "@Components/features/Common/ConfirmationDialog.tsx";

interface IProps extends Omit<GridProps, 'filter'> {
    shoppingLists: Array<TShoppingList>,
    filter?: TShoppingListFilters
}

export const ShoppingListGrid: React.FC<IProps> = ({filter, shoppingLists, ...gridProps}) => {
    const {user} = useAuth();
    const {deleteShoppingList, saveShoppingList} = useShoppingLists();
    const shoppingModalRef = useRef<IShoppingListModalRef>(null);
    const deleteConfirmationModalRef = useRef<IConfirmationDialogRef>(null);
    const closeConfirmationModalRef = useRef<IConfirmationDialogRef>(null);
    const leaveListConfirmationModalRef = useRef<IConfirmationDialogRef>(null);

    const filteredItems = useMemo(
        () => shoppingLists.filter(listItem => {
            if (!user) return false;
            if (listItem.author_id !== user.id && !listItem.members.includes(user.id)) return false;

            // if filters are not set, we can safely add the item
            if (!filter) return true;

            if (filter.search !== null && !listItem.name.toLowerCase().includes(filter.search.toLowerCase())) return false;
            if (!filter.showCompleted && listItem.completed_at !== null) return false;

            if (filter.completeBefore && listItem.completed_at === null
                && isAfter(listItem.complete_by, filter.completeBefore)
            ) {
                return false;
            }

            return true;
        }),
        [shoppingLists, user, filter]
    );

    /**
     * Closes a given shopping list.
     * @param list
     */
    const closeList = (list: TShoppingList): void => {
        if (!user) return;

        saveShoppingList({
            ...list,
            completed_at: new Date(),
            completed_by: user.id
        }, list.id);
    }

    /**
     * Removes the currently logged-in user from a given list.
     * @param list
     */
    const leaveList = (list: TShoppingList): void => {
        if (!user) return;

        saveShoppingList({
            ...list,
            completed_at: new Date(),
            completed_by: user.id
        }, list.id);
    }

    return <>
        <Grid {...gridProps} columns={2} gap='4'>
            {filteredItems.map(list =>
                <ShoppingListCard
                    key={list.id} shoppingList={list}
                    onUpdate={() => shoppingModalRef.current?.openModal(list)}
                    onDelete={() => deleteConfirmationModalRef.current?.openModal(() => deleteShoppingList(list.id))}
                    onCloseList={() => closeConfirmationModalRef.current?.openModal(() => closeList(list))}
                    onLeaveList={() => leaveListConfirmationModalRef.current?.openModal(() => leaveList(list))}
                />
            )}
        </Grid>
        <ShoppingListModal ref={shoppingModalRef}/>
        <ConfirmationDialog
            ref={deleteConfirmationModalRef}
            title="Opravdu chcete smazat seznam?"
            description="Smazáním seznamu přijdete o zadané položky a nebude možné je obnovit."
            prompts={{confirm: 'Ano, smazat seznam', cancel: 'Ne, ponechat seznam'}}
        />
        <ConfirmationDialog
            ref={closeConfirmationModalRef}
            title="Opravdu chcete uzavřít tento seznam?"
            description="Uzavřením seznamu přijdete o možnost ho editovat. Seznam zůstane ve stavu, v jakém je a nebude možné přidávat nové položky."
            prompts={{confirm: 'Ano, uzavřít', cancel: 'Ne, ponechat editovatelný'}}
        />
        <ConfirmationDialog
            ref={leaveListConfirmationModalRef}
            title="Opravdu chcete odejít z tohoto seznamu?"
            description="Odchodem ze seznamu vám tento seznam zmizí z přehledu a nebude možné se na něj dostat. Pokud ho budete chtít mít znovu zobrazený, bude vás muset autor přidat zpět."
            prompts={{confirm: 'Ano, chci odejít', cancel: 'Ne, zůstanu'}}
        />
    </>
}