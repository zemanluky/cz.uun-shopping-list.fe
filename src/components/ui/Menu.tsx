import React from "react";
import {Menu as ParkMenu} from "@ParkComponents/ui";
import {HStack} from "../../../styled-system/jsx";
import {UnfoldMoreIcon} from "hugeicons-react";
import {HugeIcon} from "@Components/ui/HugeIcon.tsx";
import {Placement} from "@floating-ui/utils";
import {Link} from "react-router-dom";
import {cx} from "../../../styled-system/css";
import {flex} from "../../../styled-system/patterns";

interface BaseMenuItem {
    type: 'separator'|'item'|'nested',
    id: string
}

interface MenuSeparator extends BaseMenuItem {
    type: 'separator'
}

interface FinalMenuItem extends BaseMenuItem {
    type: 'item',
    text: string,
    icon?: React.ReactElement,
    onClick?: () => void;
    link?: string;
}

interface NestedMenuItem extends BaseMenuItem {
    type: 'nested',
    items: Array<TMenuItem>,
    text: string,
    icon?: React.ReactElement,
}

export type TMenuItem = | MenuSeparator | FinalMenuItem | NestedMenuItem;

export interface MenuProps {
    items: Array<TMenuItem>,
    trigger: React.ReactNode,
    placement?: Placement
}

export const Menu: React.FC<MenuProps> = ({items, trigger, placement}) => {

    /**
     * Renders a given menu item.
     * @param menuItem
     */
    const renderItem = (menuItem: TMenuItem): React.ReactNode => {
        switch (menuItem.type) {
            case 'separator':
                return <ParkMenu.Separator key={menuItem.id}/>;
            case 'item':
                return <ParkMenu.Item value={menuItem.id} key={menuItem.id} onClick={() => menuItem.onClick?.()}>
                    {!!menuItem.link
                        ? <Link to={menuItem.link} className={cx(flex({ align: 'center', gap: 4 }))}>
                            {!!menuItem.icon
                                ? <HugeIcon icon={menuItem.icon}/>
                                : null
                            }
                            {menuItem.text}
                        </Link>
                        : <HStack alignItems='center' gap='4'>
                            {!!menuItem.icon
                                ? <HugeIcon icon={menuItem.icon}/>
                                : null
                            }
                            {menuItem.text}
                        </HStack>
                    }

                </ParkMenu.Item>
            case "nested":
                return <ParkMenu.Root key={menuItem.id}>
                    <ParkMenu.TriggerItem>
                        <HStack justifyContent='space-between'>
                            <HStack alignItems='center' gap='4'>
                                {menuItem.icon
                                    ? <HugeIcon icon={menuItem.icon}/>
                                    : null
                                }
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

    return <ParkMenu.Root positioning={{placement: placement, flip: true }}>
        <ParkMenu.Trigger asChild>{trigger}</ParkMenu.Trigger>
        <ParkMenu.Positioner display="flex">
            <ParkMenu.Content>
                {items.map(item => renderItem(item))}
            </ParkMenu.Content>
        </ParkMenu.Positioner>
    </ParkMenu.Root>;
}