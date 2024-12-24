import * as React from "react";
import {PageHeader} from "@Components/layout";
import {Button} from "@ParkComponents/ui/Button.tsx";
import {
    Album02Icon, CalendarSetting01Icon, CalendarCheckOut01Icon, CheckListIcon, CheckmarkCircle02Icon, UserEdit01Icon,
    MoreVerticalCircle01Icon, PencilEdit01Icon, Delete02Icon, Door01Icon, UserGroupIcon
} from "hugeicons-react";
import {Box, Container, Grid, VStack} from "../../../styled-system/jsx";
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
import {fullName} from "@Utils/user.helper.ts";
import {IShoppingListActionModalsRef, ShoppingListActionModals} from "@Components/features/ShoppingList/ShoppingListActionModals.tsx";
import {toaster} from "@Components/layout/Toaster.tsx";
import {ShoppingListItemList} from "@Components/features/ShoppingListItem/ShoppingListItemList.tsx";
import {MemberListDrawer, IMemberListRef} from "@Components/features/ShoppingListMember/MemberListDrawer.tsx";
import {AuthenticatedRoute} from "@Components/guard";
import {Spinner} from "@ParkComponents/ui";
import {useTranslation} from "react-i18next";

export const Detail: React.FC = () => {
    const shoppingListActionsRef = useRef<IShoppingListActionModalsRef>(null);
    const shoppingListMemberDrawerRef = useRef<IMemberListRef>(null);
    const navigate = useNavigate();
    const {t} = useTranslation('shopping-list');
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
                <Button size='xl' onClick={() => shoppingListActionsRef.current?.openCloseListConfirmModal(shoppingList)}
                        className={css({flexGrow: 1})}
                >
                    <CheckmarkCircle02Icon size={24} strokeWidth={2}/>
                    {t('actions.closeList')}
                </Button>
                <Menu
                    items={[
                        {
                            type: 'item', id: 'show-members', text: t('detail.members.action'), icon: <UserGroupIcon/>,
                            onClick: () => shoppingListMemberDrawerRef.current?.openDrawer()
                        },
                        { type: 'separator', id: 'sep' },
                        {
                            type: 'item', id: 'edit', text: t('actions.editList'), icon: <PencilEdit01Icon/>,
                            onClick: () => shoppingListActionsRef.current?.openEditModal(shoppingList)
                        },
                        {
                            type: 'item', id: 'delete', text: t('actions.deleteList'), icon: <Delete02Icon/>,
                            onClick: () => shoppingListActionsRef.current?.openDeleteConfirmModal(
                                shoppingList, () => navigate('/')
                            )
                        },
                    ]}
                    placement={'bottom-end'}
                    trigger={<Button size={'xl'} variant={'subtle'} p={0}>
                        <MoreVerticalCircle01Icon strokeWidth={2}/>
                    </Button>}
                />
            </>

        return <Button size='xl' onClick={() => shoppingListActionsRef.current?.openLeaveListConfirmModal(shoppingList, leaveList)}
                       variant="subtle" className={css({flexGrow: 1})}
        >
            <HugeIcon icon={<Door01Icon/>}/>
            {t('actions.leaveList')}
        </Button>
    }

    return (<AuthenticatedRoute>
        <PageHeader
            title={shoppingList?.name || '...'}
            actions={!completed ? renderHeaderActions() : undefined}
            previousLink={true}
            loading={isLoading}
        />
        {!isLoading && shoppingList
            ? <Container maxW='6xl' mt='8'>
                <Grid columns={{ base: 1, md: 2 }} gap='8' minH={200}>
                    <Box className={css(center.raw(), {bg: 'bg.muted', borderRadius: '2xl', minH: 200})}>
                        <Album02Icon size={32} strokeWidth={3}/>
                    </Box>
                    <VStack gap='4' alignItems={'flex-start'} py={{ base: 0, md: 4 }} px={{ base: 4, md: 0 }}>
                        <InformationRow
                            title={t('detail.stats.createdBy')} data={fullName(shoppingList.author)}
                            icon={<UserEdit01Icon size={28} strokeWidth={2}/>}
                        />
                        <InformationRow
                            title={t('detail.stats.lastUpdated')} data={format(shoppingList.updated_at, 'd. L. y')}
                            icon={<CalendarSetting01Icon size={28} strokeWidth={2}/>}
                        />
                        <InformationRow
                            title={t('detail.stats.itemCombinedStat')}
                            data={completed
                                ? t('common.itemCount', { count: shoppingList.stats.total_items })
                                : `${t('common.itemCount', { count: shoppingList.stats.total_items })} / ${t('detail.stats.itemCountCompleted', { count: shoppingList.stats.completed_items })}`
                            }
                            icon={<CheckListIcon/>}
                        />
                        <InformationRow
                            title={completed ? t('detail.stats.completedAt') : t('detail.stats.completeBy')}
                            data={format(completed ? shoppingList.closed_at! : shoppingList.complete_by, 'd. L. y')}
                            icon={<CalendarCheckOut01Icon/>}
                            state={!completed && isBefore(shoppingList.complete_by, new Date()) ? 'error' : 'default'}
                        />
                    </VStack>
                </Grid>
                <ShoppingListItemList mt={8} items={shoppingList.items} readOnly={completed} shoppingListId={shoppingList._id}/>
                <MemberListDrawer
                    shoppingList={shoppingList}
                    members={shoppingList.members}
                    ref={shoppingListMemberDrawerRef}
                    canEdit={user?._id === shoppingList.author._id}
                />
            </Container>
            : <Spinner/>
        }
        <ShoppingListActionModals ref={shoppingListActionsRef}/>
    </AuthenticatedRoute>);
}