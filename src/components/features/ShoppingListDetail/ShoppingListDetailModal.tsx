import React, {forwardRef, useEffect, useImperativeHandle, useState} from "react";
import {Divider, Grid, HStack, VStack} from "../../../../styled-system/jsx";
import {Button, Heading, Text} from "@ParkComponents/ui";
import {Cancel01Icon} from "hugeicons-react";
import {Dialog} from "@Components/ui";
import {useShoppingList, useShoppingLists} from "../../../contexts";
import {Input} from "@ParkComponents/ui/Input.tsx";

export interface ShoppingListDetailModalRef {
    openModal: () => void;
}

export const ShoppingListDetailModal = forwardRef<ShoppingListDetailModalRef>((props, ref) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [form, setForm] = useState<{name: string}>({name: ''}); // TODO: Improve validation and form handling

    const { shoppingList } = useShoppingList();
    const { saveShoppingList } = useShoppingLists();

    useImperativeHandle(ref, () => ({
        openModal: () => setIsOpen(true)
    }));

    useEffect(() => {
        if (!shoppingList) return;
        setForm({name: shoppingList.name});
    }, [shoppingList]);

    const cancel = () => setIsOpen(false);

    const save = () => {
        if (!shoppingList || !form.name.length) return;
        saveShoppingList({...shoppingList, name: form.name}, shoppingList.id);
        setIsOpen(false);
    }

    return <Dialog isOpen={isOpen}>
        <VStack gap='2' alignItems='flex-start'>
            <HStack justifyContent='space-between' w='100%'>
                <Heading as='h3' fontSize='2xl'>Upravit nákupní seznam</Heading>
                <Button variant='ghost' onClick={() => cancel()} css={{p: 2, position: 'relative', right: -2}}>
                    <Cancel01Icon size={32}/>
                </Button>
            </HStack>
            <Input value={form.name} onChange={e => setForm({name: e.target.value})} onKeyDown={(e) => {
                if (e.key === 'Enter') save();
            }}/>
        </VStack>
        <Divider my={8}/>
        <Grid gap={2} columns={2}>
            <Button variant={'subtle'} onClick={() => cancel()}>Zrušit</Button>
            <Button onClick={() => save()} disabled={form.name.length === 0}>Uložit</Button>
        </Grid>
    </Dialog>
})