import React, {useMemo, useState} from "react";
import {Checkbox, Heading} from "@ParkComponents/ui";
import {Box, BoxProps, HStack, VStack} from "../../../../styled-system/jsx";
import {ShoppingListItem} from "@Components/features/ShoppingListItem/ShoppingListItem.tsx";
import {TShoppingListItem} from "../../../types/shopping-list-item.ts";

interface ShoppingListItemsProps extends BoxProps {
    items: Array<TShoppingListItem>,
    readOnly?: boolean
}

export const ShoppingListItemList: React.FC<ShoppingListItemsProps> = ({items, readOnly, ...boxProps}) => {
    const [showIncompleteOnly, setShowIncompleteOnly] = useState<boolean>(false);
    const filteredItems = useMemo(() => items.filter(item => {
        if (!showIncompleteOnly) return item;
        return item.completed === null;
    }), [items, showIncompleteOnly]);

    return <Box {...boxProps}>
        <HStack justifyContent={'space-between'} mb={'4'} minH={'40px'}>
            <Heading as={'h3'} fontSize={'2xl'} fontWeight={'bold'} display={'block'}>Položky</Heading>
            {!readOnly
                ? <Checkbox checked={!showIncompleteOnly} onCheckedChange={() => setShowIncompleteOnly(!showIncompleteOnly)}>
                    Zobrazit hotové
                </Checkbox>
                : null
            }
        </HStack>
        <VStack gap={2}>
            {!readOnly ? <ShoppingListItem/> : null}
            {filteredItems.map(item =>
                <ShoppingListItem key={item._id} item={item} readOnly={readOnly} />
            )}
        </VStack>
    </Box>
}