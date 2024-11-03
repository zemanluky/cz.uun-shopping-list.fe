import React from "react";
import {Circle, HStack, VStack} from "../../../styled-system/jsx";
import {Text} from "@ParkComponents/ui";

interface InformationRowProps {
    title: string;
    data: string;
    icon: React.ReactNode;
}

export const InformationRow: React.FC<InformationRowProps> = ({title, data, icon}) => {
    return <HStack gap={4}>
        <Circle bg='accent.2' p={4}>{icon}</Circle>
        <VStack gap={0} alignItems={'flex-start'}>
            <Text fontWeight='semibold' as='span' fontSize={'lg'} lineHeight={"tight"}>{title}</Text>
            <Text as='span' lineHeight={"tight"}>{data}</Text>
        </VStack>
    </HStack>
}