import React from "react";
import {TUser} from "../../../types/auth.ts";
import {Box, BoxProps, VStack} from "../../../../styled-system/jsx";
import {Heading, Text} from "@ParkComponents/ui";
import {MemberListItem} from "@Components/features/MemberList/MemberListItem.tsx";

interface MemberListProps extends BoxProps {
    members: Array<TUser>
}

export const MemberList: React.FC<MemberListProps> = ({members, ...boxProps}) => {
    return <Box {...boxProps}>
        <Heading as={'h3'} fontSize={'2xl'} fontWeight={'bold'} display={'block'} mb={'4'}>Členové</Heading>
        {members.length > 0
            ? <VStack gap={2}>
                {members.map(member => <MemberListItem key={member.id} user={member} />)}
            </VStack>
            : <Text>V tomto seznamu nejsou přidáni žádní členové.</Text>
        }
    </Box>
}