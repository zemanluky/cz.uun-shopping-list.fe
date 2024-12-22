import {Select, createListCollection} from '@ParkComponents/ui'
import {useMemo, useState} from "react";
import {HugeIcon} from "@Components/ui/HugeIcon.tsx";
import {CheckmarkCircle02Icon, UnfoldLessIcon, UnfoldMoreIcon} from "hugeicons-react";
import {ValueChangeDetails} from "@ParkComponents/ui/styled/combobox.tsx";

export interface ISelectOption<TValueType extends string|number> {
    /** Value of the option. */
    value: TValueType;
    /** Label to show in the autocomplete. */
    label: string;
    /** Whether the option is disabled. */
    disabled?: boolean;
}

interface IProps<
    TValueType extends string|number
> extends Omit<Select.RootProps, 'collection'|'value'|'onChange'> {
    /** Selected value. */
    value: TValueType|null;

    /** Called when the selected value changes. */
    onChange: (value: TValueType|null) => void;

    /** Options to show in the autocomplete. */
    options: Array<ISelectOption<TValueType>>;

    /** Whether a value must be selected */
    isMandatoryValue?: boolean;

    /** Placeholder to show in the input. */
    placeholder?: string;
}

/** Select input component. */
export function SelectInput<TValueType extends string|number = string>({value, onChange, placeholder, options, isMandatoryValue, ...selectProps}: IProps<TValueType>) {
    const [isOpen, setIsOpen] = useState<boolean>(false);

    /** collection to show in the select */
    const collection = useMemo(() => createListCollection({
        isItemDisabled: (item) => item.disabled ?? false,
        itemToValue: (item) => item.value.toString(),
        itemToString: (item) => item.label,
        items: options
    }), [options]);

    /** the selected value converted to value prop of the select */
    const selectedValue = useMemo(() => {
        const values = collection.items.map(i => i.value);

        if (value === null || !values.includes(value)) return [];

        return [value.toString()];
    }, [value]);

    /**
     * Handles when the user selects a value.
     * @param value
     */
    const handleValueChange = ({items}: ValueChangeDetails<ISelectOption<TValueType>>) => {
        // user deselected an option or cleared the selection
        if (items.length === 0) return onChange(null);
        onChange(items[0].value);
    }

    return <Select.Root
        {...selectProps}
        value={selectedValue}
        onValueChange={handleValueChange}
        onOpenChange={({open}) => setIsOpen(open)}
        positioning={{ sameWidth: true }}
        collection={collection}
    >
        <Select.Control>
            <Select.Trigger>
                <Select.ValueText placeholder={placeholder || "Vyberte možnost"} />
                <HugeIcon icon={isOpen ? <UnfoldLessIcon/> : <UnfoldMoreIcon/>}/>
            </Select.Trigger>
        </Select.Control>
        <Select.Positioner>
            <Select.Content>
                <Select.ItemGroup>
                    {collection.items.map((item) => (
                        <Select.Item key={item.value} item={item}>
                            <Select.ItemText>{item.label}</Select.ItemText>
                            <Select.ItemIndicator>
                                <HugeIcon icon={<CheckmarkCircle02Icon />}/>
                            </Select.ItemIndicator>
                        </Select.Item>
                    ))}
                </Select.ItemGroup>
            </Select.Content>
        </Select.Positioner>
    </Select.Root>;
}