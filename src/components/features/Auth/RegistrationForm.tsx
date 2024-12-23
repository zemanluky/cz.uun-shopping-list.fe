import React, {useRef} from "react";
import {Form, Field as FormField, FormInstance} from "houseform";
import {z} from "zod";
import {Field} from "@Components/ui/Form";
import {Input} from "@ParkComponents/ui/styled/input.tsx";
import {Divider, VStack} from "../../../../styled-system/jsx";
import {Button} from "@ParkComponents/ui";
import {flex} from "../../../../styled-system/patterns";
import {Link, useNavigate} from "react-router-dom";
import {UserAdd01Icon} from "hugeicons-react";
import {HugeIcon} from "@Components/ui/HugeIcon.tsx";
import {button} from "../../../../styled-system/recipes";
import useSWRMutation from "swr/mutation";
import {apiRoutes} from "../../../config/api/routes.ts";
import {css, cx} from "../../../../styled-system/css";
import {registerMutator} from "../../../data/mutator/user.ts";
import {toaster} from "@Components/layout/Toaster.tsx";

interface IFormType {
    username: string,
    password: string,
    surname: string,
    email: string,
    name: string,
}

export const RegistrationForm: React.FC = () => {
    const navigate = useNavigate();
    const formRef = useRef<FormInstance<IFormType>>(null);
    const {trigger: triggerRegister, isMutating} = useSWRMutation([apiRoutes.user.register[1]], registerMutator);

    /**
     * Sends the register request.
     * @param values
     */
    const submit = async (values: IFormType) => {
        triggerRegister(values).then(() => {
            navigate("/auth");
            toaster.success({title: "Byli jste úspěšně zaregistrování. Nyní se můžete přihlásit."});
        });
    }

    return <Form<IFormType> onSubmit={submit} ref={formRef}>
        {({isValid, submit}) => (<>
                <form
                    className={css({w: "100%"})}
                    onSubmit={async (e) => {
                        e.preventDefault();
                        await submit();
                    }}
                >
                    <fieldset className={flex({direction: "column", gap: "4"})} disabled={isMutating}>
                        <FormField<IFormType['name']>
                            name="name"
                            initialValue={''}
                            onChangeValidate={z.string().trim().min(1)}
                        >
                            {({errors, value, setValue}) => <Field label="Jméno" errors={errors}>
                                <Input value={value}
                                       onChange={(e) => setValue(e.target.value.length ? e.target.value : '')}
                                       placeholder="Pepa"/>
                            </Field>}
                        </FormField>
                        <FormField<IFormType['surname']>
                            name="surname"
                            initialValue={''}
                            onChangeValidate={z.string().trim().min(1)}
                        >
                            {({errors, value, setValue}) => <Field label="Příjmení" errors={errors}>
                                <Input value={value}
                                       onChange={(e) => setValue(e.target.value.length ? e.target.value : '')}
                                       placeholder="Nováček"/>
                            </Field>}
                        </FormField>
                        <FormField<IFormType['username']>
                            name="username"
                            initialValue={''}
                            onChangeValidate={z.string()
                                .toLowerCase()
                                .trim()
                                .min(5)
                                .regex(/^[a-z_-]+$/gm, "Uživatelské jméno může obsahovat pouze malá písmena, pomlčky a podtržítka.")
                            }
                        >
                            {({errors, value, setValue}) => <Field label="Uživatelské jméno" errors={errors}>
                                <Input value={value}
                                       onChange={(e) => setValue(e.target.value.length ? e.target.value : '')}
                                       placeholder="pepik_novacek"/>
                            </Field>}
                        </FormField>
                        <FormField<IFormType['email']>
                            name="email"
                            initialValue={''}
                            onChangeValidate={z.string().trim().email()}
                        >
                            {({errors, value, setValue}) => <Field label="Přihlašovací email" errors={errors}>
                                <Input value={value}
                                       type="email"
                                       onChange={(e) => setValue(e.target.value.length ? e.target.value : '')}
                                       placeholder="pepinovacek@gmail.com"/>
                            </Field>}
                        </FormField>
                        <FormField<IFormType['password']>
                            name="password"
                            initialValue={''}
                            onChangeValidate={z.string()
                                .trim().min(8).max(72)
                                .regex(
                                    /^(?=(.*[a-z])+)(?=(.*[A-Z])+)(?=(.*[0-9])+)(?=(.*[!"#$%&'()*+,-.\/:;<=>?@[\]^_`{|}~])+).{8,72}$/gm,
                                    "Heslo musí obsahovat alespoň jedno velké a malé písmeno, jedno číslo, a jeden speciální znak."
                                )
                            }
                        >
                            {({errors, value, setValue}) => <Field label="Heslo" errors={errors}>
                                <Input value={value}
                                       type="password"
                                       onChange={(e) => setValue(e.target.value.length ? e.target.value : '')}
                                       placeholder="letmein5?"/>
                            </Field>}
                        </FormField>
                    </fieldset>
                    <Divider my="8"/>
                    <VStack gap="2" w="100%">
                        <Button w="100%" type="submit" disabled={!isValid} loading={isMutating}>
                            <HugeIcon icon={<UserAdd01Icon/>}/>
                            Registrovat se
                        </Button>
                        <Link to={!isMutating ? "/auth" : "#"} className={cx(button({variant: "ghost"}), css({ w: "100%" }))} replace>
                            Už mám účet
                        </Link>
                    </VStack>
                </form>
            </>
        )}
    </Form>
};