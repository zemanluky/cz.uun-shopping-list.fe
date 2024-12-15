import React, {useEffect, useMemo, useRef, useState} from "react";
import {HStack, HstackProps} from "../../../../styled-system/jsx";
import {Text, Code, Checkbox, Button} from "@ParkComponents/ui";
import {Input} from "@ParkComponents/ui/Input.tsx";
import {Delete02Icon, PencilEdit01Icon, Tick02Icon} from "hugeicons-react";
import { Checkbox as ArkCheckbox } from "@ark-ui/react";
import {TShoppingListItem} from "../../../types/shopping-list-item.ts";
import {css} from "../../../../styled-system/css";
import useSWRMutation from "swr/mutation";
import { apiRoutes } from "src/config/api/routes.ts";
import {
    createItemMutator, deleteItemMutator,
    toggleItemStateMutator,
    updateItemMutator
} from "../../../data/mutator/shopping-list-item.ts";
import {TFetcherKey} from "@Utils/axios.config.ts";
import {toaster} from "@Components/layout/Toaster.tsx";

interface ShoppingListItemProps extends HstackProps {
    shoppingListId: string;
    item?: TShoppingListItem;
    readOnly?: boolean;
}

export const ShoppingListItem: React.FC<ShoppingListItemProps> = ({shoppingListId, item, readOnly, ...hstackProps}) => {
    const [isEditMode, setEditMode] = useState<boolean>(false);
    const [completed, setCompleted] = useState<ArkCheckbox.CheckedState>(false);
    const [form, setForm] = useState<{amount: string, name: string}>({amount: '', name: ''});

    const amountInputRef = useRef<HTMLInputElement>(null);
    const mutationKey: TFetcherKey = useMemo(() => ([apiRoutes.shoppingList.shoppingListDetail[1], { id: shoppingListId }]), [shoppingListId]);

    const { trigger: triggerCreate, isMutating: isCreating } = useSWRMutation(mutationKey, createItemMutator);
    const { trigger: triggerUpdate, isMutating: isUpdating } = useSWRMutation(mutationKey, updateItemMutator);
    const { trigger: triggerItemStateChange } = useSWRMutation(mutationKey, toggleItemStateMutator);
    const { trigger: triggerDelete } = useSWRMutation(mutationKey, deleteItemMutator);

    // whether the form is locked due to creating or updating an item
    const lockForm = useMemo(() => isCreating || isUpdating, [isCreating, isUpdating]);

    useEffect(() => {
        if (item) setForm({amount: item.quantity, name: item.name});
    }, [item]);

    useEffect(() => {
        if (item) setCompleted(item.completed !== null);
    }, [item?.completed]);

    // focus the input when entering edit mode
    useEffect(() => {
        if (isEditMode && !lockForm) amountInputRef.current?.focus();
    }, [isEditMode, lockForm]);

    const completedByUser = useMemo(
        () => item?.completed?.completed_by,
        [item?.completed]
    );

    /**
     * Partially updates the form state.
     * @param key
     * @param value
     */
    const updateFormField = (key: 'amount'|'name', value: string): void => {
        setForm(prev => ({
            ...prev,
            [key]: value
        }))
    }

    /**
     * Saves new or updates existing item by calling the mutator.
     */
    const save = (): void => {
        if (form.name.length === 0 || form.amount.length === 0) return;

        if (item) {
            triggerUpdate({shoppingListId, itemId: item._id, name: form.name, quantity: form.amount})
                .then(() => {
                    toaster.success({title: `Položka byla úspěšně aktualizována.`});
                    setEditMode(false)
                });
            return;
        }

        triggerCreate({shoppingListId: shoppingListId, name: form.name, quantity: form.amount})
            .then(() => {
                toaster.success({title: `Položka byla úspěšně přidána.`});
                setForm({amount: '', name: ''});
            });
    }

    /**
     * Handles key event to trigger save.
     * @param e
     */
    const handleKeySave = (e: React.KeyboardEvent<HTMLInputElement>): void => {
        if (e.key === 'Enter') save();
    }

    /**
     * Toggles the completion state of the item.
     * @param e
     */
    const toggleComplete = (e: ArkCheckbox.CheckedChangeDetails): void => {
        if (!item) return;

        const checkboxState = e.checked;
        const checked = typeof checkboxState === "boolean" ? checkboxState : false

        setCompleted(checked);
        triggerItemStateChange({shoppingListId, itemId: item._id, bought: checked });
    }

    /**
     * Deletes the item.
     */
    const deleteItem = (): void => {
        if (!item) return;

        triggerDelete({shoppingListId, itemId: item._id}).then(() => {
            toaster.success({title: `Položka byla úspěšně odstraněna.`});
        });
    }

    // Render the item's form when in edit mode or no item is set
    if (!item || isEditMode)
        return <HStack {...hstackProps} p={4} bg={"bg.subtle"} shadow={"md"} borderRadius={'2xl'} w={'100%'} justifyContent={'space-between'} gap={8}>
            <HStack gap={2} w="100%">
                {/* For some obscure reason when this checkbox is present at least once,
                the other one becomes disabled as well and its state cannot be changed. */}
                {/* <Checkbox value={} readOnly name={'create_item_completed'}/> */}
                <Input id={'create_item_amount'} placeholder={'Množství'} size={'sm'} value={form.amount}
                       onChange={(e) => updateFormField('amount', e.target.value)}
                       onKeyDown={handleKeySave} disabled={readOnly} ref={amountInputRef}
                       className={css({minW: "50px", maxW: "150px", w: "auto", flexShrink: 0})}
                />
                <Input id={'create_item_name'} placeholder={'Název'} size={'sm'} value={form.name}
                       onChange={(e) => updateFormField('name', e.target.value)}
                       onKeyDown={handleKeySave} disabled={readOnly} className={css({w: "100%"})}
                />
            </HStack>
            <Button p={0} onClick={() => save()} disabled={form.name.length === 0 || form.amount.length === 0}>
                <Tick02Icon strokeWidth={2} />
            </Button>
        </HStack>;

    // Render the item detail
    return <HStack {...hstackProps} p={4} bg={item.completed !== null ? "bg.emphasized" : "bg.subtle"}
                   shadow={"md"} borderRadius={'2xl'} w={'100%'} justifyContent={'space-between'}
    >
        <HStack gap={4}>
            {!readOnly
                ? <Checkbox checked={completed} onCheckedChange={toggleComplete} name={`item_${item._id}_completed`} />
                : null
            }
            <Text>
                <Code fontWeight='semibold' px={2} mr={2}>{item.quantity}</Code>
                {item.name}
            </Text>
        </HStack>
        {!readOnly
            ? <HStack gap={2}>
                {completedByUser !== undefined
                    ? <Text>Dokončil: {completedByUser.name}</Text>
                    : <>
                        <Button p={0} variant={'subtle'} onClick={() => setEditMode(true)}>
                            <PencilEdit01Icon strokeWidth={2} />
                        </Button>
                        <Button p={0} variant={'subtle'} onClick={deleteItem} colorPalette={'red'}>
                            <Delete02Icon strokeWidth={2} />
                        </Button>
                    </>
                }
            </HStack>
            : null
        }
    </HStack>
}