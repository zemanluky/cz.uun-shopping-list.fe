import React from "react";
import {Grid} from "../../../../styled-system/jsx";
import { Drawer as ParkDrawer } from "@ParkComponents/ui";

interface IProps {
    buttons: React.ReactElement[];
}

export const DrawerButtons: React.FC<IProps> = ({buttons}) => {
    return <ParkDrawer.Footer>
        <Grid gap={2} columns={buttons.length} w="100%">
            {buttons.map((button, index) => React.cloneElement(button, {key: index}))}
        </Grid>
    </ParkDrawer.Footer>
};