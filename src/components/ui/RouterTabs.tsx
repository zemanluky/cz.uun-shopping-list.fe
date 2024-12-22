import React, {useMemo} from "react";
import {SegmentGroup as ParkSegmentGroup} from "@ParkComponents/ui";
import {Link, Navigate, useLocation} from "react-router-dom";
import {css} from "../../../styled-system/css";

interface IRouteTab {
    /** The relative link to current route. */
    link: string,
    /** The label of the tab. */
    label: string,
    /** The icon on the tab. */
    icon?: React.ReactNode,
}

interface IProps extends ParkSegmentGroup.RootProps {
    /** The list of routes to render as tabs. */
    routes: Array<IRouteTab>
}

export const RouterTabs: React.FC<IProps> = ({routes, orientation, ...parkSegmentGroupProps}) => {
    const { pathname } = useLocation();
    const lastPathFragment = useMemo(() => pathname.substring(pathname.lastIndexOf('/') + 1), [pathname]);
    const activeRoute = useMemo(
        () => routes.find(route => route.link === lastPathFragment),
        [lastPathFragment, routes]
    );

    // If the current route is not in the list of routes, navigate to the first route
    if (!activeRoute && routes.length > 0) {
        return <Navigate to={routes[0].link}/>;
    }

    return <ParkSegmentGroup.Root
        {...parkSegmentGroupProps}
        overflowX="auto"
        orientation={orientation}
        value={activeRoute?.link}
    >
        {routes.map((route) => (
            <ParkSegmentGroup.Item key={route.link} value={route.link}>
                <ParkSegmentGroup.ItemControl asChild>
                    <Link to={route.link} replace className={css({ whiteSpace: "nowrap" })}>{route.label}</Link>
                </ParkSegmentGroup.ItemControl>
                <ParkSegmentGroup.ItemText/>
                <ParkSegmentGroup.ItemHiddenInput />
            </ParkSegmentGroup.Item>
        ))}
        <ParkSegmentGroup.Indicator />
    </ParkSegmentGroup.Root>
}