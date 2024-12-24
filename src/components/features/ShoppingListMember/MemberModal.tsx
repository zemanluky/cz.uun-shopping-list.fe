import {forwardRef, useEffect, useImperativeHandle, useMemo, useRef, useState} from "react";
import {Dialog, DialogButtons, DialogContent, DialogHeading} from "@Components/ui/Dialog";
import {Button} from "@ParkComponents/ui";
import {EShoppingListMemberPermission, TShoppingListMember} from "../../../types/shopping-list-member.ts";
import useSWR from "swr";
import {apiRoutes} from "../../../config/api/routes.ts";
import {TPaginatedData} from "../../../types/api.ts";
import {Form, Field as FormField, FormInstance} from "houseform";
import {css} from "../../../../styled-system/css";
import {flex} from "../../../../styled-system/patterns";
import {transformToNull, z} from "@Utils/zod.utils.ts";
import {Field} from "@Components/ui/Form";
import {AutocompleteInput, IAutocompleteOption} from "@Components/ui/Form/AutocompleteInput.tsx";
import {TUser} from "../../../types/user.ts";
import {fullName} from "@Utils/user.helper.ts";
import {useAuth} from "../../../contexts";
import useSWRMutation from "swr/mutation";
import {addListMemberMutator, updateMemberPermissionMutator} from "../../../data/mutator/shopping-list-member.ts";
import {Input} from "@ParkComponents/ui/Input.tsx";
import {toaster} from "@Components/layout/Toaster.tsx";
import {TShoppingListDetail} from "../../../types/shopping-list.ts";
import {useTranslation} from "react-i18next";

interface IProps {
    shoppingList: TShoppingListDetail,
}

interface IFormType {
    memberId?: string|null;
    permission: EShoppingListMemberPermission|null
}

export interface IMemberModalRef {
    /**
     * Opens the dialog.
     * @param member Possibly existing member to edit. Only the permission selection will be possible to change.
     */
    openModal: (member?: TShoppingListMember|null, onSave?: VoidFunction|null, onCancel?: VoidFunction|null) => void
}

