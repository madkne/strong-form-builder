import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { StrongFBButtonWidgetComponent } from "./button.component";
import { ButtonClickEvent, ButtonMode, ButtonSchema, ButtonShape, ButtonSize } from "./button-interfaces";
import { ButtonAppearance, ButtonStatus } from "../../common/StrongFB-types";



export class StrongFBButtonWidget extends StrongFBBaseWidgetHeader {

    protected override _schema: ButtonSchema = {};

    override get component(): any {
        return StrongFBButtonWidgetComponent;
    }

    override get widgetName(): string {
        return 'button';
    }

    size(size: ButtonSize) {
        this._schema.size = size;
        return this;
    }

    appearance(appearance: ButtonAppearance) {
        this._schema.appearance = appearance;
        return this;
    }

    shape(shape: ButtonShape) {
        this._schema.shape = shape;
        return this;
    }

    status(status: ButtonStatus) {
        this._schema.status = status;
        return this;
    }

    mode(mode: ButtonMode) {
        this._schema.mode = mode;
        return this;
    }

    text(text: string) {
        this._schema.text = text;
        return this;
    }

    tooltip(text: string) {
        this._schema.tooltip = text;
        return this;
    }

    icon(icon: string) {
        this._schema.icon = icon;
        return this;
    }

    fullWidth(is = true) {
        this._schema.fullWidth = is;
        return this;
    }

    disabled(is = true) {
        this._schema.disabled = is;
        return this;
    }

    /**
     * 
     * @param formFieldNames if not set, scan all  fields with form field name
     * @returns 
     */
    disabledForFormFields<T extends string = string>(formFieldNames?: T[]) {
        if (!formFieldNames) formFieldNames = ['*'] as any;
        this._schema.disabledForFormFields = formFieldNames;
        return this;
    }

    /********************************* */
    /*************EVENTS************** */
    /********************************* */
    click(click: ButtonClickEvent) {
        this._schema.click = click;
        return this;
    }


    private _loadFromJson(json: object) {
        this._schema = json as any;

    }



}