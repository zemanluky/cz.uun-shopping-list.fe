import * as React from "react";
import {PageHeader} from "@Components/layout";
import {Button} from "@ParkComponents/ui/Button.tsx";
import {Album02Icon, CalendarSetting01Icon, CalendarCheckOut01Icon, CheckListIcon, CheckmarkCircle02Icon, UserEdit01Icon} from "hugeicons-react";
import {Box, Container, Grid, HStack, VStack} from "../../../styled-system/jsx";
import {center} from "../../../styled-system/patterns";
import {css} from "../../../styled-system/css";
import {useAuth} from "../../contexts";
import {useShoppingList} from "../../contexts";
import {Navigate} from "react-router-dom";
import {ConfirmationDialog} from "@Components/ui/ConfirmationDialog.tsx";
import {InformationRow} from "@Components/ui/InformationRow.tsx";
import {useMemo} from "react";
import {users} from "../../data/users.ts";
import {MemberList} from "@Components/features/Member/MemberList.tsx";
import {ShoppingListItems} from "@Components/features/ShoppingList/ShoppingListItems.tsx";

interface DetailProps {
    id: number;
}

export const Detail: React.FC<DetailProps> = ({ id }) => {
    const {user} = useAuth();
    const {shoppingList} = useShoppingList(id);

    const author = useMemo(() => users.find(u => u.id === shoppingList?.author_id), [shoppingList]);
    const members = useMemo(
        () => shoppingList?.members
            .map(member_id => users.find(u => u.id === member_id))
            .filter(m => m !== undefined) || [],
        [shoppingList]
    );
    const itemCount = useMemo(() => ({
        total: shoppingList?.items.length,
        completed: shoppingList?.items.filter(i => i.completed_at !== null).length
    }), [shoppingList]);

    if (!shoppingList) return <></>;

    // check if the current user is authorized to access this list
    // note that this logic will be dependent on BE's response in the future
    if (!user || (shoppingList.author_id !== user.id && !shoppingList.members.includes(user.id)))
        return <Navigate to='/' />

    return (<>
        <PageHeader
            title={shoppingList.name}
            actions={shoppingList.completed_at === null
                ? <ConfirmationDialog
                    title={'Uzavřít seznam'}
                    description={'Uzavřením seznamu nebude možné seznam dále upravovat a všechny položky budou označeny jako hotové. Opravdu chcete seznam uzavřít?'}
                    onConfirm={() => {console.log('confirm')}}
                    trigger={(setOpen) => <Button size='xl' onClick={setOpen}>
                        <CheckmarkCircle02Icon size={24} strokeWidth={2}/>
                        Dokončit
                    </Button>}
                />
                : undefined
            }
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
                        title='Naposledy aktualizováno' data={shoppingList.last_updated.toFormat('d. L. y')}
                        icon={<CalendarSetting01Icon size={28} strokeWidth={2}/>}
                    />
                    <InformationRow
                        title='Počet položek / hotové položky' data={`${itemCount.total} položek / ${itemCount.completed} hotových položek`}
                        icon={<CheckListIcon size={28} strokeWidth={2}/>}
                    />
                    <InformationRow
                        title='Dokončit seznam před' data={shoppingList.complete_by.toFormat('d. L. y')}
                        icon={<CalendarCheckOut01Icon size={28} strokeWidth={2}/>}
                    />
                </VStack>
            </Grid>
            <HStack gap='8' mt='8' alignItems='flex-start'>
                <ShoppingListItems items={shoppingList.items} w={'2/3'}/>
                <MemberList members={members} w={'1/3'}/>
            </HStack>
        </Container>
    </>);
}