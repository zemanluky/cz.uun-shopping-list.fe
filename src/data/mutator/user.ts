import {authenticatedMutator, TFetcherKey, TMutatorKey} from "@Utils/axios.config.ts";
import {apiRoutes, TMutatorArguments} from "../../config/api/routes.ts";
import {TUser} from "../../types/user.ts";

export interface IRegisterArguments extends Omit<TUser, '_id'> {
    password: string;
}

/**
 * Registers user to the application.
 */
export function registerMutator(_: TFetcherKey|TMutatorKey, {arg}: TMutatorArguments<IRegisterArguments>) {
    return authenticatedMutator<undefined>(apiRoutes.user.register, arg);
}

/**
 * Updates user's own profile data.
 * @param _
 * @param arg
 */
export function updateProfileMutator(_: TFetcherKey|TMutatorKey, {arg}: TMutatorArguments<Omit<TUser, '_id'>>) {
    return authenticatedMutator<TUser>(apiRoutes.user.updateProfile, arg);
}