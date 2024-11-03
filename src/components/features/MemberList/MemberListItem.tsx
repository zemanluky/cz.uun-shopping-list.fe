import React, {useMemo} from "react";
import {TUser} from "../../../types/auth.ts";
import {Circle, HStack, HstackProps} from "../../../../styled-system/jsx";
import {Button, Text} from "@ParkComponents/ui";
import {useAuth, useShoppingList} from "../../../contexts";
import {Delete02Icon} from "hugeicons-react";

interface MemberListItemProps extends HstackProps {
    user: TUser
}

export const MemberListItem: React.FC<MemberListItemProps> = ({user, ...hStackProps}) => {
    const { shoppingList, removeMember } = useShoppingList();
    const { user: loggedInUser } = useAuth();

    const initials = useMemo<string>(() => {
        const parts = user.name.split(' ');

        return parts.reduce((acc, curr, idx) => {
            if (idx === 0 || idx === parts.length - 1)
                acc = `${acc}${curr[0].toUpperCase()}`;
            return acc;
        }, '');
    }, [user]);

    if (!shoppingList || !loggedInUser) return undefined;

    return <HStack p={4} bg={"bg.subtle"} shadow={"md"} borderRadius={'2xl'} w={'100%'} justifyContent={'space-between'} {...hStackProps}>
        <HStack gap={2}>
            <Circle p='3' fontWeight='bold' fontSize={'lg'} bg='accent.3' color={'accent.12'}>{initials}</Circle>
            <Text fontWeight='semibold'>{user.name}</Text>
        </HStack>
        {shoppingList.author_id === loggedInUser.id || loggedInUser.id === user.id
            ? <Button variant={'subtle'} p={0} onClick={() => removeMember(user.id)}>
                <Delete02Icon strokeWidth={2} />
            </Button>
            : undefined
        }
    </HStack>
}