import React, {useMemo, useState} from "react";
import {Dialog} from "@Components/ui";
import {Divider, Grid, HStack, VStack} from "../../../../styled-system/jsx";
import {Button, Heading, Text} from "@ParkComponents/ui";
import {AddCircleIcon, Cancel01Icon} from "hugeicons-react";
import {useShoppingList} from "../../../contexts";
import {users} from "../../../data/users.ts";

export const AddMemberModal: React.FC = () => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [option, setOption] = useState<number|null>(null);

    const { shoppingList, addMember } = useShoppingList();

    const availableUsers = useMemo(
        () => users.filter(u => !shoppingList?.members.includes(u.id) && u.id !== shoppingList?.author_id),
        [shoppingList]
    );

    const cancel = () => setIsOpen(false);

    const confirm = () => {
        setIsOpen(false);

        console.log(option);

        if (option) addMember(option);
    }

    return <>
        <Button p={0} onClick={() => setIsOpen(true)}>
            <AddCircleIcon strokeWidth={2}/>
        </Button>
        <Dialog isOpen={isOpen}>
            <VStack gap='2' alignItems='flex-start'>
                <HStack justifyContent='space-between' w='100%'>
                    <Heading as='h3' fontSize='2xl'>Přidat uživatele</Heading>
                    <Button variant='ghost' onClick={() => cancel()} css={{p: 2, position: 'relative', right: -2}}>
                        <Cancel01Icon size={32}/>
                    </Button>
                </HStack>

                {availableUsers.length > 0
                    ? <>
                        <Text>Zde vyberte uživatele, kterého byste rádi přidali do seznamu.</Text>
                        <select onChange={e => setOption(Number(e.target.value))} value={option || undefined} defaultValue={-1}>
                            <option disabled value={-1}>Vyberte ze seznamu</option>
                            {availableUsers.map(au => <option value={au.id} key={au.id}>{au.name}</option>)}
                        </select>
                    </>
                    : <Text>Nejsou k dispozici žádní uživatelé, které by šlo přidat.</Text>
                }

            </VStack>
            <Divider my={8}/>
            <Grid gap={2} columns={2}>
                <Button variant={'subtle'} onClick={() => cancel()}>Zrušit</Button>
                <Button onClick={() => confirm()} disabled={option === null}>Přidat</Button>
            </Grid>
        </Dialog>
    </>;
}