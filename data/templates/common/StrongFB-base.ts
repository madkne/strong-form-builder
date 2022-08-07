import { StrongFBLayoutBuilder } from "./StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "./StrongFB-widget-header";


export class StrongFBBase<WIDGET extends string = string> {
    protected _usedWidgets: { [k in WIDGET]?: StrongFBBaseWidgetHeader } = {};
    protected _usedWidgetComponents: { [k in WIDGET]?: any } = {};
    /**
     * find a widget before used and init by its function name
     * @param name 
     * @returns StrongFBBaseWidgetHeader
     */
    findWidgetByFormWidgetName<WIDGET_HEADER extends StrongFBBaseWidgetHeader = StrongFBBaseWidgetHeader>(name: WIDGET): WIDGET_HEADER {
        return this._usedWidgets[name] as any;
    }

    // updateWidgetByFormWidgetName(name: WIDGET) {
    //     if (!this._usedWidgetComponents[name]) return false;
    //     this._usedWidgetComponents[name]['widgetHeader'] = this._usedWidgets[name];

    //     return true;
    // }

    get layout(): StrongFBLayoutBuilder {
        return this.layoutBuilder();
    }

    layoutBuilder() {
        return new StrongFBLayoutBuilder<WIDGET>();
    }
}