export const MemberModal = forwardRef<IMemberModalRef,IProps>(({shoppingList}, ref) => {
    const [isOpen, setIsOpen] = useState<boolean>(false);
    const [userSearch, setUserSearch] = useState<string|null>(null);
    const [member, setMember] = useState<TShoppingListMember|null>(null);
    const {t} = useTranslation('shopping-list');

    const onSaveRef = useRef<VoidFunction|null>(null);
    const onCancelRef = useRef<VoidFunction|null>(null);
    const formRef = useRef<FormInstance<IFormType>>(null);

    const { user: authenticatedUser } = useAuth();

    const { isMutating: isAddingUser, trigger: addMember } = useSWRMutation([apiRoutes.shoppingList.shoppingListDetail[1], { id: shoppingList._id }], addListMemberMutator);
    const { isMutating: isUpdatingPermission, trigger: updatePermission } = useSWRMutation([apiRoutes.shoppingList.shoppingListDetail[1], { id: shoppingList._id }], updateMemberPermissionMutator);

    useImperativeHandle(ref, () => ({
        openModal: (member?: TShoppingListMember|null, onSave?: VoidFunction|null, onCancel?: VoidFunction|null) => {
            if (member) setMember(member);

            onSaveRef.current = onSave || null;
            onCancelRef.current = onCancel || null;

            setIsOpen(true);
            formRef.current?.reset();
        }
    }));

    // reset the form when the member changes
    useEffect(() => formRef.current?.reset(), [member]);

    // prepare query filters
    const queryFilters = useMemo(() => {
        const baseQuery: Record<string, string> = { pageSize: '200' };

        if (!userSearch || userSearch.length < 3) return baseQuery;

        // The user started the search with an @, it probably means they want to search by username
        if (userSearch.startsWith('@')) {
            baseQuery["searchByUsername"] = userSearch.substring(1);
            return baseQuery;
        }

        // Otherwise search by full name
        baseQuery["search"] = userSearch;
        return baseQuery;
    }, [userSearch]);

    const { data: users } = useSWR<TPaginatedData<TUser>>(
        () => userSearch && userSearch.length >= 3 ? [apiRoutes.user.listUsers[1], null, queryFilters] : null
    );

    const userOptions = useMemo<Array<IAutocompleteOption<string>>>(
        () => {
            if (!users) return [];

            const addedUserIds = shoppingList.members.map(member => member.user._id);
            const items: Array<IAutocompleteOption<string>> = [];

            for (const user of users.items) {
                if (authenticatedUser?._id === user._id) continue;
                if (addedUserIds.includes(user._id)) continue;

                items.push({value: user._id, label: fullName(user)});
            }

            return items;
        },
        [users]
    );
    const permissionOptions = useMemo<Array<IAutocompleteOption<EShoppingListMemberPermission>>>(() => ([
        { value: EShoppingListMemberPermission.read, label: t('detail.members.permission.read') },
        { value: EShoppingListMemberPermission.write, label: t('detail.members.permission.write') },
    ]), []);

    /**
     * Cancel the adding or editing of the member.
     */
    const cancel = () => {
        setIsOpen(false);
    }

    /**
     * Resets the dialog to its initial state.
     */
    const resetDialog = () => {
        setMember(null);
        onCancelRef.current?.();
    }

    /**
     * Either adds or updates the member and closes the dialog.
     * @param values
     */
    const submit = (values: IFormType) => {
        const { memberId, permission } = values;

        if (member === null) {
            if (!memberId || !permission) return;

            addMember({ id: shoppingList._id, userId: memberId, permission }).then(() => {
                setIsOpen(false);
                toaster.success({ title: "Člen byl úspěšně přidán!" });
                onSaveRef.current?.();
            });

            return;
        }

        if (!permission) return;

        updatePermission({ id: shoppingList._id, userId: member.user._id, permission }).then(() => {
            setIsOpen(false);
            toaster.success({ title: "Oprávnění bylo úspěšně změněno." });
            onSaveRef.current?.();
        });
    }

    return <>
        <Dialog isOpen={isOpen} onExitComplete={resetDialog}>
            <Form<IFormType> onSubmit={submit} ref={formRef}>
                {({submit, isValid}) => (<>
                    <DialogHeading
                        heading={member !== null
                            ? t('detail.members.modal.editMemberPermissionsTitle')
                            : t('detail.members.modal.addMemberTitle')
                        }
                       onCancel={cancel}/>
                    <DialogContent>
                        <form className={css({width: "100%"})} onSubmit={(e) => {
                            e.preventDefault();
                            submit();
                        }}>
                            <fieldset className={flex({direction: "column", gap: 4})} disabled={isAddingUser || isUpdatingPermission}>
                                {member === null ?
                                    <FormField<IFormType['memberId']>
                                        name="memberId"
                                        onChangeValidate={z.preprocess(transformToNull, z.string())}
                                        initialValue={null}
                                        resetWithValue={null}
                                    >
                                        {({errors, value, setValue}) => (
                                            <Field label={t('detail.members.inputs.user')} errors={errors} type="any">
                                                <AutocompleteInput
                                                    options={userOptions}
                                                    value={value ?? null}
                                                    onChange={(value) => setValue(value)}
                                                    onSearchChange={(value) => setUserSearch(value)}
                                                    placeholder="Napište alespoň tři znaky pro vyhledání"
                                                />
                                            </Field>
                                        )}
                                    </FormField>
                                    : <>
                                        <Field label="Uživatel">
                                            <Input disabled value={fullName(member.user)}/>
                                        </Field>
                                    </>
                                }
                                <FormField<IFormType['permission']>
                                    name="permission"
                                    onChangeValidate={z.preprocess(transformToNull, z.nativeEnum(EShoppingListMemberPermission))}
                                    initialValue={member?.permission ?? undefined}
                                >
                                    {({errors, value, setValue}) => (
                                        <Field label={t('detail.members.inputs.permission')} errors={errors} type="any">
                                            <AutocompleteInput
                                                value={value}
                                                options={permissionOptions}
                                                onChange={(val) => setValue(val)}
                                            />
                                        </Field>)}
                                </FormField>
                            </fieldset>
                        </form>
                    </DialogContent>
                    <DialogButtons buttons={[
                        <Button variant='subtle' onClick={cancel} disabled={isAddingUser || isUpdatingPermission}>
                            {t('cancel', { ns: 'common' })}
                        </Button>,
                        <Button
                            onClick={() => submit()}
                            disabled={!isValid || isAddingUser || isUpdatingPermission}
                            loading={isAddingUser || isUpdatingPermission}
                        >
                            {member !== null ? t('save', { ns: 'common' }) : t('detail.members.actions.addMemberPrompt')}
                        </Button>
                    ]}/>
                </>)}
            </Form>
        </Dialog>
    </>;
});