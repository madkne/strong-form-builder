import { StrongFBHttpService } from "../services/StrongFB-http.service";
import { StrongFBLayoutBuilder } from "./StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "./StrongFB-widget-header";
import { BehaviorSubject, Subject, takeUntil } from 'rxjs'

import { NotifyCssAnimationStyle, NotifyMode } from "./StrongFB-types";
import { StrongFBFormOptions } from "./StrongFB-interfaces";
import { StrongFBService } from "../services/StrongFB.service";
import { StrongFBLocaleService } from "../services/StrongFB-locale.service";

export class StrongFBFormClass<WIDGET extends string = string, FORM_FIELDS extends object = object, INIT_FIELDS extends object = FORM_FIELDS, CUSTOM_LOCALES extends string = string> {
    private _callOnInit = false;
    private _usedWidgets: { [k in WIDGET]?: StrongFBBaseWidgetHeader } = {};
    private _usedWidgetComponents: { [k in WIDGET]?: any } = {};
    private _http: StrongFBHttpService;
    private _formFieldValues = {};
    private _formFieldValuesUpdated$ = new BehaviorSubject<boolean>(true);
    private _options: StrongFBFormOptions;
    private _service: StrongFBService;
    protected destroy$ = new Subject<boolean>();

    public defaultLocaleNamespace: CUSTOM_LOCALES;

    constructor(_http: StrongFBHttpService, _service: StrongFBService, _options: StrongFBFormOptions<INIT_FIELDS> = {
        rtl: false,
    }) {
        this._http = _http;
        this._service = _service;
        this._options = _options;
    }
    /**
     * call before layout init
     */
    onInit() {

    }

    /**
     * call after layout loaded
     */
    onLoaded() {

    }
    /**
     * find a widget before used and init by its function name
     * @param name 
     * @returns StrongFBBaseWidgetHeader
     */
    findWidgetByName<WIDGET_HEADER extends StrongFBBaseWidgetHeader = StrongFBBaseWidgetHeader>(name: WIDGET): WIDGET_HEADER {
        return this._usedWidgets[name] as any;
    }

    updateFormFields(fields: FORM_FIELDS) {
        for (const key of Object.keys(fields)) {
            this._formFieldValues[key] = fields[key];
        }
        this._formFieldValuesUpdated$.next(true);
    }

    formFieldValues(): FORM_FIELDS {
        return this._formFieldValues as any;
    }

    injectService<R = any, T = string>(name: T): R {
        return this.service['_injectServices'][name as any];
    }

    notify(text: string, mode: NotifyMode = 'info', timeout = 3000, cssAnimationStyle: NotifyCssAnimationStyle = 'fade') {
        this.service.notify({
            mode,
            text,
            timeout,
            cssAnimationStyle,
        });
    }

    async confirm(title: string, text: string, okText?: string, cancelText?: string): Promise<boolean> {
        return new Promise((res) => {
            this.service.confirm({
                title,
                text,
                type: 'confirm',
                cssAnimationStyle: 'fade',
                okButtonText: okText,
                cancelButtonText: cancelText,
                okButtonCallback: () => {
                    res(true);
                },
                cancelButtonCallback: () => {
                    res(false);
                }
            });
        });
    }

    async prompt(title: string, text: string, defaultValue?: string, okText?: string, cancelText?: string): Promise<string> {
        return new Promise((res) => {
            this.service.confirm({
                title,
                text,
                type: 'prompt',
                okButtonText: okText,
                cancelButtonText: cancelText,
                inputPlaceholder: defaultValue,
                cssAnimationStyle: 'fade',
                okButtonCallback: (value) => {
                    res(value);
                },
                cancelButtonCallback: (value) => {
                    res(value);
                }
            });
        });
    }

    /**
     * translate a word with custom locales
     * must be override 'defaultLocaleNamespace'
     * @param key 
     * @param params 
     */
    __(key: string, params?: object) {
        if (!this.defaultLocaleNamespace) return key;
        return this.locale.__(this.defaultLocaleNamespace, key, params);
    }

    get layout(): StrongFBLayoutBuilder {
        return this.layoutBuilder();
    }

    layoutBuilder() {
        return new StrongFBLayoutBuilder<WIDGET>();
    }

    get http(): StrongFBHttpService {
        return this._http;
    }

    get locale(): StrongFBLocaleService<CUSTOM_LOCALES> {
        return this.service.locale();
    }

    get service(): StrongFBService {
        return this._service;
    }

    get initialData(): INIT_FIELDS {
        return this._options?.initData || {} as any;
    }
}