import React from "react";
import {Circle, HStack, VStack} from "../../../styled-system/jsx";
import {Text} from "@ParkComponents/ui";
import {HugeIcon} from "@Components/ui/HugeIcon.tsx";
import {informationRow, InformationRowVariantProps} from "../../../styled-system/recipes";

interface IProps extends InformationRowVariantProps {
    /** Data label */
    title: string;
    /** Data to show. */
    data: string;
    /** The icon element. Expects a huge icon element. */
    icon: React.ReactElement;
}

/** Shows icon, name or label of the provided data, and the data itself. */
export const InformationRow: React.FC<IProps> = ({title, data, icon, size, state}) => {
    const classes = informationRow({ size, state });

    return <HStack className={classes.root}>
        <Circle className={classes.iconContainer}>
            <HugeIcon className={classes.icon} icon={icon}/>
        </Circle>
        <VStack gap={0} alignItems={'flex-start'}>
            <Text className={classes.title}>{title}</Text>
            <Text
                className={classes.data} title={size === 'xs' ? title : undefined}>{data}</Text>
        </VStack>
    </HStack>
}