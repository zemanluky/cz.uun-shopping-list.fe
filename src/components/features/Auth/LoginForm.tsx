import React, {useRef} from "react";
import {Form, Field as FormField, FormInstance} from "houseform";
import {z} from "zod";
import {Field} from "@Components/ui/Form";
import {Input} from "@ParkComponents/ui/styled/input.tsx";
import {Divider, VStack} from "../../../../styled-system/jsx";
import {Button} from "@ParkComponents/ui";
import {flex} from "../../../../styled-system/patterns";
import {Link, useNavigate} from "react-router-dom";
import {ArrowRight02Icon} from "hugeicons-react";
import {HugeIcon} from "@Components/ui/HugeIcon.tsx";
import {button} from "../../../../styled-system/recipes";
import useSWRMutation from "swr/mutation";
import {apiRoutes} from "../../../config/api/routes.ts";
import {css, cx} from "../../../../styled-system/css";
import {loginMutator} from "../../../data/mutator/auth.ts";
import {useAuth} from "../../../contexts";

interface IFormType {
    login: string,
    password: string
}

export const LoginForm: React.FC = () => {
    const {login} = useAuth();
    const navigate = useNavigate();
    const formRef = useRef<FormInstance<IFormType>>(null);
    const {trigger, isMutating} = useSWRMutation(apiRoutes.auth.identity[1], loginMutator);

    /**
     * Sends the login request.
     * @param values
     */
    const submitLogin = async (values: IFormType) => {
        const result = await trigger({login: values.login, password: values.password});

        if (result) {
            login(result.access_token);
            navigate('/');
        }
    }

    return <Form<IFormType> onSubmit={submitLogin} ref={formRef}>
        {({isValid, submit}) => (<>
            <form
                className={css({w: "100%"})}
                onSubmit={async (e) => {
                    e.preventDefault();
                    await submit();
                }}
            >
                <fieldset className={flex({direction: "column", gap: "4"})} disabled={isMutating}>
                    <FormField<IFormType['login']>
                        name="login"
                        initialValue={''}
                        onChangeValidate={z.string().trim().email()}
                    >
                        {({errors, value, setValue}) => <Field label="Přihlašovací email" errors={errors}>
                            <Input value={value || ''}
                                   onChange={(e) => setValue(e.target.value.length ? e.target.value : '')}
                                   placeholder="pepa@gmail.com"/>
                        </Field>}
                    </FormField>
                    <FormField<IFormType['password']>
                        name="password"
                        initialValue={''}
                        onChangeValidate={z.string().trim().min(1)}
                    >
                        {({errors, value, setValue}) => <Field label="Tvoje heslo" errors={errors}>
                            <Input value={value || ''}
                                   type="password"
                                   onChange={(e) => setValue(e.target.value.length ? e.target.value : '')}
                                   placeholder="letmein"/>
                        </Field>}
                    </FormField>
                </fieldset>
                <Divider my="8"/>
                <VStack gap="2" w="100%">
                    <Button w="100%" type="submit" disabled={!isValid} loading={isMutating}>
                        Přihlásit se
                        <HugeIcon icon={<ArrowRight02Icon/>}/>
                    </Button>
                    <Link to="/auth/register" className={cx(button({variant: "ghost"}), css({ w: "100%" }))} replace>Ještě nemám účet</Link>
                </VStack>
            </form>
        </>
        )}
    </Form>
};