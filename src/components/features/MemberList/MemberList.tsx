import React from "react";
import {TUser} from "../../../types/auth.ts";
import {Box, BoxProps, HStack, VStack} from "../../../../styled-system/jsx";
import {Heading, Text} from "@ParkComponents/ui";
import {MemberListItem} from "@Components/features/MemberList/MemberListItem.tsx";
import {AddMemberModal} from "@Components/features/MemberList/AddMemberModal.tsx";

interface MemberListProps extends BoxProps {
    members: Array<TUser>,
    showAddModal?: boolean
}

export const MemberList: React.FC<MemberListProps> = ({members, showAddModal = false, ...boxProps}) => {
    return <Box {...boxProps}>
        <HStack justifyContent={'space-between'} mb={'4'}>
            <Heading as={'h3'} fontSize={'2xl'} fontWeight={'bold'} display={'block'}>Členové</Heading>
            {showAddModal && <AddMemberModal/>}
        </HStack>
        {members.length > 0
            ? <VStack gap={2}>
                {members.map(member => <MemberListItem key={member.id} user={member} />)}
            </VStack>
            : <Text>V tomto seznamu nejsou přidáni žádní členové.</Text>
        }
    </Box>
}