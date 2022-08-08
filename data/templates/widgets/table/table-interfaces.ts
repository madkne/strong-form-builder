import { APIRequest } from "../../common/StrongFB-interfaces";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { ButtonSchema } from "../button/button-interfaces";
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
    mapValue?: TableColumnMapValue;
}

export type TableColumnMapValue<T = TableColumnMapValueType> = (row?: object, index?: number, self?: StrongFBTableWidget) => Promise<T> | T

export type TableLoadRowsResponse<ROW extends object = object> = (apiResponse: any[], error?: HttpErrorResponse, self?: StrongFBTableWidget) => Promise<ROW[]> | ROW[];

export interface TableColumnAction<R extends object = object> {
    button: ButtonSchema;
    action: (displayRow?: R, simpleRow?: object, index?: number, self?: StrongFBTableWidget) => any;
}

export interface TableSchema<COL extends string = string, ROW extends object = object> {
    columns?: TableColumn<COL, ROW>[];
    loadRowsByApi?: {
        options: APIRequest;
        response: TableLoadRowsResponse<ROW>;
    };
    columnActions?: { [k in COL]?: TableColumnAction<ROW>[] };
}