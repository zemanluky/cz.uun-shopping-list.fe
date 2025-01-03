import * as React from "react";
import {useRef, useState} from "react";
import {PageHeader} from "@Components/layout";
import {Button} from "@ParkComponents/ui/Button.tsx";
import {Container, VStack} from "../../../styled-system/jsx";
import {AddCircleIcon} from "hugeicons-react";
import {IShoppingListModalRef, ShoppingListModal} from "@Components/features/ShoppingList/ShoppingListModal.tsx";
import {ShoppingListGrid} from "@Components/features/ShoppingList/ShoppingListGrid.tsx";
import {ShoppingListFilters, TShoppingListFilters} from "@Components/features/ShoppingList/ShoppingListFilters.tsx";
import {AuthenticatedRoute} from "@Components/guard";
import {css} from "../../../styled-system/css";
import {EShoppingListView} from "../../types/shopping-list.ts";
import {useTranslation} from "react-i18next";

export const Homepage: React.FC = () => {
    const [filters, setFilters] = useState<TShoppingListFilters>({
        search: null, showCompleted: false, completeBefore: null, includeOnly: EShoppingListView.all
    });
    const [isValidating, setIsValidating] = useState<boolean>(false);
    const { t } = useTranslation('shopping-list');

    const shoppingListModalRef = useRef<IShoppingListModalRef>(null);

    return <AuthenticatedRoute>
        <PageHeader
            title={t('list.pageTitle')}
            actions={
                <Button size='xl' onClick={() => shoppingListModalRef.current?.openModal()} className={css({ flexGrow: 1 })}>
                    <AddCircleIcon size={24} strokeWidth={2}/>
                    {t('actions.newList')}
                </Button>
            }
            validating={isValidating}
        />
        <Container maxW='6xl' mt='8'>
            <VStack gap='6'>
                <ShoppingListFilters onFilterChange={setFilters} w={'100%'}/>
                <ShoppingListGrid w={'100%'} filter={filters} onViewValidation={setIsValidating}/>
            </VStack>
        </Container>
        <ShoppingListModal ref={shoppingListModalRef}/>
    </AuthenticatedRoute>;
}