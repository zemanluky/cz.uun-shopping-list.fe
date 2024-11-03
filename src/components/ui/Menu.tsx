import React from "react";
import {Menu as ParkMenu} from "@ParkComponents/ui";
import {HStack} from "../../../styled-system/jsx";
import {UnfoldMoreIcon} from "hugeicons-react";

interface BaseMenuItem {
    type: 'separator'|'item'|'nested'
}

interface MenuSeparator extends BaseMenuItem {
    type: 'separator'
}

interface FinalMenuItem extends BaseMenuItem {
    type: 'item',
    id: string,
    text: string,
    icon?: React.ReactNode,
    onClick: () => void;
}

interface NestedMenuItem extends BaseMenuItem {
    type: 'nested',
    items: Array<MenuItem>,
    text: string,
    icon?: React.ReactNode,
}

export type MenuItem = | MenuSeparator | FinalMenuItem | NestedMenuItem;

export interface MenuProps {
    items: Array<MenuItem>,
    trigger?: React.ReactNode
}

export const Menu: React.FC<MenuProps> = ({items, trigger}) => {

    /**
     * Renders a given menu item.
     * @param menuItem
     */
    const renderItem = (menuItem: MenuItem): React.ReactNode => {
        switch (menuItem.type) {
            case 'separator':
                return <ParkMenu.Separator />;
            case 'item':
                return <ParkMenu.Item value={menuItem.id} key={menuItem.id} onClick={() => menuItem.onClick()}>
                    <HStack alignItems='center' gap='4'>
                        {menuItem.icon ?? null}
                        {menuItem.text}
                    </HStack>
                </ParkMenu.Item>
            case "nested":
                return <ParkMenu.Root>
                    <ParkMenu.TriggerItem>
                        <HStack justifyContent='space-between'>
                            <HStack alignItems='center' gap='4'>
                                {menuItem.icon ?? null}
                                {menuItem.text}
                            </HStack>
                            <UnfoldMoreIcon/>
                        </HStack>
                    </ParkMenu.TriggerItem>
                    <ParkMenu.Positioner>
                        <ParkMenu.Content>
                            {menuItem.items.map((nestedItem) => renderItem(nestedItem))}
                        </ParkMenu.Content>
                    </ParkMenu.Positioner>
                </ParkMenu.Root>
        }
    }

    return <ParkMenu.Root>
        <ParkMenu.Trigger asChild>{trigger}</ParkMenu.Trigger>
        <ParkMenu.Positioner>
            <ParkMenu.Content>
                {items.map(item => renderItem(item))}
            </ParkMenu.Content>
        </ParkMenu.Positioner>
    </ParkMenu.Root>;
}