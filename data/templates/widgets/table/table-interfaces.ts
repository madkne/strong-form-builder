import { APIRequest } from "../../common/StrongFB-interfaces";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { ButtonAppearance, ButtonSchema, ButtonStatus } from "../button/button-interfaces";
import { StrongFBTableWidget } from "./table.header";
import { HttpErrorResponse } from "@angular/common/http";

export interface TableTagColumnMapValue {
    value: string;
    /**
     * @default basic
     */
    status?: 'basic' | 'primary' | 'info' | 'success' | 'warning' | 'danger';
}

export type TableColumnMapValueType = string | TableTagColumnMapValue | TableTagColumnMapValue[];

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
}

export type TableColumnMapValue<T = TableColumnMapValueType, R extends object = object> = (row?: R, index?: number, self?: StrongFBTableWidget) => Promise<T> | T

export type TableLoadRowsResponse<ROW extends object = object> = (apiResponse: any[], error?: HttpErrorResponse, self?: StrongFBTableWidget) => Promise<ROW[]> | ROW[];

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

export interface TableSchema<COL extends string = string, ROW extends object = object> {
    columns?: TableColumn<COL, ROW>[];
    loadRowsByApi?: {
        options: APIRequest;
        response: TableLoadRowsResponse<ROW>;
    };
    columnActions?: { [k in COL]?: TableColumnAction<ROW>[] | TableColumnDynamicActionsType };
}