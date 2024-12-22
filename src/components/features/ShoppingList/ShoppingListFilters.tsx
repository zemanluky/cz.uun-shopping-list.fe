import React, {useEffect, useMemo, useState} from "react";
import {Grid, HStack, VStack, VstackProps} from "../../../../styled-system/jsx";
import {Field, SingleDateInput} from "@Components/ui/Form";
import {Input} from "@ParkComponents/ui/Input.tsx";
import {Button, Checkbox, Heading, Text} from "@ParkComponents/ui";
import * as R from "remeda";
import {parseDate} from "@ark-ui/react";
import {useSearchParams} from "react-router-dom";
import {formatISO, parseISO} from "date-fns";
import {SegmentGroup} from "@Components/ui/SegmentGroup.tsx";
import {EShoppingListView} from "../../../types/shopping-list.ts";
import {HugeIcon} from "@Components/ui/HugeIcon.tsx";
import {FilterIcon} from "hugeicons-react";
import {Dialog, DialogButtons, DialogContent, DialogHeading} from "@Components/ui/Dialog";

export type TShoppingListFilters = {
    search: string|null;
    completeBefore: Date|null;
    showCompleted: boolean;
    includeOnly: EShoppingListView;
}

interface IProps extends VstackProps {
    onFilterChange: (filters: TShoppingListFilters) => void;
}

export const ShoppingListFilters: React.FC<IProps> = ({onFilterChange, ...vStackProps}) => {
    const [isFilterDialogOpen, setFilterDialogOpen] = useState<boolean>(false);
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
        const { search, completeBefore, showCompleted, includeOnly } = newFilter;

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

    const { includeOnly, search, completeBefore, showCompleted } = filter;
    const minDate = useMemo(() => parseDate(new Date()), []);

    /**
     * Renders the filter fields.
     * @param renderForModal
     */
    const renderFilters = (renderForModal: boolean = false): React.ReactNode => {
        return <>
            <Field label="Vyhledat" w="100%">
                <Input
                    value={search || ''}
                    placeholder="Víkendový feast..."
                    onChange={(e) => changeFilter('search', e.target.value.length ? e.target.value : null)}/>
            </Field>
            <Field label="Dokončit před" w="100%">
                <SingleDateInput
                    value={completeBefore}
                    onChange={(newDate) => changeFilter('completeBefore', newDate)}
                    min={minDate}
                />
            </Field>
            <Field type="any" w="100%" label={renderForModal ? null : ''}>
                <Checkbox
                    checked={showCompleted}
                    onCheckedChange={() => changeFilter('showCompleted', !showCompleted)}
                >
                    Zobrazit hotové
                </Checkbox>
            </Field>
        </>
    }

    return <VStack {...vStackProps} alignItems="flex-start" w="100%" gap="4">
        <HStack justifyContent="space-between" w="100%">
            <Heading as={'h4'} gridColumn="1/4" fontSize="xl">Filtry</Heading>
            <Button variant="outline" display={{ base: 'flex', md: 'none' }} onClick={() => setFilterDialogOpen(true)}>
                <HugeIcon icon={<FilterIcon/>}/>
                Upravit filtraci
            </Button>
        </HStack>
        <Grid
            display={{ base: 'none', md: 'grid' }}
            gridTemplateColumns='3fr 3fr 2fr'
            gridTemplateRows="auto"
            alignItems="center"
            columnGap='4'
            rowGap='2'
            w="100%"
        >
            {renderFilters()}
        </Grid>
        <SegmentGroup
            items={[
                { id: EShoppingListView.all, label: 'Všechny seznamy' },
                { id: EShoppingListView.own, label: 'Moje seznamy' },
                { id: EShoppingListView.shared, label: 'Seznamy kamarádů' },
            ]}
            activeItem={includeOnly}
            onItemChange={(item) => changeFilter('includeOnly', item as EShoppingListView)}
            mt={2}
        />
        <Dialog isOpen={isFilterDialogOpen}>
            <DialogHeading heading="Filtry" onCancel={() => setFilterDialogOpen(false)}/>
            <DialogContent>
                <VStack alignItems="flex-start" w="100%" gap={4}>
                    <Text>Filtry, které zde nastavíte, jsou ihned aplikovány.</Text>
                    {renderFilters(true)}
                </VStack>
            </DialogContent>
            <DialogButtons buttons={[ <Button onClick={() => setFilterDialogOpen(false)}>Zavřít</Button> ]}/>
        </Dialog>
    </VStack>
}