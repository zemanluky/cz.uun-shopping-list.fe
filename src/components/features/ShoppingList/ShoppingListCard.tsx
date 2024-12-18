import React, {useMemo} from "react";
import {TShoppingList} from "../../../types/shopping-list.ts";
import {Box, Grid, HStack, VStack} from "../../../../styled-system/jsx";
import {css} from "../../../../styled-system/css";
import {center, wrap} from "../../../../styled-system/patterns";
import {
    Album02Icon,
    ArrowRight01Icon, CalendarCheckOut01Icon, CheckListIcon,
    Delete02Icon,
    Door01Icon, Menu01Icon,
    MoreVerticalCircle01Icon,
    PencilEdit01Icon, TickDouble02Icon, UserEdit01Icon
} from "hugeicons-react";
import {Heading} from "@ParkComponents/ui";
import {Menu, TMenuItem} from "@Components/ui";
import {IconButton} from "@ParkComponents/ui/icon-button.tsx";
import {HugeIcon} from "@Components/ui/HugeIcon.tsx";
import { useNavigate } from "react-router-dom";
import {useAuth} from "../../../contexts";
import {InformationRow} from "@Components/ui/InformationRow.tsx";
import {users} from "../../../data/users.ts";
import {format, isBefore} from "date-fns";
import {countShoppingListItems} from "@Utils/shopping-list-items/count-items.ts";

interface IProps {
    shoppingList: TShoppingList;
    onUpdate?: () => void;
    onDelete?: () => void;
    onLeaveList?: () => void;
    onCloseList?: () => void;
}

/** An overview card for a given shopping list. */
export const ShoppingListCard: React.FC<IProps> = ({shoppingList, onUpdate, onDelete, onLeaveList, onCloseList}) => {
    const navigate = useNavigate();
    const {user} = useAuth();

    const menuItems = useMemo<Array<TMenuItem>>((): Array<TMenuItem> => {
        if (shoppingList.completed_at !== null) return [];

        if (user?.id === shoppingList.author_id) {
            const items: Array<TMenuItem> = [];

            if (onCloseList)
                items.push(
                    {type: 'item', id: 'close', text: 'Uzavřít seznam', icon: <TickDouble02Icon/>, onClick: () => onCloseList()},
                    {type: 'separator', id: 'sep-1'}
                );

            if (onUpdate)
                items.push({
                    type: 'item', id: 'edit', text: 'Upravit', icon: <PencilEdit01Icon/>, onClick: () => onUpdate()
                });

            if (onDelete)
                items.push({
                    type: 'item', id: 'delete', text: 'Odstranit', icon: <Delete02Icon/>, onClick: () => onDelete()
                });

            return items;
        }
        else if (user && shoppingList.members.includes(user.id)) {
            return onLeaveList ? [
                {
                    type: 'item', id: 'leave-list', text: 'Opustit seznam', icon: <Door01Icon/>,
                    onClick: () => onLeaveList()
                }
            ] : [];
        }

        return [];
    }, [user, shoppingList]);
    const author = useMemo(() => users.find(u => u.id === shoppingList?.author_id), [shoppingList]);
    const itemCount = useMemo(
        () => shoppingList ? countShoppingListItems(shoppingList) : null,
        [shoppingList?.items]
    );

    const navigateToDetail = (): void => navigate(`/${shoppingList.id}`);

    return <Grid p='4' gap='6' bg={'bg.subtle'} shadow={'md'} borderRadius={'2xl'} gridTemplateColumns={'2fr 3fr'} position={'relative'}>
        <Box className={css(center.raw(), {bg: 'bg.muted', borderRadius: 'xl', minH: '200px', minW: '100px'})}>
            <Album02Icon size={32} strokeWidth={3}/>
        </Box>
        <VStack justifyContent='space-between' justifySelf={'left'} w={'100%'} alignItems={'flex-start'} py={'2'}>
            <Box>
                <HStack justifyContent='space-between' alignContent={'flex-start'} w={'100%'}>
                    <Heading as='h3' fontSize='2xl' lineHeight='tight' pr={'54px'}>
                        {shoppingList.name}
                    </Heading>
                    {menuItems.length
                        ? <Menu
                            placement={'bottom-end'}
                            items={menuItems}
                            trigger={<IconButton variant={'subtle'} size={'lg'}
                                                 className={css({pos: 'absolute', right: '4', top: '4', borderRadius: 'xl'})}
                            >
                                <HugeIcon icon={<MoreVerticalCircle01Icon/>}/>
                            </IconButton>}
                        />
                        : null
                    }
                </HStack>
                <Box className={css(wrap.raw({ columnGap: '4', rowGap: '2' }), { mt: '2' })}>
                    <InformationRow title='Počet položek' data={`${itemCount?.total} položek`}
                                    icon={<Menu01Icon/>} size='xs'/>
                    {shoppingList.completed_at !== null
                        ? <>
                            <InformationRow title='Dokončeno' icon={<CalendarCheckOut01Icon/>} size='xs'
                                            data={`Dokončeno ${format(shoppingList.completed_at, 'd. L. y')}`}/>
                        </>
                        : <>
                            <InformationRow title='Z toho dokončených položek' data={`${itemCount?.completed} hotových`}
                                            icon={<CheckListIcon/>} size='xs'/>
                            <InformationRow title='Dokončit před' icon={<CalendarCheckOut01Icon/>} size='xs'
                                            data={`Dokončit před ${format(shoppingList.complete_by, 'd. L. y')}`}
                                            state={isBefore(shoppingList.complete_by, new Date()) ? 'error' : 'default'}/>
                        </>
                    }
                </Box>
            </Box>
            <InformationRow title='Vytvořil' data={author?.name || ''} icon={<UserEdit01Icon/>} size='sm'/>
            <IconButton onClick={navigateToDetail} size={'lg'}
                        className={css({pos: 'absolute', right: '4', bottom: '4', borderRadius: 'xl'})}
            >
                <HugeIcon icon={<ArrowRight01Icon/>}/>
            </IconButton>
        </VStack>
    </Grid>
}