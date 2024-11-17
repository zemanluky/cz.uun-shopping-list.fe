import React from "react";
import {Divider, Grid} from "../../../../styled-system/jsx";

interface IProps {
    buttons: React.ReactElement[];
}

export const DialogButtons: React.FC<IProps> = ({buttons}) => {
    return <>
        <Divider my={8}/>
        <Grid gap={2} columns={buttons.length}>
            {buttons.map((button, index) => React.cloneElement(button, {key: index}))}
        </Grid>
    </>
};