import { BehaviorSubject } from "rxjs";
import { json2WidgetClass } from "./helpers/StrongFB-json";
import { clone, generateId, SFB_error } from "./StrongFB-common";
import { StrongFBJsonLayoutBuilderSchema } from "./StrongFB-interfaces";
import { StrongFBLayoutBuilderProperties } from "./StrongFB-layout-builder-properties";
import { StrongFBLayoutBuilderBoxCommonProperties, StrongFBLayoutBuilderGridColumnType, StrongFBLayoutBuilderGridCommonProperties, StrongFBLayoutBuilderNormalBoxProperties, StrongFBLayoutBuilderSchema, StrongFBLayoutBuilderType } from "./StrongFB-layout-builder-types";
import { ScreenMode } from "./StrongFB-types";
import { StrongFBBaseWidgetHeader } from "./StrongFB-widget-header";



export class StrongFBLayoutBuilder<WIDGET extends string = string> {
    private _schema: StrongFBLayoutBuilderSchema = {};
    private _update$ = new BehaviorSubject<boolean>(true);

    private _propertiesClass: StrongFBLayoutBuilderProperties<WIDGET>;

    private _id: string;

    constructor(type: StrongFBLayoutBuilderType = 'box') {
        this._id = generateId('layout');
        this._schema.type = type;
        this._propertiesClass = new StrongFBLayoutBuilderProperties(this);
    }

    columnBox(properties?: StrongFBLayoutBuilderBoxCommonProperties<WIDGET>): StrongFBLayoutBuilderProperties<WIDGET> {
        this._schema.type = 'box';
        properties = this._makeObject(properties, ['style']);
        properties.style['display'] = 'flex';
        properties.style['flex-direction'] = 'column';
        this._setBoxCommonProperties(properties);


        return this._propertiesClass = new StrongFBLayoutBuilderProperties<WIDGET>(this);
    }
    rowBox(properties?: StrongFBLayoutBuilderBoxCommonProperties<WIDGET>): StrongFBLayoutBuilderProperties<WIDGET> {
        this._schema.type = 'box';
        properties = this._makeObject(properties, ['style']);
        properties.style['display'] = 'flex';
        properties.style['flex-direction'] = 'row';
        properties.style['align-items'] = 'center';
        this._setBoxCommonProperties(properties);


        return this._propertiesClass = new StrongFBLayoutBuilderProperties<WIDGET>(this);

    }

    rowReverseBox(properties?: StrongFBLayoutBuilderBoxCommonProperties<WIDGET>): StrongFBLayoutBuilderProperties<WIDGET> {
        this._schema.type = 'box';
        properties = this._makeObject(properties, ['style']);
        properties.style['display'] = 'flex';
        properties.style['flex-direction'] = 'row-reverse';
        properties.style['align-items'] = 'center';
        this._setBoxCommonProperties(properties);


        return this._propertiesClass = new StrongFBLayoutBuilderProperties<WIDGET>(this);

    }

    box(properties?: StrongFBLayoutBuilderNormalBoxProperties<WIDGET>): StrongFBLayoutBuilderProperties<WIDGET> {
        this._schema.type = 'box';
        this._setBoxCommonProperties(properties);
        if (properties?.text) {
            this._schema.text = properties?.text;
        }
        if (properties?.html) {
            this._schema.html = properties?.html;
        }


        return this._propertiesClass = new StrongFBLayoutBuilderProperties<WIDGET>(this);

    }

    fullFlexBox(properties?: StrongFBLayoutBuilderBoxCommonProperties<WIDGET>): StrongFBLayoutBuilderProperties<WIDGET> {
        this._schema.type = 'box';
        properties = this._makeObject(properties, ['style']);
        properties.style['flex'] = '1 1 0';
        this._setBoxCommonProperties(properties);


        return this._propertiesClass = new StrongFBLayoutBuilderProperties<WIDGET>(this);

    }

    centerScreenBox(properties?: StrongFBLayoutBuilderBoxCommonProperties<WIDGET>): StrongFBLayoutBuilderProperties<WIDGET> {
        this._schema.type = 'box';
        properties = this._makeObject(properties, ['style']);
        properties.style['height'] = '100%';
        properties.style['display'] = 'flex';
        properties.style['align-items'] = 'center';
        properties.style['justify-content'] = 'center';
        this._setBoxCommonProperties(properties);


        return this._propertiesClass = new StrongFBLayoutBuilderProperties<WIDGET>(this);

    }

    gridBox(properties?: StrongFBLayoutBuilderGridCommonProperties<WIDGET>): StrongFBLayoutBuilderProperties<WIDGET> {
        this._schema.type = 'grid';
        properties = this._makeObject(properties, ['style']);
        properties.style['display'] = 'flex';
        properties.style['flex-wrap'] = 'wrap';
        properties.style['align-items'] = 'center';
        this._setBoxCommonProperties(properties);

        return this._propertiesClass = new StrongFBLayoutBuilderProperties<WIDGET>(this);
    }




    /**
     * return back schema of this layout
     */
    get schema() {
        return this._schema;
    }

    /**
     * generate schema in recursive
     */
    async generateSchema(formClass?: any) {
        let currentSchema = this._schema;
        // =>set layouts
        if (currentSchema.layouts) {
            let _layouts = [];
            for (const layout of currentSchema.layouts) {
                _layouts.push(await layout.generateSchema(formClass));
            }
            currentSchema.layouts = _layouts;
        }
        // =>set widgets
        if (currentSchema.widgets) {
            let _widgets = [];
            for (const wid of currentSchema.widgets) {
                let widgetRes = await wid.call(formClass ?? this);
                const addWidget = async (widgetClass: any) => {
                    let props = widgetClass._schema;
                    if (widgetClass['toObject']) {
                        props = await widgetClass.toObject();
                    }
                    _widgets.push({
                        type: widgetClass.widgetName,
                        properties: props
                    });
                }
                // console.log('ffff:', widgetRes)
                if (Array.isArray(widgetRes)) {
                    for (const item of widgetRes) {
                        await addWidget(item);
                    }
                } else {
                    await addWidget(widgetRes);
                }
            }
            currentSchema.widgets = _widgets;
        }
        return currentSchema;
    }

    loadSchemaByJson(json: StrongFBJsonLayoutBuilderSchema) {
        // =>load all schema
        try {
            this._schema = clone(json);
        } catch (e) {
            SFB_error('bad json layout', json);
            return;
        }
        // =>parse layouts
        this._schema.layouts = [];
        if (json.layouts) {
            for (const lay of json.layouts) {
                let newLayout = new StrongFBLayoutBuilder();
                newLayout.loadSchemaByJson(lay);
                this._schema.layouts.push(newLayout);
            }
        }
        // =>parse widgets
        this._schema.widgets = [];
        if (json.widgets) {
            for (const wid of json.widgets) {
                this._schema.widgets.push(async () => {
                    let res = json2WidgetClass(wid);
                    return res;
                });
            }
        }

    }
    /****************************************** */
    /****************************************** */
    /****************************************** */
    private _setBoxCommonProperties(properties: StrongFBLayoutBuilderBoxCommonProperties) {
        if (!properties) properties = {};
        if (properties.style) {
            this.schema.styles = properties.style;
        }
        this._setPropertyAsArray('classes', properties.class);
        this._setPropertyAsArray('layouts', properties.layout);
        this.schema.id = properties.id;
        this._setPropertyAsArray('widgets', properties.widget);
    }

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