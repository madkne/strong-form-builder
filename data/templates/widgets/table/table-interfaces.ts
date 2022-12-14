import { APIRequest, APIResponse } from "../../common/StrongFB-interfaces";
import { StrongFBTableWidget } from "./table.header";
import { HttpErrorResponse } from "@angular/common/http";
import { ButtonAppearance, ButtonStatus } from "../../common/StrongFB-types";

export interface TableTagColumnMapValue {
    value: string;
    /**
     * @default basic
     */
    status?: 'basic' | 'primary' | 'info' | 'success' | 'warning' | 'danger';
}

export type TableColumnMapValueType = string | TableTagColumnMapValue | TableTagColumnMapValue[];

export enum TableColumnSortMode {
    DESC = 'desc',
    ASC = 'asc',
}

export interface TableColumn<N extends string = string, R extends object = object> {
    name: N;
    title?: string;
    /**
     * @default string
     */
    type?: 'string' | 'actions' | 'tag' | 'tagsList';
    /**
     * normalize value of row for this column
     * not exist for 'actions' type
     */
    mapValue?: TableColumnMapValue<TableColumnMapValueType, R>;

    hasSort?: boolean;
}

export interface TableMapApiPagination {
    /**
     * @default 10
     */
    pageSize?: number;
    /**
     * field name in api response like 'meta.pagination.count'
     */
    pageCountResponse: string;
    /**
     * page size in api param
     * @default page_size
     */
    pageSizeParam?: string;
    /**
     * page in api param
     * @default page
     */
    pageParam?: string;

    /**
     * auto filled
     * no need to filled!
     */
    __pageCountResponse?: number;

}

export interface TableSortRequest<COL extends string = string> {
    column: COL;
    mode: TableColumnSortMode;
}

export type TablePrepareRequestForLoadTable<COL extends string = string> = (sort?: TableSortRequest<COL>, self?: StrongFBTableWidget) => APIRequest;

export interface TableLoadByApi<ROW extends object = object, COL extends string = string> {
    prepareRequest?: TablePrepareRequestForLoadTable<COL>;
    callRequest?: (req: APIRequest<ROW>) => Promise<APIResponse<ROW>>;
    prepareRows?: TableLoadRowsResponse<ROW>;
}


export type TableColumnMapValue<T = TableColumnMapValueType, R extends object = object> = (row?: R, index?: number, self?: StrongFBTableWidget) => Promise<T> | T


export type TableLoadRowsResponse<ROW extends object = object> = (apiResponse: any[], error?: HttpErrorResponse, self?: StrongFBTableWidget, req?: APIRequest<ROW>) => Promise<ROW[]> | ROW[];

export type TableColumnDynamicActionsType<ROW extends object = object> = (row?: ROW, index?: number, self?: StrongFBTableWidget) => Promise<TableColumnAction<ROW>[]> | TableColumnAction<ROW>[];
export interface TableColumnAction<R extends object = object> {
    /**
     * @default fill
     */
    appearance?: ButtonAppearance;
    /**
     * @default default
     */
    status?: ButtonStatus;
    text?: string;
    icon?: string;
    /**
     * @default text
     */
    mode?: 'text' | 'icon';
    /**
     * @default false
     */
    disabled?: boolean;
    action: (row?: R, index?: number, self?: StrongFBTableWidget) => any;

}

export type TableSelectableCallback<ROW extends object = object> = (rows?: ROW[], self?: StrongFBTableWidget) => any;

export interface TableSelectable<ROW extends object = object> {
    callback: TableSelectableCallback<ROW>;
    rowKey: (row: ROW, self?: StrongFBTableWidget) => string;
    /**
     * @default false
     */
    multiple?: boolean;
    /**
     * limit to select rows (for multiple)
     * @default 0 (unlimited to select rows)
     */
    limit?: number;
    selectedRows?: ROW[];

}

export interface TableNotFound {
    html?: string;
    imageUrl?: string;
}

/**
 * @return background color like '#111' or array of background, foreground colors like ['#000', '#fff']
 */
export type TableRowSetColorAction<ROW extends object = object> = (row: ROW, self?: StrongFBTableWidget) => string | [string, string];

export interface TableSchema<COL extends string = string, ROW extends object = object> {
    columns?: TableColumn<COL, ROW>[];
    loadRowsByApi?: {
        options: APIRequest | TablePrepareRequestForLoadTable<COL>;
        response: TableLoadRowsResponse<ROW>;
        request?: (req: APIRequest<ROW>) => Promise<APIResponse<ROW>>
    };
    columnActions?: { [k in COL]?: TableColumnAction<ROW>[] | TableColumnDynamicActionsType };
    mapApiPagination?: TableMapApiPagination;

    rowColorAction?: TableRowSetColorAction<ROW>;

    selectable?: TableSelectable<ROW>;

    notFound?: TableNotFound;
}