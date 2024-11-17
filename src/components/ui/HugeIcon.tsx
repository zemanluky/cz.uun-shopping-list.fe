import React from "react";
import {HugeiconsProps} from "hugeicons-react";

interface IProps extends HugeiconsProps {
    icon: React.ReactElement;
}

export const HugeIcon: React.FC<IProps> = ({icon, ...restProps}) => {
    return React.cloneElement(icon, {size: 24, strokeWidth: 2, ...restProps})
}