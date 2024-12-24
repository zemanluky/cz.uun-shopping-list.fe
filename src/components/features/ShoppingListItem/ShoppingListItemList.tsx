import React, {useMemo, useState} from "react";
import {Checkbox, Heading} from "@ParkComponents/ui";
import {Box, BoxProps, HStack, VStack} from "../../../../styled-system/jsx";
import {ShoppingListItem} from "@Components/features/ShoppingListItem/ShoppingListItem.tsx";
import {TShoppingListItem} from "../../../types/shopping-list-item.ts";
import {useTranslation} from "react-i18next";

interface ShoppingListItemsProps extends BoxProps {
    shoppingListId: string;
    items: Array<TShoppingListItem>,
    readOnly?: boolean
}

export const ShoppingListItemList: React.FC<ShoppingListItemsProps> = ({shoppingListId, items, readOnly, ...boxProps}) => {
    const [showIncompleteOnly, setShowIncompleteOnly] = useState<boolean>(false);
    const { t } = useTranslation('shopping-list');

    const filteredItems = useMemo(() => items.filter(item => {
        if (!showIncompleteOnly) return item;
        return item.completed === null;
    }), [items, showIncompleteOnly]);

    return <Box {...boxProps}>
        <HStack justifyContent={'space-between'} mb={'4'} minH={'40px'}>
            <Heading as={'h3'} fontSize={'2xl'} fontWeight={'bold'} display={'block'}>{t('detail.items.sectionTitle')}</Heading>
            {!readOnly
                ? <Checkbox checked={!showIncompleteOnly} onCheckedChange={() => setShowIncompleteOnly(!showIncompleteOnly)}>
                    {t('detail.items.showCompleted')}
                </Checkbox>
                : null
            }
        </HStack>
        <VStack gap={2}>
            {!readOnly ? <ShoppingListItem shoppingListId={shoppingListId}/> : null}
            {filteredItems.map(item =>
                <ShoppingListItem shoppingListId={shoppingListId} key={item._id} item={item} readOnly={readOnly} />
            )}
        </VStack>
    </Box>
}