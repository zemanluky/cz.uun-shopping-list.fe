import {forwardRef, useImperativeHandle, useRef, useState} from "react";
import {Button, Text} from "@ParkComponents/ui";
import {MemberListItem} from "@Components/features/ShoppingListMember/MemberListItem.tsx";
import {IMemberModalRef, MemberModal} from "@Components/features/ShoppingListMember/MemberModal.tsx";
import {TShoppingListMember} from "../../../types/shopping-list-member.ts";
import {Drawer, DrawerButtons, DrawerContent, DrawerHeading} from "@Components/ui/Drawer";
import {HugeIcon} from "@Components/ui/HugeIcon.tsx";
import {UserAdd01Icon} from "hugeicons-react";
import {TShoppingListDetail} from "../../../types/shopping-list.ts";
import {ConfirmationDialog, IConfirmationDialogRef} from "@Components/features/Common/ConfirmationDialog.tsx";
import useSWRMutation from "swr/mutation";
import {apiRoutes} from "../../../config/api/routes.ts";
import {removeMemberMutator} from "../../../data/mutator/shopping-list-member.ts";
import {toaster} from "@Components/layout/Toaster.tsx";
import { fullName } from "@Utils/user.helper.ts";
import {useTranslation} from "react-i18next";

export interface IMemberListRef {
    openDrawer: () => void
}

interface IMemberListProps {
    shoppingList: TShoppingListDetail,
    members: Array<TShoppingListMember>,
    canEdit?: boolean,
    readOnly?: boolean
}

export const MemberListDrawer = forwardRef<IMemberListRef,IMemberListProps>(
    ({members, shoppingList, readOnly, canEdit = false}, ref) => {
        const [isOpen, setIsOpen] = useState<boolean>(false);
        const {t} = useTranslation('shopping-list');

        const memberModalRef = useRef<IMemberModalRef>(null);
        const removeMemberModalRef = useRef<IConfirmationDialogRef>(null);

        const { trigger: triggerRemoveMember, isMutating: isRemovingMember } = useSWRMutation(
            [apiRoutes.shoppingList.shoppingListDetail[1], { id: shoppingList._id }],
            removeMemberMutator
        );

        useImperativeHandle(ref, () => ({
            openDrawer: () => setIsOpen(true)
        }));

        /**
         * Opens the member modal.
         * @param member Possibly existing member to edit.
         */
        const openMemberModal = (member?: TShoppingListMember) => {
            setIsOpen(false);

            const reopenDrawer = () => setIsOpen(true);

            memberModalRef.current?.openModal(member, reopenDrawer, reopenDrawer);
        }

        /**
         * Opens the remove member confirmation dialog.
         * @param member
         */
        const openRemoveMemberConfirmation = (member: TShoppingListMember) => {
            setIsOpen(false);
            const reopenDrawer = () => setIsOpen(true);

            removeMemberModalRef.current?.openModal(
                (finalizeClose) => {
                    triggerRemoveMember({ id: shoppingList._id, userId: member.user._id }).then(() => {
                        toaster.success({ title: `Člen '${fullName(member.user)}' byl úspěšně odebrán.` });
                        finalizeClose?.();
                        reopenDrawer();
                    });
                },
                reopenDrawer
            );
        }

        return <>
            <Drawer isOpen={isOpen}>
                <DrawerHeading heading={t('detail.members.sectionTitle')} onCancel={() => setIsOpen(false)}
                               description={t('detail.members.sectionPrompt')}/>
                <DrawerContent>
                    {members.length > 0
                        ? members.map(member => <MemberListItem
                            key={member.user._id} member={member} readOnly={!canEdit || readOnly} w={'100%'}
                            onEdit={openMemberModal} onDelete={openRemoveMemberConfirmation}
                        />)
                        : <Text>V tomto seznamu nejsou přidáni žádní členové.</Text>
                    }
                </DrawerContent>
                {canEdit && <DrawerButtons buttons={[
                    <Button onClick={() => setIsOpen(false)} variant="subtle">
                        {t('back', { ns: 'common' })}
                    </Button>,
                    <Button onClick={() => openMemberModal()}>
                        <HugeIcon icon={<UserAdd01Icon/>} />
                        {t('detail.members.actions.addMemberPrompt')}
                    </Button>
                ]}/>}
            </Drawer>
            <MemberModal ref={memberModalRef} shoppingList={shoppingList}/>
            <ConfirmationDialog
                ref={removeMemberModalRef}
                title={t('detail.members.modal.deleteTitle')}
                description={t('detail.members.modal.deleteDescription')}
                prompts={{
                    confirm: t('detail.members.actions.confirmDeleteMember'),
                    cancel: t('detail.members.actions.rejectDeleteMember')
                }}
                autoClose={false}
                processing={isRemovingMember}
            />
        </>
    })