import { APIStatusCodes, StrongFBValidatorName } from "./StrongFB-types";
import { HttpErrorResponse } from "@angular/common/http";
import { ButtonAppearance, ButtonStatus } from "../widgets/button/button-interfaces";


export interface APIRequest<T = any> {
    path: string;
    method: 'GET' | 'POST' | 'PUT' | 'DELETE';
    params?: { [param: string]: string | boolean | number | string[] };
    headers?: { [header: string]: string | string[]; };
    body?: T,
    formData?: FormData;
    noAuth?: boolean;
    /**
     * @default false
     */
    reportProgress?: boolean;
}

export interface APIResponse<T = any> {
    result: T;
    statusCode: APIStatusCodes;
    paginate?: {

    },
    error?: HttpErrorResponse;
}

export interface StrongFBFormOptions<D extends object = object> {
    rtl?: boolean;
    fontFamily?: string;
    initData?: D;
}

export interface StrongFBDialogAction<T extends object = object> {
    id?: string;
    text?: string;
    tooltip?: string;
    icon?: string;
    disabled?: boolean;
    status?: ButtonStatus;
    appearance?: ButtonAppearance;
    action?: (formValues?: T) => Promise<boolean> | boolean | void,
    show?: () => Promise<boolean> | boolean;
    __show?: boolean; // filled auto
    closable?: boolean;
    focus?: boolean;
    isCancel?: boolean;
}

export interface StrongFBValidatorSchema {
    name: StrongFBValidatorName;
    value?: any;
    error?: string;
    hint?: string;
}