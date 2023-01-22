import { APIStatusCodes, AvailableLanguage, ButtonAppearance, ButtonStatus, CustomLocales, Direction, HttpMethodName, LocaleCalendar, StrongFBValidatorName } from "./StrongFB-types";
import { StrongFBBaseLayoutBuilderSchema, StrongFBLayoutBuilderSchema } from "./StrongFB-layout-builder-types";


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
    baseUrl?: string;
}

export interface APIResponse<T = any> {
    result: T;
    statusCode: APIStatusCodes;
    paginate?: {

    },
    error?: any;
}

export interface StrongFBFormOptions<D extends object = object> {
    rtl?: boolean;
    fontFamily?: string;
    initData?: D;
    defaultLocaleNamespace?: string;
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
    viewContainerRef: any;
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
    getRefreshTokenApi?: (http: any) => Promise<{ access_token: string; refresh_token: string; }>;
    /**
     * @default 'en'
     */
    language?: AvailableLanguage;
    customLocales?: CustomLocales;
    /**
     * forms in default use from which locale namespace
     */
    defaultLocaleNamespace?: string;
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

export interface StrongFBJsonLayoutBuilderWidget {
    type: string;
    properties?: object;
    formFieldName?: string;
    commonStyles?: object;
}

export interface StrongFBJsonLayoutBuilderSchema<WIDGET extends string = string> extends StrongFBBaseLayoutBuilderSchema<WIDGET> {
    layouts?: StrongFBJsonLayoutBuilderSchema<WIDGET>[];
    widgets?: StrongFBJsonLayoutBuilderWidget[];
}

export interface StrongFBJsonFormSchema<WIDGET extends string = string> {
    version: string;
    form: {
        layout: StrongFBJsonLayoutBuilderSchema<WIDGET>;
    };
}


export interface StrongFBJsonApiRequestSchema {
    method?: HttpMethodName;
    params?: object;
    headers?: object;
    path?: string;
    url?: string;
    body?: any;
    _actions?: {
        name?: 'append_form_fields_to_body',
        value?: any;
    }[];
}