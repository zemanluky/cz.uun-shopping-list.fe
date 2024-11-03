import React from "react";
import {ShoppingListProvider} from "../../contexts";
import {Detail} from "@Pages/Detail/Detail.tsx";
import {Navigate, useParams} from "react-router-dom";

export const DetailPage: React.FC = () => {
    const { id } = useParams();

    // check if the parameter is provided and is a number
    if (!id || !id.match(/\d+/)) {
        alert('Seznam nebyl nalezen. Budete přesměrování na hlavní stránku.');
        return <Navigate to='/' />;
    }

    return (
        <ShoppingListProvider>
            <Detail id={Number(id)}/>
        </ShoppingListProvider>
    );
}