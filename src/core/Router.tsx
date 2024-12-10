import {createBrowserRouter, RouteObject, RouterProvider} from "react-router-dom";
import {Homepage} from "@Pages/Home/Home.tsx";
import * as React from "react";
import {AppWrapper} from "@Components/layout/AppWrapper.tsx";
import {Login} from "@Pages/Auth/Login.tsx";
import {AuthPageWrapper} from "@Components/layout/AuthPageWrapper.tsx";
import {Register} from "@Pages/Auth/Register.tsx";
import {PageWrapper} from "@Components/layout/PageWrapper.tsx";
import {Detail} from "@Pages/Detail/Detail.tsx";

const routes: RouteObject[] = [
    {
        path: '/',
        element: <AppWrapper/>,
        children: [
            {
                path: '/auth',
                element: <AuthPageWrapper/>,
                children: [
                    {
                        path: '',
                        element: <Login/>
                    },
                    {
                        path: 'register',
                        element: <Register/>
                    }
                ]
            },
            {
                path: '',
                element: <PageWrapper/>,
                children: [
                    {
                        path: '',
                        element: <Homepage/>
                    },
                    {
                        path: ':id',
                        element: <Detail/>
                    }
                ]
            },
        ]
    }
];
// using hash router because browser router does not work on github pages
const router = createBrowserRouter(routes);

export const Router: React.FC = () => <RouterProvider router={router} />