import { APIStatusCodes, AvailableLanguage, CustomLocales, Direction, LocaleCalendar, StrongFBValidatorName } from "./StrongFB-types";
import { HttpErrorResponse } from "@angular/common/http";
import { ButtonAppearance, ButtonStatus } from "../widgets/button/button-interfaces";
import { StrongFBHttpService } from "../services/StrongFB-http.service";
import { ViewContainerRef } from "@angular/core";


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
    // hint?: string;
}

export interface StrongFBCheckValidatorsResponse {
    isValid: boolean;
    error?: string;
    name?: StrongFBValidatorName;
    newValue?: any;
}

export type StrongFBCustomValidatorFunctionType = (value: string | number) => Promise<boolean> | boolean;

export interface LanguageInfo {
    latin: string;
    code: AvailableLanguage;
    native?: string;
    defaultFontName?: string;
    direction: Direction;
    timeFormat?: string;
    dateFormat?: string;
    calendar?: LocaleCalendar;
}


export interface StrongFBConfigOptions {
    apiEndPoint: string;
    viewContainerRef: ViewContainerRef;
    /**
     * @default 'access_token'
     */
    localStorageTokenKey?: string;
    /**
     * @default 'refresh_token'
     */
    localStorageRefreshTokenKey?: string;
    /**
     * @default 'Authentication'
     */
    authenticationHeaderName?: string;
    /**
     * @default '/login'
     */
    loginUrl?: string;
    getRefreshTokenApi?: (http: StrongFBHttpService) => Promise<{ access_token: string; refresh_token: string; }>;
    /**
     * @default 'en'
     */
    language?: AvailableLanguage;
    customLocales?: CustomLocales;
    /**
     * @default '/assets/StrongFB'
     */
    assetsBaseUrl?: string;
    /**
     * @default false
     */
    darkTheme?: boolean;
    /**
     * you can inject your custom services and use them later on forms
     * @default {}
     */
    injectServices?: { [k: string]: any };
}

export interface FormFieldMetaData<T = string> {
    name?: T;
    value?: any;
    error?: string;
    is_valid?: boolean;
    is_show?: boolean;
    /** 
     * if user try to change value
    */
    is_dirty?: boolean;
}