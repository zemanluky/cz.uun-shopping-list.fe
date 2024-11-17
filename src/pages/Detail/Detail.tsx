import * as React from "react";
import {PageHeader} from "@Components/layout";
import {Button} from "@ParkComponents/ui/Button.tsx";
import {
    Album02Icon, CalendarSetting01Icon, CalendarCheckOut01Icon, CheckListIcon, CheckmarkCircle02Icon, UserEdit01Icon,
    MoreVerticalCircle01Icon, PencilEdit01Icon, Delete02Icon, Door01Icon
} from "hugeicons-react";
import {Box, Container, Grid, HStack, VStack} from "../../../styled-system/jsx";
import {center} from "../../../styled-system/patterns";
import {css} from "../../../styled-system/css";
import {useAuth, useShoppingLists} from "../../contexts";
import {useShoppingList} from "../../contexts";
import {Navigate, useNavigate} from "react-router-dom";
import {ConfirmationDialog, IConfirmationDialogRef} from "@Components/features/Common/ConfirmationDialog.tsx";
import {InformationRow} from "@Components/ui/InformationRow.tsx";
import {ReactNode, useMemo, useRef} from "react";
import {users} from "../../data/users.ts";
import {MemberList} from "@Components/features/MemberList/MemberList.tsx";
import {ShoppingListItemList} from "@Components/features/ShoppingListItem/ShoppingListItemList.tsx";
import {Menu} from "@Components/ui";
import {
    ShoppingListModal,
    IShoppingListModalRef
} from "@Components/features/ShoppingList/ShoppingListModal.tsx";
import {format} from "date-fns";
import {countShoppingListItems} from "@Utils/shopping-list-items/count-items.ts";
import {HugeIcon} from "@Components/ui/HugeIcon.tsx";

interface DetailProps {
    id: number;
}

