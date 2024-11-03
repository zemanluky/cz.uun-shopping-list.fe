import React from "react";
import {Heading} from "@ParkComponents/ui";
import {Box, BoxProps, VStack} from "../../../../styled-system/jsx";
import {ShoppingListItem as ShoppingListItemType} from "../../../types/shopping-list.ts";
import {ShoppingListItem} from "@Components/features/ShoppingList/ShoppingListItem.tsx";

interface ShoppingListItemsProps extends BoxProps {
    items: Array<ShoppingListItemType>
}

export const ShoppingListItems: React.FC<ShoppingListItemsProps> = ({items, ...boxProps}) => {


    return <Box {...boxProps}>
        <Heading as={'h3'} fontSize={'2xl'} fontWeight={'bold'} display={'block'} mb={'4'}>Položky</Heading>
        <VStack gap={2}>
            <ShoppingListItem/>
            {items.map(item => <ShoppingListItem key={item.id} item={item} />)}
        </VStack>
    </Box>
}