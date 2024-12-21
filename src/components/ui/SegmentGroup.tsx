import React, {useMemo} from "react";
import {SegmentGroup as ParkSegmentGroup} from "@ParkComponents/ui";

interface ISegmentGroupItem {
    id: string,
    label: string
}

interface IProps extends ParkSegmentGroup.RootProps {
    items: Array<ISegmentGroupItem>,
    activeItem: string,
    onItemChange: (id: string) => void
}

export const SegmentGroup: React.FC<IProps> = ({items, activeItem, onItemChange, ...rootProps}) => {
    const value = useMemo(
        () => items.find((item) => item.id === activeItem) || items[0],
        [items, activeItem]
    );

    return <ParkSegmentGroup.Root
        {...rootProps}
        onValueChange={(valueChange) => onItemChange(valueChange.value)}
        value={value.id}
        orientation='horizontal'
    >
        {items.map((item) => (
            <ParkSegmentGroup.Item key={item.id} value={item.id}>
                <ParkSegmentGroup.ItemControl />
                <ParkSegmentGroup.ItemText>{item.label}</ParkSegmentGroup.ItemText>
                <ParkSegmentGroup.ItemHiddenInput />
            </ParkSegmentGroup.Item>
        ))}
        <ParkSegmentGroup.Indicator />
    </ParkSegmentGroup.Root>
}