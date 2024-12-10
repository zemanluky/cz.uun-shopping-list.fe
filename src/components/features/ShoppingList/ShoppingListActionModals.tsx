import {forwardRef, useImperativeHandle, useRef} from "react";
import {TShoppingListDetail, TShoppingListOverview} from "../../../types/shopping-list.ts";
import {IShoppingListModalRef, ShoppingListModal} from "@Components/features/ShoppingList/ShoppingListModal.tsx";
import {ConfirmationDialog, IConfirmationDialogRef} from "@Components/features/Common/ConfirmationDialog.tsx";
import useSWRMutation from "swr/mutation";
import {apiRoutes} from "../../../config/api/routes.ts";
import {closeShoppingListMutator, deleteShoppingListMutator} from "../../../data/mutator/shopping-list.ts";
import {toaster} from "@Components/layout/Toaster.tsx";
import {mutate} from "swr";
import {leaveShoppingListMutator} from "../../../data/mutator/shopping-list-member.ts";

export interface IShoppingListActionModalsRef {
    openEditModal: (shoppingList: TShoppingListOverview, onChange?: () => void) => void;
    openDeleteConfirmModal: (list: TShoppingListOverview|TShoppingListDetail, onChange?: () => void) => void;
    openCloseListConfirmModal: (list: TShoppingListOverview|TShoppingListDetail, onChange?: () => void) => void;
    openLeaveListConfirmModal: (list: TShoppingListOverview|TShoppingListDetail, onChange?: () => void) => void;
}

/**
 * Component that holds all the action modals for shopping lists.
 * It automatically manages updating, deletion, closing and leaving from a provided shopping list.
 */
export const ShoppingListActionModals = forwardRef<IShoppingListActionModalsRef>(
    (_, ref) => {
        const { trigger: triggerDelete, isMutating: isDeleting } = useSWRMutation(
            apiRoutes.shoppingList.deleteShoppingList, deleteShoppingListMutator, { revalidate: false }
        );
        const { trigger: triggerClose, isMutating: isClosing } = useSWRMutation(
            apiRoutes.shoppingList.closeShoppingList, closeShoppingListMutator, { revalidate: false }
        );
        const { trigger: triggerLeaveList, isMutating: isLeavingList } = useSWRMutation(
            apiRoutes.shoppingList.members.leaveList, leaveShoppingListMutator, { revalidate: false }
        );

        // modal refs to open on context actions
        const shoppingModalRef = useRef<IShoppingListModalRef>(null);
        const deleteConfirmationModalRef = useRef<IConfirmationDialogRef>(null);
        const closeConfirmationModalRef = useRef<IConfirmationDialogRef>(null);
        const leaveListConfirmationModalRef = useRef<IConfirmationDialogRef>(null);

        /**
         * Handles opening of the confirmation modal to delete the shopping list.
         * @param list
         * @param onChange
         */
        const openDeleteConfirmModal = (list: TShoppingListOverview|TShoppingListDetail, onChange?: VoidFunction): void => {
            deleteConfirmationModalRef.current?.openModal?.((finalizeClose) => {
                triggerDelete({ id: list._id }).then(() => {
                    finalizeClose?.();

                    toaster.success({
                        title: `Nákupní seznam "${list.name}" byl úspěšně odstraněn!`
                    });

                    onChange?.();
                });
            });
        }

        /**
         * Handles opening of the confirmation modal to close the shopping list.
         * @param list
         * @param onChange
         */
        const openCloseListConfirmModal = (list: TShoppingListOverview|TShoppingListDetail, onChange?: VoidFunction): void => {
            closeConfirmationModalRef.current?.openModal?.((finalizeClose) => {
                triggerClose({ id: list._id }).then((data) => {
                    mutate([apiRoutes.shoppingList.shoppingListDetail[1], { id: list._id }], data, { revalidate: false });
                    finalizeClose?.();

                    toaster.success({
                        title: `Nákupní seznam "${list.name}" byl úspěšně uzavřen!`
                    });

                    onChange?.();
                });
            });
        }

        /**
         * Handles opening of the confirmation modal to leave the shopping list.
         * @param list
         * @param onChange
         */
        const openLeaveListConfirmModal = (list: TShoppingListOverview | TShoppingListDetail, onChange?: VoidFunction): void => {
            leaveListConfirmationModalRef.current?.openModal?.((finalizeClose) => {
                triggerLeaveList({ id: list._id }).then(() => {
                    finalizeClose?.();

                    toaster.success({title: `Úspěšně jste byli odebrání z nákupního seznamu "${list.name}"!`});

                    onChange?.();
                });
            });
        }

        useImperativeHandle(ref, () => ({
            openEditModal: (shoppingList: TShoppingListOverview, onChange?: VoidFunction) => shoppingModalRef.current?.openModal?.(shoppingList, onChange),
            openDeleteConfirmModal, openCloseListConfirmModal, openLeaveListConfirmModal
        }));

        return <>
            <ShoppingListModal ref={shoppingModalRef}/>
            <ConfirmationDialog
                ref={deleteConfirmationModalRef}
                title="Opravdu chcete smazat seznam?"
                description="Smazáním seznamu přijdete o zadané položky a nebude možné je obnovit."
                prompts={{confirm: 'Ano, smazat seznam', cancel: 'Ne, ponechat seznam'}}
                processing={isDeleting}
            />
            <ConfirmationDialog
                ref={closeConfirmationModalRef}
                title="Opravdu chcete uzavřít tento seznam?"
                description="Uzavřením seznamu přijdete o možnost ho editovat. Seznam zůstane ve stavu, v jakém je a nebude možné přidávat nové položky."
                prompts={{confirm: 'Ano, uzavřít', cancel: 'Ne, ponechat editovatelný'}}
                processing={isClosing}
            />
            <ConfirmationDialog
                ref={leaveListConfirmationModalRef}
                title="Opravdu chcete odejít z tohoto seznamu?"
                description="Odchodem ze seznamu vám tento seznam zmizí z přehledu a nebude možné se na něj dostat. Pokud ho budete chtít mít znovu zobrazený, bude vás muset autor přidat zpět."
                prompts={{confirm: 'Ano, chci odejít', cancel: 'Ne, zůstanu'}}
                processing={isLeavingList}
            />
        </>
    }
)