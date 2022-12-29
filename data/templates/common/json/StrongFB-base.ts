
import { StrongFBLayoutBuilder } from "./StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "./StrongFB-widget-header";


import { NotifyCssAnimationStyle, NotifyMode, TransmitChannelName } from "./StrongFB-types";
import { FormFieldMetaData, StrongFBFormOptions } from "./StrongFB-interfaces";



export class StrongFBFormClass<WIDGET extends string = string, FORM_FIELDS extends object = object, INIT_FIELDS extends object = FORM_FIELDS, CUSTOM_LOCALES extends string = string, TRANSMIT extends string = TransmitChannelName> {
    private _callOnInit = false;
    private _usedWidgets: { [k in WIDGET]?: StrongFBBaseWidgetHeader } = {};
    private _usedWidgetComponents: { [k in WIDGET]?: any } = {};
    private _http: any;
    private _formFieldValues = {};
    private _formFieldMetaData: { [k in keyof FORM_FIELDS]?: FormFieldMetaData } = {};
    private _options: StrongFBFormOptions;
    private _service: any;
    protected _transmit: any;

    public defaultLocaleNamespace: CUSTOM_LOCALES;

    constructor(
        _http: any, _service: any,
        _transmit: any,
        _options: StrongFBFormOptions<INIT_FIELDS> = {
            rtl: false,
        }) {
        this._http = _http;
        this._service = _service;
        this._options = _options;
        this._transmit = _transmit;
        if (_options.defaultLocaleNamespace) {
            this.defaultLocaleNamespace = _options.defaultLocaleNamespace as any;
        }
    }
    /**
     * call before layout init
     */
    async onInit() {
        //TODO: call by child
    }

    /**
     * call after layout loaded
     */
    onLoaded() {
        //TODO: call by child
    }

    get transmit() {
        return this._transmit;
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
    }

    formFieldValues(): FORM_FIELDS {
        return this._formFieldValues as any;
    }

    formFieldMeta<T = keyof FORM_FIELDS>(name: T): FormFieldMetaData<T> {
        return this._formFieldMetaData[name as any];
    }

    setFormFieldMeta<T = keyof FORM_FIELDS>(name: T, meta?: FormFieldMetaData) {
        if (name === undefined) return false;
        if (!this._formFieldMetaData[name as any]) this._formFieldMetaData[name as any] = {};
        if (!meta) return true;
        for (const key of Object.keys(meta)) {
            this._formFieldMetaData[name as any][key] = meta[key];
        }
        // =>set name
        this._formFieldMetaData[name as any].name = name;
        return true;
    }

    formFieldValuesWithMeta(): FormFieldMetaData<keyof FORM_FIELDS>[] {
        let fields: FormFieldMetaData<keyof FORM_FIELDS>[] = [];
        for (const key of Object.keys(this._formFieldValues)) {
            if (!this._formFieldMetaData[key]) {
                this._formFieldMetaData[key] = {
                    name: key as any,
                    is_valid: true,
                    value: this._formFieldValues[key],
                }
            }
        }

        for (const key of Object.keys(this._formFieldMetaData)) {
            this._formFieldMetaData[key].name = key;
            if (this._formFieldValues[key] !== undefined) {
                this._formFieldMetaData[key].value = this._formFieldValues[key];
            }
            fields.push(this._formFieldMetaData[key]);
        }
        return fields as any;
    }




    get layout(): StrongFBLayoutBuilder {
        return this.layoutBuilder();
    }

    layoutBuilder() {
        return new StrongFBLayoutBuilder<WIDGET>();
    }


    get initialData(): INIT_FIELDS {
        return this._options?.initData || {} as any;
    }
}