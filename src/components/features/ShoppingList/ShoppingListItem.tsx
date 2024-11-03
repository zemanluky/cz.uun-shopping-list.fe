import React from "react";
import {ShoppingListItem as ShoppingListItemType} from "../../../types/shopping-list.ts";
import {Box, HStack} from "../../../../styled-system/jsx";
import {Text} from "@ParkComponents/ui";
import {Checkbox} from "@ParkComponents/ui/Checkbox.tsx";

interface ShoppingListItemProps {
    item: ShoppingListItemType;
}

export const ShoppingListItem: React.FC<ShoppingListItemProps> = ({item, ...boxProps}) => {
    return <Box p={4} bg={"bg.subtle"} shadow={"md"} borderRadius={'2xl'} w={'100%'} {...boxProps}>
        <HStack gap={4}>
            <Checkbox checked={item.completed_at !== null}/>
            <Text fontWeight='semibold'>{item.amount}</Text>
            <Text fontWeight='semibold'>{item.name}</Text>
        </HStack>
    </Box>
}