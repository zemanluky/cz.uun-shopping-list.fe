import {mutator} from "@Utils/axios.config.ts";
import {apiRoutes, TMutatorArguments} from "../../config/api/routes.ts";
import {TTokenResponse} from "../../types/auth.ts";

type TLoginData = {
    login: string,
    password: string
};

/**
 * Sends a login request to the server.
 */
export function loginMutator(_: string, {arg}: TMutatorArguments<TLoginData>) {
    return mutator<TTokenResponse>(apiRoutes.auth.login, arg);
}

/**
 * Sends a logout request to the server.
 */
export function logoutMutator(_: string) {
    return mutator<TTokenResponse>(apiRoutes.auth.logout);
}