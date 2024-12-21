import React, {useCallback, useEffect, useMemo, useRef} from "react";
import {Grid, GridProps} from "../../../../styled-system/jsx";
import {ShoppingListCard} from "@Components/features/ShoppingList/ShoppingListCard.tsx";
import {TShoppingListFilters} from "@Components/features/ShoppingList/ShoppingListFilters.tsx";
import useInfiniteScroll from "react-infinite-scroll-hook";
import useSWRInfinite, { SWRInfiniteKeyLoader } from "swr/infinite";
import {apiRoutes} from "../../../config/api/routes.ts";
import {TShoppingListOverview} from "../../../types/shopping-list.ts";
import {Arguments} from "swr";
import {TPaginatedData} from "../../../types/api.ts";
import * as R from "remeda";
import {Spinner} from "@ParkComponents/ui";
import {authenticatedFetcher} from "@Utils/axios.config.ts";
import { formatISO } from "date-fns";
import {Skeleton} from "@ParkComponents/ui/skeleton.tsx";
import {
    IShoppingListActionModalsRef,
    ShoppingListActionModals
} from "@Components/features/ShoppingList/ShoppingListActionModals.tsx";

const PAGE_SIZE: number = 20;

interface IProps extends Omit<GridProps, 'filter'> {
    filter?: TShoppingListFilters,
    onViewValidation?: (validating: boolean) => void
}

export const ShoppingListGrid: React.FC<IProps> = ({filter, onViewValidation, ...gridProps}) => {
    // prepare query filters
    const queryFilters = useMemo(() => {
        const search = filter && filter.search ? { search: filter.search } : {};
        const completeBefore = filter && filter.completeBefore ? {
            completeBefore: formatISO(filter.completeBefore)
        } : {};
        const includeCompleted = filter ? { includeCompleted: filter.showCompleted.toString() } : {};
        const includeOnly = filter ? { includeOnly: filter.includeOnly } : {};

        return {
            ...search,
            ...includeOnly,
            ...completeBefore,
            ...includeCompleted,
        };
    }, [filter]);

    // function that generates the next key for SWR and includes the query filters
    const getSwrKey = useCallback<SWRInfiniteKeyLoader<TPaginatedData<TShoppingListOverview>, Arguments>>(
        (pageIndex, previousPageData) => {
            // if the previous data we got has the same page as the highest stated in the response, there are no more pages
            if (previousPageData && previousPageData.page === previousPageData.maxPage) return null;

            return [apiRoutes.shoppingList.listShoppingLists[1], null, {...queryFilters, page: pageIndex + 1, pageSize: PAGE_SIZE }];
        }, [queryFilters]
    );

    // fetch infinite data
    const {
        isLoading, isValidating, data,
        size: pages, setSize: setPages,
        error, mutate
    } = useSWRInfinite<TPaginatedData<TShoppingListOverview>>(getSwrKey, authenticatedFetcher, {
        keepPreviousData: true, parallel: true
    });

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

    useEffect(() => onViewValidation?.(isValidating), [isValidating]);

    const shoppingListActionModalsRef = useRef<IShoppingListActionModalsRef>(null);

    if (isLoading && !data) {
        return <Grid {...gridProps} columns={2} gap='4'>
            <Skeleton minH="250px"></Skeleton>
            <Skeleton minH="250px"></Skeleton>
            <Skeleton minH="250px"></Skeleton>
            <Skeleton minH="250px"></Skeleton>
        </Grid>
    }

    /**
     * Mutates appropriate pages based on updated shopping list's index.
     * In short, this method invalidates all pages after, and including, the page where the updated shopping list is.
     * @param index The index of the updated shopping list.
     */
    const mutatePage = (index: number): void => {
        // the page index is 1-based
        const pageIndex = Math.floor(index / PAGE_SIZE) + 1;

        mutate(undefined, {
            revalidate: (_pageData, args: Arguments) => {
                if (!args || !Array.isArray(args) || typeof args[1] !== "number") return true;
                return args[1] >= pageIndex;
            }
        });
    }

    return <>
        {!isLoading && !isValidating && mergedItems.length === 0 && <h1>Nebyly nalezeny žádné seznamy, zkuste změnit filtr</h1>}
        <Grid {...gridProps} columns={2} gap='4'>
            {mergedItems.map((list: TShoppingListOverview, index: number) => <ShoppingListCard
                key={list._id}
                shoppingList={list}
                onUpdate={() => shoppingListActionModalsRef.current?.openEditModal(list, () => mutatePage(index))}
                onDelete={() => shoppingListActionModalsRef.current?.openDeleteConfirmModal(list, () => mutatePage(index))}
                onCloseList={() => shoppingListActionModalsRef.current?.openCloseListConfirmModal(list, () => mutatePage(index))}
                onLeaveList={() => shoppingListActionModalsRef.current?.openLeaveListConfirmModal(list, () => mutatePage(index))}
            />)}
            <div className="extra-loader" ref={sentryRef}>
                {isLoading && data ? <Spinner/> : null}
            </div>
        </Grid>
        <ShoppingListActionModals ref={shoppingListActionModalsRef}/>
    </>
}