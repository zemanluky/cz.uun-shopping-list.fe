import React, {useEffect, useMemo, useState} from "react";
import {ShoppingListItem as ShoppingListItemType} from "../../../types/shopping-list.ts";
import {HStack, HstackProps} from "../../../../styled-system/jsx";
import {Text, Code, Checkbox, Button} from "@ParkComponents/ui";
import {useAuth, useShoppingList} from "../../../contexts";
import {TUser} from "../../../types/auth.ts";
import {users} from "../../../data/users.ts";
import {Input} from "@ParkComponents/ui/Input.tsx";
import {Delete02Icon, PencilEdit01Icon, Tick02Icon} from "hugeicons-react";

interface ShoppingListItemProps extends HstackProps {
    item?: ShoppingListItemType;
}

export const ShoppingListItem: React.FC<ShoppingListItemProps> = ({item, ...hstackProps}) => {
    const [isEditMode, setEditMode] = useState<boolean>(false);
    const [form, setForm] = useState<{amount: string, name: string}>({amount: '', name: ''});

    const { toggleItem, saveItem, removeItem } = useShoppingList();
    const { user } = useAuth();

    useEffect(() => {
        if (item) {
            setForm({amount: item.amount, name: item.name});
        }
    }, [item]);

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

    const handleKeySave = (e: KeyboardEvent): void => {
        if (e.key === 'Enter') save();
    }

    if (!item || isEditMode)
        return <HStack {...hstackProps} p={4} bg={"bg.subtle"} shadow={"md"} borderRadius={'2xl'} w={'100%'} justifyContent={'space-between'}>
            <HStack gap={4}>
                <Checkbox checked={false} disabled />
                <Input id={'createItemAmount'} placeholder={'Množství'} size={'sm'} value={form.amount}
                       onChange={(e) => updateFormField('amount', e.target.value)}
                       onKeyDown={handleKeySave}
                />
                <Input id={'createItemName'} placeholder={'Název'} size={'sm'} value={form.name}
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
            <Checkbox checked={item.completed_at !== null} onCheckedChange={() => toggleItem(item.id, user as TUser)} />
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