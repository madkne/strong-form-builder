import { BehaviorSubject } from "rxjs";
import { StrongFBLayoutBuilder } from "./StrongFB-layout-builder";
import { StrongFBLayoutBuilderBoxCommonProperties, StrongFBLayoutBuilderGridColumnType, StrongFBLayoutBuilderNormalBoxProperties, StrongFBLayoutBuilderSchema, StrongFBLayoutBuilderType, StrongFBLayoutBuilderWidgetFunction } from "./StrongFB-layout-builder-types";
import { ScreenMode } from "./StrongFB-types";
import { StrongFBBaseWidgetHeader } from "./StrongFB-widget-header";



export class StrongFBLayoutBuilderProperties<WIDGET extends string = string> {
    private _schema: StrongFBLayoutBuilderSchema<WIDGET> = {};
    private _mainLayout: StrongFBLayoutBuilder<WIDGET>;

    constructor(layout: StrongFBLayoutBuilder) {
        this._schema = layout.schema;
        this._mainLayout = layout;
    }


    widget(widget: StrongFBLayoutBuilderWidgetFunction | StrongFBLayoutBuilderWidgetFunction[]) {
        if (!Array.isArray(widget)) widget = [widget];
        if (!this._schema.widgets) this._schema.widgets = [];
        this._schema.widgets.push(...widget);
        return this;
    }

    widgets(widgets: StrongFBLayoutBuilderWidgetFunction<StrongFBBaseWidgetHeader[]>) {
        if (!this._schema.widgetHeaders) this._schema.widgetHeaders = [];
        this._schema.widgetHeaders.push(widgets);
        return this;
    }

    styleClass(clas: string | string[]) {
        if (!Array.isArray(clas)) clas = [clas];
        if (!this._schema.classes) this._schema.classes = [];
        this._schema.classes.push(...clas);
        return this;
    }

    styleCss(key: string, value: string) {
        if (!this._schema.styles) this._schema.styles = {};
        this._schema.styles[key] = value;
        return this;
    }

    id(id: string) {
        this._schema.id = id;

        return this;
    }

    layout(layout: StrongFBLayoutBuilder<WIDGET> | StrongFBLayoutBuilder<WIDGET>[]) {
        if (!Array.isArray(layout)) layout = [layout];
        if (!this._schema.layouts) this._schema.layouts = [];
        this._schema.layouts.push(...layout);
        return this;
    }

    gridColumnLayout(widths: { [k in ScreenMode]?: StrongFBLayoutBuilderGridColumnType }, layout: StrongFBLayoutBuilder<WIDGET>) {
        let classNames = [];
        // =>create class name by params
        let screenModeMap: { [k in ScreenMode]: string } = {
            'desktop': '',
            'mobile': 'sm',
            'tablet': 'md',
        };
        for (const screen of Object.keys(widths)) {
            if (screenModeMap[screen] === '') {
                classNames.push(widths[screen]);
            } else {
                let sp = widths[screen].split('-');
                classNames.push(sp[0] + '-' + screenModeMap[screen] + '-' + sp[1]);
            }
        }
        // =>add classes to layout
        if (!this._schema['layoutClasses']) this._schema['layoutClasses'] = [];


        if (!Array.isArray(this._schema.layouts)) this._schema.layouts = [];
        this._schema.layouts.push(layout);
        this._schema['layoutClasses'].push(classNames);
        return this;
    }

    /**
     * after layout completed, this method returns instance of StrongFBLayoutBuilder class
     */
    finish() {
        return this._mainLayout;
    }

    /**
     * return back schema of this layout
     */
    get schema() {
        return this._schema;
    }




    /****************************************** */
    /****************************************** */
    /****************************************** */

    private _setPropertyAsArray(key: keyof StrongFBLayoutBuilderSchema, property: any[] | any) {
        if (!property) property = [];
        if (!Array.isArray(property)) property = [property];
        this._schema[key as any] = property;
    }

    private _makeObject(obj: object, objectProperties?: string[], arrayProperties?: string[]) {
        if (!obj) obj = {};
        if (objectProperties) {
            for (const prop of objectProperties) {
                if (!obj[prop]) obj[prop] = {};
            }
        }
        if (arrayProperties) {
            for (const prop of arrayProperties) {
                if (!obj[prop]) obj[prop] = [];
            }
        }

        return obj;
    }
}