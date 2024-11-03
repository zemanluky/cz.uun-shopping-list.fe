import React, {useMemo} from "react";
import {ShoppingListItem as ShoppingListItemType} from "../../../types/shopping-list.ts";
import {Box, HStack, HstackProps} from "../../../../styled-system/jsx";
import {Text, Code, Checkbox} from "@ParkComponents/ui";
import {useAuth, useShoppingList} from "../../../contexts";
import {TUser} from "../../../types/auth.ts";
import {users} from "../../../data/users.ts";

interface ShoppingListItemProps extends HstackProps {
    item: ShoppingListItemType;
}

export const ShoppingListItem: React.FC<ShoppingListItemProps> = ({item, ...hstackProps}) => {
    const { toggleItem } = useShoppingList();
    const { user } = useAuth();

    const completedByUser = useMemo(
        () => users.find(u => u.id === item.completed_by),
        [item.completed_by]
    );

    return <HStack {...hstackProps} p={4} bg={item.completed_at !== null ? "bg.emphasized" : "bg.subtle"}
                   shadow={"md"} borderRadius={'2xl'} w={'100%'} justifyContent={'space-between'}
    >
        <HStack gap={4}>
            <Checkbox checked={item.completed_at !== null} onCheckedChange={() => toggleItem(item.id, user as TUser)} />
            <Text>
                <Code fontWeight='semibold' px={2} mr={2}>{item.amount}</Code>
                {item.name}
            </Text>
        </HStack>
        {completedByUser !== undefined
            ? <Text>Dokončil: {completedByUser.name}</Text>
            : undefined
        }
    </HStack>
}