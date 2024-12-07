import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Button} from "@ParkComponents/ui";
import {TShoppingListDetail} from "../../../types/shopping-list.ts";
import {Form, Field as FormField, FormInstance} from "houseform";
import {Dialog, DialogHeading, DialogButtons, DialogContent} from "@Components/ui/Dialog";
import {Field, SingleDateInput} from "@Components/ui/Form";
import {Input} from "@ParkComponents/ui/Input.tsx";
import {z} from "@Utils/zod.config.ts";
import {css} from "../../../../styled-system/css";
import { parseDate } from "@ark-ui/react";
import useSWRMutation from "swr/mutation";
import {apiRoutes} from "../../../config/api/routes.ts";
import {
    addShoppingListMutator,
    IUpdateShoppingList,
    updateShoppingListMutator
} from "../../../data/mutator/shopping-list.ts";
import {flex} from "../../../../styled-system/patterns";
import {isEqual, parseISO, startOfToday} from "date-fns";
import {useNavigate} from "react-router-dom";
import {mutate} from "swr";
import {getFinalizedPath} from "@Utils/axios.config.ts";

export interface IShoppingListModalRef {
    /**
     * Opens the dialog.
     * @param shoppingList Possibly existing shopping list to edit.
     */
    openModal: (shoppingList?: TInitialData|null) => void;
}

interface IFormType {
    name: string|null;
    completeBy: Date|null;
}

type TInitialData = Pick<TShoppingListDetail, "name"|"complete_by"|"_id">

export const ShoppingListModal = forwardRef<IShoppingListModalRef>(
    (_, ref) => {
        const navigate = useNavigate();
        const formRef = useRef<FormInstance<IFormType>>(null);
        const [isOpen, setIsOpen] = useState<boolean>(false);
        const [shoppingList, setShoppingList] = useState<TInitialData|null>(null);

        const { isMutating: isCreateMutating, trigger: triggerCreate } = useSWRMutation(
            () => !shoppingList ? apiRoutes.shoppingList.createShoppingList[1] : null,
            addShoppingListMutator
        );
        const { isMutating: isUpdateMutating, trigger: triggerUpdate } = useSWRMutation(
            () => !!shoppingList
                ? getFinalizedPath([apiRoutes.shoppingList.shoppingListDetail[1], {id: shoppingList._id}])
                : null,
            updateShoppingListMutator, { populateCache: true, revalidate: false }
        );

        useImperativeHandle(ref, () => ({
            openModal: (shoppingList?: TInitialData|null) => {
                if (shoppingList) setShoppingList(shoppingList);
                setIsOpen(true);
            }
        }));

        useEffect(() => formRef.current?.reset(), [shoppingList]);

        /**
         * Closes the dialog.
         */
        const cancel = () => {
            setIsOpen(false);
            setTimeout(() => {
                setShoppingList(null);
                formRef.current?.reset();
            }, 300);
        }

        /**
         * Saves the shopping list and closes the dialog.
         * @param values
         */
        const save = (values: IFormType) => {
            // we are updating existing shopping list
            if (shoppingList) {
                if (!values.name) return;

                const updateCompleteBy: Partial<IUpdateShoppingList> =
                    values.completeBy && isEqual(values.completeBy, shoppingList.complete_by)
                        ? { complete_by: values.completeBy }
                        : {}
                ;

                return triggerUpdate({ id: shoppingList._id, name: values.name, ...updateCompleteBy })
                    .then(() => {
                        cancel();
                    });
            }

            if (!values.completeBy || !values.name) return;

            // send create mutation to the backend
            triggerCreate({ name: values.name, complete_by: values.completeBy })
                .then(async data => {
                    // prepopulate the cache with the newly created shopping list
                    return await mutate(
                        getFinalizedPath([apiRoutes.shoppingList.shoppingListDetail[1], {id: data._id}]),
                        data, {revalidate: false, populateCache: true}
                    );
                })
                .then((data) => {
                    // close the modal and navigate to the newly created shopping list
                    cancel();
                    navigate(`/${data!._id}`);
                })
            ;
        }

        return <Dialog isOpen={isOpen}>
            <Form<IFormType> onSubmit={(values) => save(values)} ref={formRef}>
                {({submit, isValid}) => (
                    <>
                        <DialogHeading heading={!shoppingList ? 'Vytvořit nový seznam' : 'Upravit seznam'} onCancel={cancel}/>
                        <DialogContent>
                            <form className={css({width: '100%'})}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    submit();
                                }}
                            >
                                <fieldset className={flex({direction: "column", gap: 4})} disabled={isCreateMutating || isUpdateMutating}>
                                    <FormField<IFormType['name']>
                                        name="name"
                                        initialValue={shoppingList?.name || ''}
                                        onChangeValidate={z.string().trim().min(3)}
                                    >
                                        {({errors, value, setValue}) => <Field label="Jméno seznamu" errors={errors}>
                                            <Input value={value || ''}
                                                   onChange={(e) => setValue(e.target.value.length ? e.target.value : null)}
                                                   placeholder="Víkendový feast"/>
                                        </Field>}
                                    </FormField>
                                    <FormField<IFormType['completeBy']>
                                        name="completeBy"
                                        initialValue={shoppingList?.complete_by
                                            ? parseISO(shoppingList.complete_by)
                                            : null
                                        }
                                        onChangeValidate={z.date().min(startOfToday())}
                                    >
                                        {({errors, value, setValue}) => (<Field label="Dokončit nákup před" errors={errors} type="any">
                                            <SingleDateInput value={value} onChange={(date) => setValue(date)} min={parseDate(startOfToday())}/>
                                        </Field>)}
                                    </FormField>
                                </fieldset>
                            </form>
                        </DialogContent>
                        <DialogButtons buttons={[
                            <Button variant={'subtle'} onClick={() => cancel()} disabled={isCreateMutating || isUpdateMutating}>
                                Zrušit
                            </Button>,
                            <Button onClick={submit} disabled={!isValid || isCreateMutating || isUpdateMutating}>
                                Uložit
                            </Button>
                        ]}/>
                    </>
                )}
            </Form>
        </Dialog>
    });