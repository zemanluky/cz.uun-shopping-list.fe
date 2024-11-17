import React, {useMemo, useState} from "react";
import {Checkbox, Heading} from "@ParkComponents/ui";
import {Box, BoxProps, HStack, VStack} from "../../../../styled-system/jsx";
import {TShoppingListItem} from "../../../types/shopping-list.ts";
import {ShoppingListItem} from "@Components/features/ShoppingListItem/ShoppingListItem.tsx";

interface ShoppingListItemsProps extends BoxProps {
    items: Array<TShoppingListItem>
}

export const ShoppingListItemList: React.FC<ShoppingListItemsProps> = ({items, ...boxProps}) => {
    const [showIncompleteOnly, setShowIncompleteOnly] = useState<boolean>(false);
    const filteredItems = useMemo(() => items.filter(item => {
        if (!showIncompleteOnly) return item;
        return item.completed_at === null;
    }), [items, showIncompleteOnly]);

    return <Box {...boxProps}>
        <HStack justifyContent={'space-between'} mb={'4'}>
            <Heading as={'h3'} fontSize={'2xl'} fontWeight={'bold'} display={'block'}>Položky</Heading>
            <Checkbox checked={!showIncompleteOnly} onCheckedChange={() => setShowIncompleteOnly(!showIncompleteOnly)}>
                Zobrazit hotové
            </Checkbox>
        </HStack>
        <VStack gap={2}>
            <ShoppingListItem/>
            {filteredItems.map(item => <ShoppingListItem key={item.id} item={item} />)}
        </VStack>
    </Box>
}