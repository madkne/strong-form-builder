import { StrongFBFormClass } from "./StrongFB-base";
import { StrongFBBaseWidgetHeader } from "./StrongFB-widget-header";

import { StrongFBLayoutBuilderSchema, StrongFBLayoutBuilderWidgetFunction } from "./StrongFB-layout-builder-types";
import { checkAndDoByInterval, SFB_info, SFB_warn } from "./StrongFB-common";


export class StrongFBBaseWidget<SCHEMA extends object = { [k: string]: any }> {
    protected _widgetId: string;
    protected showLoading = true;
    public widgetHeader: StrongFBBaseWidgetHeader<SCHEMA>;
    public widgetForm: StrongFBFormClass;
    protected displayComponentLoading = false;
    protected ngModelValue: any;
    protected prefixId = 'unknown';


    public schema: SCHEMA;
    public show = true;
    public readyToUse = false;

    protected emitAutoReadyToUse = true;

    /******************************************* */

    constructor() {


    }

    get widgetId() {
        this._generateWidgetId();
        return this._widgetId;
    }
    private _generateWidgetId() {
        if (this._widgetId) return;
        this._widgetId = `strong_fb_${this.prefixId}_widget_` + new Date().getTime() + '_' + Math.ceil(Math.random() * 10000);
    }

}