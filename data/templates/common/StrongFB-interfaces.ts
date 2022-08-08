import { APIStatusCodes } from "./StrongFB-types";
import { HttpErrorResponse } from "@angular/common/http";


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

export interface StrongFBFormOptions {
    rtl?: boolean;
    fontFamily?: string;
}