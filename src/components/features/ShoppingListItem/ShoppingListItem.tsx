import React, {useEffect, useMemo, useState} from "react";
import {TShoppingListItem as ShoppingListItemType} from "../../../types/shopping-list.ts";
import {HStack, HstackProps} from "../../../../styled-system/jsx";
import {Text, Code, Checkbox, Button} from "@ParkComponents/ui";
import {useAuth, useShoppingList} from "../../../contexts";
import {TUser} from "../../../types/auth.ts";
import {users} from "../../../data/users.ts";
import {Input} from "@ParkComponents/ui/Input.tsx";
import {Delete02Icon, PencilEdit01Icon, Tick02Icon} from "hugeicons-react";
import { Checkbox as ArkCheckbox } from "@ark-ui/react";

interface ShoppingListItemProps extends HstackProps {
    item?: ShoppingListItemType;
}

export const ShoppingListItem: React.FC<ShoppingListItemProps> = ({item, ...hstackProps}) => {
    const [isEditMode, setEditMode] = useState<boolean>(false);
    const [completed, setCompleted] = useState<ArkCheckbox.CheckedState>(false);
    const [form, setForm] = useState<{amount: string, name: string}>({amount: '', name: ''});

    const { toggleItem, saveItem, removeItem } = useShoppingList();
    const { user } = useAuth();

    useEffect(() => {
        if (item) {
            setForm({amount: item.amount, name: item.name});
        }
    }, [item]);

    useEffect(() => {
        if (item) {
            setCompleted(item.completed_at !== null);
        }
    }, [item?.completed_at]);

    const completedByUser = useMemo(
        () => users.find(u => u.id === item?.completed_by),
        [item?.completed_by]
    );

    const updateFormField = (key: 'amount'|'name', value: string): void => {
        setForm(prev => ({
            ...prev,
            [key]: value
        }))
    }

    const save = (): void => {
        if (form.name.length === 0 || form.amount.length === 0) return;

        if (item) {
            saveItem({...item, name: form.name, amount: form.amount}, item.id);
            setEditMode(false);
            return;
        }

        saveItem({
            name: form.name,
            amount: form.amount,
            completed_by: null,
            completed_at: null
        });
        setForm({amount: '', name: ''});
    }

    const handleKeySave = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') save();
    }

    const toggleComplete = (e: ArkCheckbox.CheckedChangeDetails): void => {
        if (!item) return;

        toggleItem(item.id, user as TUser);
        setCompleted(e.checked);
    }

    if (!item || isEditMode)
        return <HStack {...hstackProps} p={4} bg={"bg.subtle"} shadow={"md"} borderRadius={'2xl'} w={'100%'} justifyContent={'space-between'}>
            <HStack gap={4}>
                {/* For some obscure reason when this checkbox is present at least once,
                the other one becomes disabled as well and its state cannot be changed. */}
                {/* <Checkbox value={} readOnly name={'create_item_completed'}/> */}
                <Input id={'create_item_amount'} placeholder={'Množství'} size={'sm'} value={form.amount}
                       onChange={(e) => updateFormField('amount', e.target.value)}
                       onKeyDown={handleKeySave}
                />
                <Input id={'create_item_name'} placeholder={'Název'} size={'sm'} value={form.name}
                       onChange={(e) => updateFormField('name', e.target.value)}
                       onKeyDown={handleKeySave}
                />
            </HStack>
            <Button p={0} onClick={() => save()} disabled={form.name.length === 0 || form.amount.length === 0}>
                <Tick02Icon strokeWidth={2} />
            </Button>
        </HStack>;

    return <HStack {...hstackProps} p={4} bg={item.completed_at !== null ? "bg.emphasized" : "bg.subtle"}
                   shadow={"md"} borderRadius={'2xl'} w={'100%'} justifyContent={'space-between'}
    >
        <HStack gap={4}>
            <Checkbox checked={completed} onCheckedChange={toggleComplete} name={`item_${item.id}_completed`} />
            <Text>
                <Code fontWeight='semibold' px={2} mr={2}>{item.amount}</Code>
                {item.name}
            </Text>
        </HStack>
        <HStack gap={2}>
            {completedByUser !== undefined
                ? <Text>Dokončil: {completedByUser.name}</Text>
                : <>
                    <Button p={0} variant={'subtle'} onClick={() => setEditMode(true)}>
                        <PencilEdit01Icon strokeWidth={2} />
                    </Button>
                    <Button p={0} variant={'subtle'} onClick={() => removeItem(item.id)} colorPalette={'red'}>
                        <Delete02Icon strokeWidth={2} />
                    </Button>
                </>
            }
        </HStack>

    </HStack>
}