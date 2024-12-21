import {Combobox, createListCollection} from '@ParkComponents/ui'
import { Input } from '@ParkComponents/ui/Input';
import {useMemo, useRef, useState} from "react";
import {IconButton} from "@ParkComponents/ui/icon-button.tsx";
import {HugeIcon} from "@Components/ui/HugeIcon.tsx";
import {Cancel01Icon, CheckmarkCircle02Icon, UnfoldLessIcon, UnfoldMoreIcon} from "hugeicons-react";
import {flex} from "../../../../styled-system/patterns";
import {Box} from "../../../../styled-system/jsx";

export interface IAutocompleteOption<TValueType extends string|number> {
    /** Value of the option. */
    value: TValueType;
    /** Label to show in the autocomplete. */
    label: string;
    /** Whether the option is disabled. */
    disabled?: boolean;
}

interface IProps<TValueType extends string|number> {
    /** Selected value. */
    value: TValueType|null;

    /** Called when the selected value changes. */
    onChange: (value: TValueType|null) => void;

    /** Options to show in the autocomplete. */
    options: Array<IAutocompleteOption<TValueType>>;

    /**
     * Called when the search value changes.
     * When not provided, the autocomplete input tries to filter the given options by the label.
     */
    onSearchChange?: (search: string) => void;

    /** Placeholder to show in the input. */
    placeholder?: string;
}

/** Autocomplete input component. */
export function AutocompleteInput<TValueType extends string|number = string>({value, onChange, placeholder, options, onSearchChange}: IProps<TValueType>) {
    const searchRef = useRef<HTMLInputElement>(null);
    const isSearchedExternally = useMemo(() => !!onSearchChange, [onSearchChange]);
    const [search, setSearch] = useState<string>('');
    const [isOpen, setIsOpen] = useState<boolean>(false);

    /** filtered options when the internal search logic is used */
    const filteredOptions: Array<IAutocompleteOption<TValueType>> = useMemo(() => {
        if (!search || isSearchedExternally) return options;

        const normalizedSearchValue = search.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, '');

        // filter the collection by the label
        return options.filter((item) => {
            const normalizedLabel = item.label.toLowerCase().normalize("NFD").replace(/\p{Diacritic}/gu, '');
            return normalizedLabel.includes(normalizedSearchValue);
        });
    }, [options, search, isSearchedExternally, isOpen]);

    /** collection to show in the autocomplete */
    const collection = useMemo(() => createListCollection({
        isItemDisabled: (item) => item.disabled ?? false,
        itemToValue: (item) => item.value.toString(),
        itemToString: (item) => item.label,
        items: isSearchedExternally ? options : filteredOptions
    }), [options, filteredOptions, isSearchedExternally]);

    const selectedValue = useMemo(() => {
        const values = collection.items.map(i => i.value);

        if (value === null || !values.includes(value)) return [];

        return [value.toString()];
    }, [value]);
    const selectedOptionLabel = useMemo<string|undefined>(() => {
        return options.find((option) => option.value === value)?.label;
    }, [value]);

    /**
     * Handles the search value change.
     * @param inputValue
     */
    const handleSearch = ({inputValue}: Combobox.InputValueChangeDetails) => {
        if (search === null || search === selectedOptionLabel) return;

        setSearch(inputValue);

        // we have a custom search handler defined
        if (onSearchChange) return onSearchChange(inputValue);
    };

    /**
     * Handles when the user selects a value.
     * @param value
     */
    const handleValueChange = ({items}: Combobox.ValueChangeDetails<IAutocompleteOption<TValueType>>) => {
        // user deselected an option or cleared the selection
        if (items.length === 0) return onChange(null);

        setSearch(items[0].label);
        onChange(items[0].value);
    }

    /**
     * Clears the search input and sets the initial visible input value.
     */
    const clearSearch = (): void => {
        setSearch('');
    }

    /**
     * Sets the search value to the selected option label.
     */
    const setSelectedOptionSearch = () => {
        if (selectedOptionLabel) setSearch(selectedOptionLabel);
    }

    return <Combobox.Root
        openOnClick={true}
        value={selectedValue}
        collection={collection}
        onValueChange={handleValueChange}
        onOpenChange={({open}) => setIsOpen(open)}
    >
        <Combobox.Control>
            <Combobox.Input asChild>
                <Input ref={searchRef} value={search}
                       onClick={() => clearSearch()}
                       onFocus={() => clearSearch()}
                       onBlur={() => setSelectedOptionSearch()}
                       onChange={(e) => handleSearch({inputValue: e.target.value})}
                       placeholder={placeholder ?? 'Vyberte možnost nebo vyhledejte...'}
                />
            </Combobox.Input>
            <Combobox.Trigger asChild>
                <IconButton variant="ghost" minWidth="min-content">
                    <HugeIcon icon={isOpen ? <UnfoldLessIcon/> : <UnfoldMoreIcon/>}/>
                </IconButton>
            </Combobox.Trigger>
        </Combobox.Control>
        <Combobox.Positioner>
            <Combobox.Content>
                <Combobox.ItemGroup>
                    {collection.items.length === 0
                        ? <Box className={flex({ alignItems: "center", justify: "center", py: 2, color: "fg.subtle" })}>
                            Nejsou k dispozici žádné položky
                        </Box>
                        : collection.items.map((item) => (
                            <Combobox.Item key={item.value} item={item}>
                                <Combobox.ItemText className={flex({ alignItems: 'center', gap: 2 })}>
                                    <Combobox.ItemIndicator>
                                        <HugeIcon icon={<CheckmarkCircle02Icon />}/>
                                    </Combobox.ItemIndicator>
                                    {item.label}
                                </Combobox.ItemText>
                                <Combobox.ItemIndicator>
                                    <Combobox.ClearTrigger asChild>
                                        <IconButton variant="ghost" minWidth="min-content">
                                            <HugeIcon icon={<Cancel01Icon />}/>
                                        </IconButton>
                                    </Combobox.ClearTrigger>
                                </Combobox.ItemIndicator>
                            </Combobox.Item>
                        ))
                    }
                </Combobox.ItemGroup>
            </Combobox.Content>
        </Combobox.Positioner>
    </Combobox.Root>;
}