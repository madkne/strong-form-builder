import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { ToggleSchema, ToggleLabel, ToggleStatus } from "./toggle-interfaces";
import { StrongFBToggleWidgetComponent } from "./toggle.component";



export class StrongFBToggleWidget<FIELDS = { [k: string]: any }> extends StrongFBBaseWidgetHeader<ToggleSchema> {

    protected override _schema: ToggleSchema = {};

    override get component(): any {
        return StrongFBToggleWidgetComponent;
    }

    override get widgetName(): string {
        return 'toggle';
    }

    status(status: ToggleStatus) {
        this._schema.status = status;
        return this;
    }

    labelPosition(labelPosition: ToggleLabel) {
        this._schema.labelPosition = labelPosition;
        return this;
    }

    disabled(is = true) {
        this._schema.disabled = is;
        return this;
    }

    checked(is = true) {
        this._schema.checked = is;
        return this;
    }

    value<T = boolean>(is: T) {
        this._schema.value = is as any;
        return this;
    }

    formFieldName(name: keyof FIELDS) {
        this._formFieldName = name as any;
        return this;
    }

    label(text: string) {
        this._schema.label = text;
        return this;
    }
}