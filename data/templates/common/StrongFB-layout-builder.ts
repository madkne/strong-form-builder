import { BehaviorSubject } from "rxjs";
import { StrongFBLayoutBuilderProperties } from "./StrongFB-layout-builder-properties";
import { StrongFBLayoutBuilderBoxCommonProperties, StrongFBLayoutBuilderGridColumnType, StrongFBLayoutBuilderGridCommonProperties, StrongFBLayoutBuilderNormalBoxProperties, StrongFBLayoutBuilderSchema, StrongFBLayoutBuilderType } from "./StrongFB-layout-builder-types";
import { ScreenMode } from "./StrongFB-types";
import { StrongFBBaseWidgetHeader } from "./StrongFB-widget-header";



export class StrongFBLayoutBuilder<WIDGET extends string = string> {
    private _schema: StrongFBLayoutBuilderSchema = {};
    private _update$ = new BehaviorSubject<boolean>(true);

    private _propertiesClass: StrongFBLayoutBuilderProperties<WIDGET>;

    constructor(type: StrongFBLayoutBuilderType = 'box') {
        this._schema.type = type;
        this._propertiesClass = new StrongFBLayoutBuilderProperties(this);
    }

    columnBox(properties?: StrongFBLayoutBuilderBoxCommonProperties<WIDGET>) {
        this._schema.type = 'box';
        properties = this._makeObject(properties, ['style']);
        properties.style['display'] = 'flex';
        properties.style['flex-direction'] = 'column';
        this._setBoxCommonProperties(properties);


        return this._propertiesClass = new StrongFBLayoutBuilderProperties<WIDGET>(this);
    }
    rowBox(properties?: StrongFBLayoutBuilderBoxCommonProperties<WIDGET>) {
        this._schema.type = 'box';
        properties = this._makeObject(properties, ['style']);
        properties.style['display'] = 'flex';
        properties.style['flex-direction'] = 'row';
        properties.style['align-items'] = 'center';
        this._setBoxCommonProperties(properties);


        return this._propertiesClass = new StrongFBLayoutBuilderProperties<WIDGET>(this);

    }
    box(properties?: StrongFBLayoutBuilderNormalBoxProperties<WIDGET>) {
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

    fullFlexBox(properties?: StrongFBLayoutBuilderBoxCommonProperties<WIDGET>) {
        this._schema.type = 'box';
        properties = this._makeObject(properties, ['style']);
        properties.style['flex'] = '1 1 0';
        this._setBoxCommonProperties(properties);


        return this._propertiesClass = new StrongFBLayoutBuilderProperties<WIDGET>(this);

    }

    centerScreenBox(properties?: StrongFBLayoutBuilderBoxCommonProperties<WIDGET>) {
        this._schema.type = 'box';
        properties = this._makeObject(properties, ['style']);
        properties.style['height'] = '100%';
        properties.style['display'] = 'flex';
        properties.style['align-items'] = 'center';
        properties.style['justify-content'] = 'center';
        this._setBoxCommonProperties(properties);


        return this._propertiesClass = new StrongFBLayoutBuilderProperties<WIDGET>(this);

    }

    gridBox(properties?: StrongFBLayoutBuilderGridCommonProperties<WIDGET>) {
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
    generateSchema() {
        let currentSchema = this._schema;
        if (currentSchema.layouts) {
            // for (let i = 0; i < currentSchema.layouts.length; i++) {
            //     currentSchema.layouts[i].layouts[0].
            // }
            // for (const layout of currentSchema.layouts) {
            //     la
            // }
        }
        return currentSchema;
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