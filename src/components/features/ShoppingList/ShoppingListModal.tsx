import {forwardRef, useEffect, useImperativeHandle, useRef, useState} from "react";
import {Button} from "@ParkComponents/ui";
import {useAuth, useShoppingLists} from "../../../contexts";
import {TShoppingList} from "../../../types/shopping-list.ts";
import {Form, Field as FormField, FormInstance} from "houseform";
import {Dialog, DialogHeading, DialogButtons, DialogContent} from "@Components/ui/Dialog";
import {Field, SingleDateInput} from "@Components/ui/Form";
import {Input} from "@ParkComponents/ui/Input.tsx";
import {z} from "@Utils/zod.config.ts";
import {css} from "../../../../styled-system/css";
import { parseDate } from "@ark-ui/react";

export interface IShoppingListModalRef {
    openModal: (shoppingList?: TShoppingList|null) => void;
}

interface IFormType {
    name: string|null;
    completeBy: Date|null;
}

export const ShoppingListModal = forwardRef<IShoppingListModalRef>(
    (_, ref) => {
        const formRef = useRef<FormInstance<IFormType>>(null);
        const [isOpen, setIsOpen] = useState<boolean>(false);
        const [shoppingList, setShoppingList] = useState<TShoppingList|null>(null);

        const { saveShoppingList } = useShoppingLists();
        const { user } = useAuth();

        useImperativeHandle(ref, () => ({
            openModal: (shoppingList?: TShoppingList|null) => {
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
            if (!user || !values.completeBy || !values.name) return;

            // we are creating new shopping list
            if (!shoppingList) {
                saveShoppingList({
                    complete_by: values.completeBy,
                    author_id: user.id,
                    completed_at: null,
                    completed_by: null,
                    name: values.name,
                    members: [],
                    items: []
                });
                setIsOpen(false);
                return;
            }

            saveShoppingList({...shoppingList, name: values.name, complete_by: values.completeBy}, shoppingList.id);
            setIsOpen(false);
        }

        return <Dialog isOpen={isOpen}>
            <Form<IFormType> onSubmit={(values) => save(values)} ref={formRef}>
                {({submit, isValid}) => (
                    <>
                        <DialogHeading heading={!shoppingList ? 'Vytvořit nový seznam' : 'Upravit seznam'} onCancel={cancel}/>
                        <DialogContent>
                            <form className={css({display: 'flex', flexDir: 'column', gap: '4', width: '100%'})}
                                onSubmit={(e) => {
                                    e.preventDefault();
                                    submit();
                                }}
                            >
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
                                    initialValue={shoppingList?.complete_by || null}
                                    onChangeValidate={z.date()}
                                >
                                    {({errors, value, setValue}) => (<Field label="Dokončit nákup před" errors={errors} type="any">
                                        <SingleDateInput value={value} onChange={(date) => setValue(date)} min={parseDate(new Date())}/>
                                    </Field>)}
                                </FormField>
                            </form>
                        </DialogContent>
                        <DialogButtons buttons={[
                            <Button variant={'subtle'} onClick={() => cancel()}>
                                Zrušit
                            </Button>,
                            <Button onClick={submit} disabled={!isValid}>
                                Uložit
                            </Button>
                        ]}/>
                    </>
                )}
            </Form>
        </Dialog>
    });