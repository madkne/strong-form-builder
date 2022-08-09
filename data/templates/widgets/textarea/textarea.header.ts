import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { InputSize, InputStatus, InputType } from "../input/input-interfaces";
import { TextAreaSchema } from "./textarea-interfaces";
import { StrongFBTextAreaWidgetComponent } from "./textarea.component";



export class StrongFBTextAreaWidget<FIELDS = { [k: string]: any }> extends StrongFBBaseWidgetHeader<TextAreaSchema> {

    protected override _schema: TextAreaSchema = {};

    override get component(): any {
        return StrongFBTextAreaWidgetComponent;
    }

    override get widgetName(): string {
        return 'textarea';
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

    rows(rows: number) {
        this._schema.rows = rows;
        return this;
    }

    cols(cols: number) {
        this._schema.cols = cols;
        return this;
    }
    maxWidth(width: string) {
        this._schema.maxWidth = width;
        return this;
    }

    maxHeight(height: string) {
        this._schema.maxHeight = height;
        return this;
    }
}