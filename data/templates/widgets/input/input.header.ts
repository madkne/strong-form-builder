import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { InputSchema, InputSize, InputStatus, InputType } from "./input-interfaces";
import { StrongFBInputWidgetComponent } from "./input.component";



export class StrongFBInputWidget<FIELDS = { [k: string]: any }> extends StrongFBBaseWidgetHeader<InputSchema> {

    protected override _schema: InputSchema = {};

    override get component(): any {
        return StrongFBInputWidgetComponent;
    }

    override get widgetName(): string {
        return 'input';
    }

    type(typ: InputType) {
        this._schema.type = typ;
        return this;
    }

    size(size: InputSize) {
        this._schema.size = size;
        return this;
    }
    status(status: InputStatus) {
        this._schema.status = status;
        return this;
    }

    placeholder(text: string) {
        this._schema.placeholder = text;
        return this;
    }

    disabled(is = true) {
        this._schema.disabled = is;
        return this;
    }

    value<T = string>(text: T) {
        this._schema.value = text as any;
        return this;
    }

    formFieldName(name: keyof FIELDS) {
        this._formFieldName = name as any;
        return this;
    }

    fullWidth(is = true) {
        this._schema.fullWidth = is;
        return this;
    }

    get keyup() {
        if (!this._schema.keyEvents) {
            this._schema.keyEvents = [];
        }
        return {
            enter: (callback: (event: KeyboardEvent, self?: StrongFBInputWidget) => any) => {
                this._schema.keyEvents.push({
                    keyNumber: 13,
                    callback,
                    keyType: 'keyup',
                });
                return this;
            }
        }
    }
}