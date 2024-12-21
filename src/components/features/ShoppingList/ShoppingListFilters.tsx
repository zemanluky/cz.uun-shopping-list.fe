import React, {useEffect, useMemo, useState} from "react";
import {Grid, GridProps} from "../../../../styled-system/jsx";
import {Field, SingleDateInput} from "@Components/ui/Form";
import {Input} from "@ParkComponents/ui/Input.tsx";
import {Checkbox, Heading} from "@ParkComponents/ui";
import * as R from "remeda";
import {parseDate} from "@ark-ui/react";
import { useSearchParams } from "react-router-dom";
import {formatISO, parseISO} from "date-fns";

export type TShoppingListFilters = {
    search: string|null;
    completeBefore: Date|null;
    showCompleted: boolean;
    includeOnly: EShoppingListView;
}

interface IProps extends GridProps {
    onFilterChange: (filters: TShoppingListFilters) => void;
}

export const ShoppingListFilters: React.FC<IProps> = ({onFilterChange, ...gridProps}) => {
    const [searchParams, setSearchParams] = useSearchParams();
    const [filter, setFilter] = useState<TShoppingListFilters>({
        search: null,
        completeBefore: null,
        showCompleted: false,
        includeOnly: EShoppingListView.all
    });

    const debounceFilterChange = useMemo(() => R.debounce(onFilterChange, {waitMs: 300, timing: "trailing"}), []);

    // set the initial filter values from search params
    useEffect(() => {
        const search = searchParams.get('search');
        const completeBefore = searchParams.get('completeBefore');
        const showCompleted = searchParams.get('showCompleted');
        const includeOnly = searchParams.get('includeOnly');

        const initialFilter: TShoppingListFilters = {
            search: search || null,
            completeBefore: completeBefore ? parseISO(completeBefore) : null,
            showCompleted: showCompleted === 'true',
            includeOnly: includeOnly ? includeOnly as EShoppingListView : EShoppingListView.all
        };

        setFilter(initialFilter);
        onFilterChange(initialFilter);
    }, []);

    /**
     * Updates the search params with the new filter.
     * @param newFilter
     */
    const updateSearchParams = (newFilter: TShoppingListFilters) => {
        const { search, completeBefore, showCompleted } = newFilter;

        const newSearchParams: Record<string, string|Array<string>> = {};

        if (search) newSearchParams['search'] = search;
        if (showCompleted) newSearchParams['showCompleted'] = 'true';
        if (completeBefore) newSearchParams['completeBefore'] = formatISO(completeBefore);
        if (includeOnly !== EShoppingListView.all) newSearchParams['includeOnly'] = includeOnly;

        setSearchParams(newSearchParams, { replace: false });
    };
    const debouncedUpdateSearchParams = useMemo(() => R.debounce(updateSearchParams, {waitMs: 300, timing: "trailing"}), []);

    /**
     * Updates filter's value on a given key.
     * @param key
     * @param value
     */
    const changeFilter = <TKey extends keyof TShoppingListFilters>(key: TKey, value: TShoppingListFilters[TKey]) => {
        const updatedFilter = {...filter, [key]: value};
        setFilter(updatedFilter);
        debouncedUpdateSearchParams.call(updatedFilter);
        debounceFilterChange.call(updatedFilter);
    }

    const { showCompleted, search, completeBefore } = filter;

    return <Grid {...gridProps} gridTemplateColumns={'3fr 3fr 2fr'} alignItems="center" columnGap='4' rowGap='2'>
        <Heading as={'h4'} gridColumn="1/4" fontSize="xl">Filtry</Heading>
        <Field label="Vyhledat">
            <Input value={search || ''}
                   placeholder="Víkendový feast..."
                   onChange={(e) => changeFilter('search', e.target.value.length ? e.target.value : null)}/>
        </Field>
        <Field label="Dokončit před">
            <SingleDateInput value={completeBefore}
                             onChange={(newDate) => changeFilter('completeBefore', newDate)}
                             min={parseDate(new Date())}
            />
        </Field>
        <Field type="any">
            <Checkbox checked={showCompleted} onCheckedChange={() => changeFilter('showCompleted', !showCompleted)}>
                Zobrazit hotové
            </Checkbox>
        </Field>
    </Grid>
}