import React, {useMemo} from "react";
import {TUser} from "../../../types/auth.ts";
import {Box, BoxProps, Circle, HStack} from "../../../../styled-system/jsx";
import {Text} from "@ParkComponents/ui";

interface MemberListItemProps extends BoxProps {
    user: TUser
}

export const MemberListItem: React.FC<MemberListItemProps> = ({user, ...boxProps}) => {
    const initials = useMemo<string>(() => {
        const parts = user.name.split(' ');

        return parts.reduce((acc, curr, idx) => {
            if (idx === 0 || idx === parts.length - 1)
                acc = `${acc}${curr[0].toUpperCase()}`;
            return acc;
        }, '');
    }, [user]);

    return <Box p={4} bg={"bg.subtle"} shadow={"md"} borderRadius={'2xl'} w={'100%'} {...boxProps}>
        <HStack gap={2}>
            <Circle p='3' fontWeight='bold' fontSize={'lg'} bg='accent.3' color={'accent.12'}>{initials}</Circle>
            <Text fontWeight='semibold'>{user.name}</Text>
        </HStack>
    </Box>
}