import React, {useCallback, useMemo, useRef} from "react";
import {Grid, GridProps} from "../../../../styled-system/jsx";
import {ShoppingListCard} from "@Components/features/ShoppingList/ShoppingListCard.tsx";
import {IShoppingListModalRef, ShoppingListModal} from "@Components/features/ShoppingList/ShoppingListModal.tsx";
import {TShoppingListFilters} from "@Components/features/ShoppingList/ShoppingListFilters.tsx";
import {ConfirmationDialog, IConfirmationDialogRef} from "@Components/features/Common/ConfirmationDialog.tsx";
import useInfiniteScroll from "react-infinite-scroll-hook";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import {apiRoutes} from "../../../config/api/routes.ts";
import {EShoppingListView, TShoppingListOverview} from "../../../types/shopping-list.ts";
import {Arguments} from "swr";
import {TPaginatedData} from "../../../types/api.ts";
import * as R from "remeda";
import {css} from "../../../../styled-system/css";
import {Spinner} from "@ParkComponents/ui";
import {authenticatedFetcher} from "@Utils/axios.config.ts";
import { formatISO } from "date-fns";

interface IProps extends Omit<GridProps, 'filter'> {
    filter?: TShoppingListFilters,
    view?: EShoppingListView
}

export const ShoppingListGrid: React.FC<IProps> = ({filter, view = EShoppingListView.all, ...gridProps}) => {
    // prepare query filters
    const queryFilters = useMemo(() => {
        const search = filter && filter.search ? { search: filter.search } : {};
        const completeBefore = filter && filter.completeBefore ? {
            completeBefore: formatISO(filter.completeBefore)
        } : {};
        const includeCompleted = filter ? { includeCompleted: filter.showCompleted.toString() } : {};

        return {
            ...search,
            ...completeBefore,
            includeOnly: view,
            ...includeCompleted,
        };
    }, [filter, view]);

    // function that generates the next key for SWR and includes the query filters
    const getSwrKey = useCallback<SWRInfiniteKeyLoader<TPaginatedData<TShoppingListOverview>, Arguments>>(
        (pageIndex, previousPageData) => {
            // if the previous data we got has the same page as the highest stated in the response, there are no more pages
            if (previousPageData && previousPageData.page === previousPageData.maxPage) return null;

            return [apiRoutes.shoppingList.listShoppingLists[1], null, {...queryFilters, page: pageIndex + 1, pageSize: 30 }];
        }, [queryFilters]
    );

    // fetch infinite data
    const { isLoading, data, size: pages, setSize: setPages, error } = useSWRInfinite<TPaginatedData<TShoppingListOverview>>(getSwrKey, authenticatedFetcher);

    // all items merged into one array from the paginated responses
    const mergedItems = useMemo<TShoppingListOverview[]>(() => {
        return R.flatMap(data || [], (d) => d.items);
    }, [data]);

    // whether there are more pages to fetch or not
    const hasMore = useMemo<boolean>(() => {
        if (!data && !error) return true;

        const lastResponse = R.last(data || []);

        if (!lastResponse) return true;

        return data
            ? lastResponse.page < lastResponse.maxPage
            : false
        ;
    }, [data]);

    const [sentryRef] = useInfiniteScroll({
        onLoadMore: () => setPages(pages + 1),
        hasNextPage: hasMore,
        loading: isLoading,
        disabled: !!error
    });

    // modal refs to open on context actions
    const shoppingModalRef = useRef<IShoppingListModalRef>(null);
    const deleteConfirmationModalRef = useRef<IConfirmationDialogRef>(null);
    const closeConfirmationModalRef = useRef<IConfirmationDialogRef>(null);
    const leaveListConfirmationModalRef = useRef<IConfirmationDialogRef>(null);

    /**
     * Closes a given shopping list.
     * @param list
     */
    const closeList = (list: TShoppingListOverview): void => {

    }

    /**
     * Removes the currently logged-in user from a given list.
     * @param list
     */
    const leaveList = (list: TShoppingListOverview): void => {

    }

    const deleteShoppingList = (list: TShoppingListOverview): void => {

    }

    return <>
        <Grid {...gridProps} columns={2} gap='4'>
            {mergedItems.map((list: TShoppingListOverview) => <ShoppingListCard
                    key={list._id}
                    shoppingList={list}
                    onUpdate={() => shoppingModalRef.current?.openModal(list)}
                    onDelete={() => deleteConfirmationModalRef.current?.openModal(() => deleteShoppingList(list))}
                    onCloseList={() => closeConfirmationModalRef.current?.openModal(() => closeList(list))}
                    onLeaveList={() => leaveListConfirmationModalRef.current?.openModal(() => leaveList(list))}
                />
            )}
            {isLoading && <div className={css({gridColumn: "1/3"})} ref={sentryRef}>
                <Spinner/>
            </div>}
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