export const Detail: React.FC<DetailProps> = ({ id }) => {
    const {user} = useAuth();
    const {shoppingList, removeMember} = useShoppingList(id);
    const {saveShoppingList, deleteShoppingList} = useShoppingLists();

    const navigate = useNavigate();

    const completed = shoppingList?.completed_at !== null;
    const author = useMemo(() => users.find(u => u.id === shoppingList?.author_id), [shoppingList]);
    const members = useMemo(
        () => shoppingList?.members
            .map(member_id => users.find(u => u.id === member_id))
            .filter(m => m !== undefined) || [],
        [shoppingList]
    );
    const itemCount = useMemo(
        () => shoppingList ? countShoppingListItems(shoppingList) : null,
        [shoppingList?.items]
    );

    const editModalRef = useRef<IShoppingListModalRef>(null);
    const deleteConfirmationModalRef = useRef<IConfirmationDialogRef>(null);
    const closeConfirmationModalRef = useRef<IConfirmationDialogRef>(null);
    const leaveListConfirmationModalRef = useRef<IConfirmationDialogRef>(null);

    /**
     * Closes this shopping list.
     */
    const closeList = (): void => {
        if (!user || !shoppingList) return;

        saveShoppingList({
            ...shoppingList,
            completed_at: new Date(),
            completed_by: user.id
        }, shoppingList.id);
    }

    /**
     * Removes the currently logged-in user from a given list.
     */
    const leaveList = (): void => {
        if (!user || !shoppingList || user.id === shoppingList.author_id) return;

        removeMember(user.id);
        navigate('/');
    }

    /**
     * Deletes this list.
     */
    const deleteList = (): void => {
        if (!user || !shoppingList) return;

        deleteShoppingList(shoppingList.id);
        navigate('/');
    }

    /**
     * Renders the actions in the page header.
     */
    const renderHeaderActions = (): ReactNode => {
        if (!user || !shoppingList) return null;

        if (shoppingList.author_id === user.id)
            return <>
                <Button size='xl' onClick={() => closeConfirmationModalRef.current?.openModal()}>
                    <CheckmarkCircle02Icon size={24} strokeWidth={2}/>
                    Dokončit
                </Button>
                <Menu
                    items={[
                        { type: 'item', id: 'edit', text: 'Upravit', icon: <PencilEdit01Icon/>, onClick: () => editModalRef.current?.openModal(shoppingList) },
                        { type: 'item', id: 'delete', text: 'Odstranit', icon: <Delete02Icon/>, onClick: () => deleteConfirmationModalRef.current?.openModal() },
                    ]}
                    trigger={<Button size={'xl'} variant={'subtle'} p={0}>
                        <MoreVerticalCircle01Icon strokeWidth={2}/>
                    </Button>}
                />
            </>

        return <Button size='xl' onClick={() => leaveListConfirmationModalRef.current?.openModal()} variant="subtle">
            <HugeIcon icon={<Door01Icon/>}/>
            Opustit seznam
        </Button>
    }

    if (!shoppingList) return <></>;

    // check if the current user is authorized to access this list
    // note that this logic will be dependent on BE's response in the future
    if (!user || (shoppingList.author_id !== user.id && !shoppingList.members.includes(user.id)))
        return <Navigate to='/' />

    return (<>
        <PageHeader
            title={shoppingList.name}
            actions={shoppingList.completed_at === null ? renderHeaderActions() : undefined}
            previousLink='/'
        />
        <Container maxW='6xl' mt='8'>
            <Grid columns={2} columnGap='8' minH={200}>
                <Box className={css(center.raw(), {bg: 'bg.muted', borderRadius: '2xl'})}>
                    <Album02Icon size={32} strokeWidth={3}/>
                </Box>
                <VStack gap='4' alignItems={'flex-start'} py={4}>
                    <InformationRow
                        title='Vytvořeno uživatelem' data={author?.name || ''}
                        icon={<UserEdit01Icon size={28} strokeWidth={2}/>}
                    />
                    <InformationRow
                        title='Naposledy aktualizováno' data={format(shoppingList.last_updated, 'd. L. y')}
                        icon={<CalendarSetting01Icon size={28} strokeWidth={2}/>}
                    />
                    <InformationRow
                        title={completed ? 'Počet položek' : 'Počet položek / hotové položky'}
                        data={completed
                            ? `${itemCount?.total} položek`
                            : `${itemCount?.total} položek / ${itemCount?.completed} hotových položek`
                        }
                        icon={<CheckListIcon/>}
                    />
                    <InformationRow
                        title={completed ? 'Dokončeno' : 'Dokončit nákup před'}
                        data={format(completed ? shoppingList.completed_at! : shoppingList.complete_by, 'd. L. y')}
                        icon={<CalendarCheckOut01Icon/>}
                    />
                </VStack>
            </Grid>
            <HStack gap='8' mt='8' alignItems='flex-start'>
                <ShoppingListItemList items={shoppingList.items} w={'2/3'} readOnly={completed}/>
                <MemberList members={members} showAddModal={user.id === shoppingList.author_id} w={'1/3'} readOnly={completed}/>
            </HStack>
        </Container>
        <ShoppingListModal ref={editModalRef}/>
        <ConfirmationDialog
            ref={deleteConfirmationModalRef}
            title="Opravdu chcete smazat seznam?"
            description="Smazáním seznamu přijdete o zadané položky a nebude možné je obnovit."
            prompts={{confirm: 'Ano, smazat seznam', cancel: 'Ne, ponechat seznam'}}
            onConfirmDefault={() => deleteList()}
        />
        <ConfirmationDialog
            ref={closeConfirmationModalRef}
            title="Opravdu chcete uzavřít tento seznam?"
            description="Uzavřením seznamu přijdete o možnost ho editovat. Seznam zůstane ve stavu, v jakém je a nebude možné přidávat nové položky."
            prompts={{confirm: 'Ano, uzavřít', cancel: 'Ne, ponechat editovatelný'}}
            onConfirmDefault={() => closeList()}
        />
        <ConfirmationDialog
            ref={leaveListConfirmationModalRef}
            title="Opravdu chcete odejít z tohoto seznamu?"
            description="Odchodem ze seznamu vám tento seznam zmizí z přehledu a nebude možné se na něj dostat. Pokud ho budete chtít mít znovu zobrazený, bude vás muset autor přidat zpět."
            prompts={{confirm: 'Ano, chci odejít', cancel: 'Ne, zůstanu'}}
            onConfirmDefault={() => leaveList()}
        />
    </>);
}