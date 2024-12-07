import axios, {AxiosError, AxiosResponse} from "axios";
import {TSuccessResponse} from "../types/api.ts";
import { Mutex } from "async-mutex";
import {apiRoutes, THttpMethod} from "../config/api/routes.ts";
import {TTokenResponse} from "../types/auth.ts";
import {deleteAccessToken, getAccessToken, saveAccessToken} from "@Utils/access-token.utils.ts";

const IGNORED_REFRESH_ENDPOINTS: string[] = [
    apiRoutes.auth.refresh[1],
    apiRoutes.auth.logout[1],
    apiRoutes.auth.login[1]
];

// base axios instance
export const api = axios.create({
    baseURL: import.meta.env.VITE_BASE_API_URL,
    withCredentials: true,
    responseType: "json"
});

const refreshTokenMutex = new Mutex();

// Add a refresh token interceptor
api.interceptors.response.use(
    (response) => response,
    async (error: Error|AxiosError) => {
        if (!axios.isAxiosError(error)) return Promise.reject(error);

        const {config: originalRequest, response} = error;

        if (originalRequest && response
            && response.status === 401 && originalRequest.url !== undefined
            && !IGNORED_REFRESH_ENDPOINTS.includes(originalRequest.url)
        ) {
            // no request is currently refreshing the token, let's try it and lock this process to everyone else
            if (!refreshTokenMutex.isLocked()) {
                const release = await refreshTokenMutex.acquire();

                try {
                    const {access_token} = await api.get<TSuccessResponse<TTokenResponse>>(apiRoutes.auth.refresh[1]).then(transformResponse);
                    saveAccessToken(access_token);

                    // replace with the new access token
                    originalRequest.headers['Authorization'] = `Bearer ${access_token}`;

                    // retry the original request
                    return api.request(originalRequest);
                }
                catch (err) {
                    // delete the current access token
                    deleteAccessToken();

                    // we could not refresh the token, let's reject the original request
                    return Promise.reject(error);
                }
                finally {
                    // release the mutex so that other request may continue as well
                    release();
                }
            }
            else {
                // wait before the token is refreshed
                await refreshTokenMutex.waitForUnlock();

                if (getAccessToken() === null)
                    return Promise.reject(error);

                // retry the original request
                originalRequest.headers['Authorization'] = `Bearer ${localStorage.getItem('access_token')}`;
                return api.request(originalRequest);
            }
        }

        return Promise.reject(error);
    }
)

/**
 * Transforms successful Axios responses.
 * @param response
 */
export function transformResponse<TData>(response: AxiosResponse<TSuccessResponse<TData>>): TData {
    const { data: serverResponse } = response;

    return serverResponse.data;
}

/**
 * Replaces route parameters with their respective values.
 * @param route
 * @param params
 */
function replaceRouteParams(route: string, params: Record<string, string>): string {
    return Object.entries(params).reduce((acc, [key, value]) => acc.replace(`:${key}`, value), route);
}

/**
 * Adds query parameters to the given path.
 * @param route
 * @param query
 */
function addQueryParams(route: string, query: Record<string, string>): string {
    const queryString = new URLSearchParams(query).toString();
    return `${route}?${queryString}`;
}

/**
 * Fetches data from the given API endpoint from given path, route parameters and query parameters.
 */
type TFetcherKey = [string, (Record<string,string>|null)?, (Record<string,string>|null)?];

/**
 * Returns the finalized path for the given fetcher key.
 * @param fetcherKey
 */
export function getFinalizedPath(fetcherKey: TFetcherKey): string {
    const [path, params, query] = fetcherKey;
    let finalizedPath = path;

    if (params) finalizedPath = replaceRouteParams(finalizedPath, params);
    if (query) finalizedPath = addQueryParams(finalizedPath, query);

    return finalizedPath;
}

/**
 * Fetches data from the given API endpoint without authentication headers.
 * @param fetcherKey
 */
export const fetcher = async (fetcherKey: TFetcherKey|string) => {
    await refreshTokenMutex.waitForUnlock();

    const finalizedPath = typeof fetcherKey === 'string'
        ? fetcherKey
        : getFinalizedPath(fetcherKey)
    ;

    return api.get(finalizedPath).then(transformResponse);
}

/**
 * Fetches data from the given API endpoint with authentication headers.
 * @param fetcherKey
 */
export const authenticatedFetcher = async <TData = any>(fetcherKey: TFetcherKey|string): Promise<TData> => {
    await refreshTokenMutex.waitForUnlock();

    const finalizedPath = typeof fetcherKey === 'string' ? fetcherKey : getFinalizedPath(fetcherKey);
    const accessToken = getAccessToken();

    return await api.get<TSuccessResponse<TData>>(finalizedPath, {
        headers: accessToken ? {
            'Authorization': `Bearer ${accessToken}`
        } : {}
    }).then((response) => transformResponse(response));
}

type TMutatorKey = [THttpMethod, ...TFetcherKey];

/**
 * Mutates data on the given API endpoint with authentication headers.
 * @param mutatorKey
 * @param data
 */
export const mutator = async <TResponseData = any>(mutatorKey: TMutatorKey, data?: any): Promise<TResponseData> => {
    const [method, ...fetcherKey] = mutatorKey;

    return api.request<TSuccessResponse<TResponseData>>({
        url: getFinalizedPath(fetcherKey),
        method: method,
        data
    }).then(transformResponse);
}

/**
 * Mutates data on the given API endpoint with authentication headers.
 * @param mutatorKey
 * @param data
 */
export const authenticatedMutator = async <TResponseData = any>(mutatorKey: TMutatorKey, data?: any): Promise<TResponseData> => {
    await refreshTokenMutex.waitForUnlock();

    const accessToken = getAccessToken();
    const [method, ...fetcherKey] = mutatorKey;

    return api.request<TSuccessResponse<TResponseData>>({
        url: getFinalizedPath(fetcherKey),
        method: method,
        headers: accessToken ? {
            'Authorization': `Bearer ${accessToken}`
        } : {},
        data
    }).then(transformResponse);
}