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
import {useAuth} from "../../contexts";
import {Navigate, useNavigate, useParams} from "react-router-dom";
import {InformationRow} from "@Components/ui/InformationRow.tsx";
import {ReactNode, useRef} from "react";
import {Menu} from "@Components/ui";
import {format, isBefore} from "date-fns";
import {HugeIcon} from "@Components/ui/HugeIcon.tsx";
import useSWR from "swr";
import {apiRoutes} from "../../config/api/routes.ts";
import {TShoppingListDetail} from "../../types/shopping-list.ts";
import {Spinner} from "@ParkComponents/ui";
import {fullName} from "@Utils/user.helper.ts";
import {IShoppingListActionModalsRef, ShoppingListActionModals} from "@Components/features/ShoppingList/ShoppingListActionModals.tsx";
import {toaster} from "@Components/layout/Toaster.tsx";

export const Detail: React.FC = () => {
    const shoppingListActionsRef = useRef<IShoppingListActionModalsRef>(null);
    const navigate = useNavigate();
    const {id} = useParams();
    const {user} = useAuth();

    if (!id) return <Navigate to='/' />;

    const { data: shoppingList, isLoading } = useSWR<TShoppingListDetail>([apiRoutes.shoppingList.shoppingListDetail[1], { id }]);

    const completed = shoppingList?.closed_at !== null;

    /**
     * Removes the currently logged-in user from a given list.
     */
    const leaveList = (): void => {
        toaster.success({title: "Nákupní seznam byl úspěšně uzavřen!"});
    }


    /**
     * Renders the actions in the page header.
     */
    const renderHeaderActions = (): ReactNode => {
        if (!user || !shoppingList) return null;

        if (shoppingList.author._id === user._id)
            return <>
                <Button size='xl' onClick={() => shoppingListActionsRef.current?.openCloseListConfirmModal(shoppingList)}>
                    <CheckmarkCircle02Icon size={24} strokeWidth={2}/>
                    Dokončit
                </Button>
                <Menu
                    items={[
                        {
                            type: 'item', id: 'edit', text: 'Upravit', icon: <PencilEdit01Icon/>,
                            onClick: () => shoppingListActionsRef.current?.openEditModal(shoppingList)
                        },
                        {
                            type: 'item', id: 'delete', text: 'Odstranit', icon: <Delete02Icon/>,
                            onClick: () => shoppingListActionsRef.current?.openDeleteConfirmModal(
                                shoppingList, () => navigate('/')
                            )
                        },
                    ]}
                    trigger={<Button size={'xl'} variant={'subtle'} p={0}>
                        <MoreVerticalCircle01Icon strokeWidth={2}/>
                    </Button>}
                />
            </>

        return <Button size='xl' onClick={() => shoppingListActionsRef.current?.openLeaveListConfirmModal(shoppingList, leaveList)} variant="subtle">
            <HugeIcon icon={<Door01Icon/>}/>
            Opustit seznam
        </Button>
    }

    return (<>
        <PageHeader
            title={shoppingList?.name || '...'}
            actions={!completed ? renderHeaderActions() : undefined}
            previousLink={true}
            loading={isLoading}
        />
        {!isLoading && shoppingList
            ? <Container maxW='6xl' mt='8'>
                <Grid columns={2} columnGap='8' minH={200}>
                    <Box className={css(center.raw(), {bg: 'bg.muted', borderRadius: '2xl'})}>
                        <Album02Icon size={32} strokeWidth={3}/>
                    </Box>
                    <VStack gap='4' alignItems={'flex-start'} py={4}>
                        <InformationRow
                            title='Vytvořeno uživatelem' data={fullName(shoppingList.author)}
                            icon={<UserEdit01Icon size={28} strokeWidth={2}/>}
                        />
                        <InformationRow
                            title='Naposledy aktualizováno' data={format(shoppingList.updated_at, 'd. L. y')}
                            icon={<CalendarSetting01Icon size={28} strokeWidth={2}/>}
                        />
                        <InformationRow
                            title={completed ? 'Počet položek' : 'Počet položek / hotové položky'}
                            data={completed
                                ? `${shoppingList.stats.total_items} položek`
                                : `${shoppingList.stats.total_items} položek / ${shoppingList.stats.completed_items} hotových položek`
                            }
                            icon={<CheckListIcon/>}
                        />
                        <InformationRow
                            title={completed ? 'Dokončeno' : 'Dokončit nákup před'}
                            data={format(completed ? shoppingList.closed_at! : shoppingList.complete_by, 'd. L. y')}
                            icon={<CalendarCheckOut01Icon/>}
                            state={!completed && isBefore(shoppingList.complete_by, new Date()) ? 'error' : 'default'}
                        />
                    </VStack>
                </Grid>
                <HStack gap='8' mt='8' alignItems='flex-start'>
                    {/*<ShoppingListItemList items={shoppingList.items} w={'2/3'} readOnly={completed}/>*/}
                    {/*<MemberList members={shoppingList.members} showAddModal={user!._id === shoppingList.author._id} w={'1/3'} readOnly={completed}/>*/}
                </HStack>
            </Container>
            : <Spinner/>
        }
        <ShoppingListActionModals ref={shoppingListActionsRef}/>
    </>);
}