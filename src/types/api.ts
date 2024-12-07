export interface IPaginatedParameters {
    /** Total number of items in the collection. */
    total: number,
    /** Number of items when filtered. */
    filtered: number,
    /** Highest page number. */
    maxPage: number,
    /** Number of items per page. */
    pageSize: number,
    /** Current page number. */
    page: number
}

type TBaseResponse = {
    status: number,
    success: boolean
};

export type TSuccessResponse<TData = any> = TBaseResponse & {
    success: true
    data: TData
};

export type TErrorResponse = TBaseResponse & {
    success: false,
    error: {
        message: string,
        code: string,
        trace: string|null
    }
};

export type TPaginatedData<TData = any> = IPaginatedParameters & { items: TData };