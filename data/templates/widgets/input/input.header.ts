import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { InputSchema, InputSize, InputStatus, InputType } from "./input-interfaces";
import { StrongFBInputWidgetComponent } from "./input.component";



export class StrongFBInputWidget extends StrongFBBaseWidgetHeader<InputSchema> {

    protected override _schema: InputSchema = {};

    override get component(): any {
        return StrongFBInputWidgetComponent;
    }

    override get name(): string {
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

}