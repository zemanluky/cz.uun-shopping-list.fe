import {createBrowserRouter, RouteObject, RouterProvider} from "react-router-dom";
import {Homepage} from "../pages/Homepage/Homepage.tsx";
import {Detail} from "../pages/Detail/Detail.tsx";
import * as React from "react";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <Homepage/>
    },
    {
        path: '/:id',
        element: <Detail/>
    }
];
const router = createBrowserRouter(routes);

export const Router: React.FC = () => <RouterProvider router={router} />