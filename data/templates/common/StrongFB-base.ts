import { StrongFBHttpService } from "../services/StrongFB-http.service";
import { StrongFBLayoutBuilder } from "./StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "./StrongFB-widget-header";
import { BehaviorSubject } from 'rxjs'
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { NotifyMode } from "./StrongFB-types";
import { StrongFBFormOptions } from "./StrongFB-interfaces";
import { StrongFBService } from "../services/StrongFB.service";

export class StrongFBFormClass<WIDGET extends string = string, FORM_FIELDS extends object = object> {
    private _callOnInit = false;
    private _usedWidgets: { [k in WIDGET]?: StrongFBBaseWidgetHeader } = {};
    private _usedWidgetComponents: { [k in WIDGET]?: any } = {};
    private _http: StrongFBHttpService;
    private _formFieldValues = {};
    private _formFieldValuesUpdated$ = new BehaviorSubject<boolean>(true);
    private _options: StrongFBFormOptions;
    private _service: StrongFBService;

    constructor(_http: StrongFBHttpService, _service: StrongFBService, _options: StrongFBFormOptions = {
        rtl: false,
    }) {
        this._http = _http;
        this._service = _service;
        this._options = _options;
    }
    /**
     * call after layout complete
     */
    onInit() {

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

    notify(text: string, mode: NotifyMode = 'info', timeout = 3000, cssAnimationStyle: 'fade' | 'zoom' | 'from-right' | 'from-top' | 'from-bottom' | 'from-left' = 'fade') {
        let options = {
            rtl: this._options.rtl,
            timeout,
            clickToClose: true,
            cssAnimationStyle,
        };
        if (this._options.fontFamily) {
            options['fontFamily'] = this._options.fontFamily;
        }
        Notify[mode](text, options);
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
    get service(): StrongFBService {
        return this._service;
    }
}