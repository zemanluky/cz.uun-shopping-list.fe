import {createHashRouter, RouteObject, RouterProvider} from "react-router-dom";
import {Homepage} from "@Pages/Home/Home.tsx";
import * as React from "react";
import {DetailPage} from "@Pages/Detail/DetailPage.tsx";
import {PageWrapper} from "@Components/layout/PageWrapper.tsx";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <PageWrapper/>,
        children: [
            {
                path: '',
                element: <Homepage/>
            },
            {
                path: ':id',
                element: <DetailPage/>
            }
        ]
    },
];
// using hash router because browser router does not work on github pages
const router = createHashRouter(routes);

export const Router: React.FC = () => <RouterProvider router={router} />