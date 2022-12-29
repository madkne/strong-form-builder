import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBValidatorName, StrongFBWidgetShowCallback } from "../../common/StrongFB-types";
import { StrongFBValidator } from "../../common/StrongFB-validator";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { StrongFBButtonWidget } from "../button/button.header";
import { StrongFBInputWidget } from "../input/input.header";
import { FormAppearance, FormFieldErrorCallback, FormFieldSchema, FormFieldSize, FormFieldType } from "./form-field-interfaces";




export class StrongFBFormFieldWidget extends StrongFBBaseWidgetHeader<FormFieldSchema> {

    protected override _schema: FormFieldSchema = {};


    override get widgetName(): string {
        return 'form-field';
    }


    disabled(is = true) {
        this._schema.disabled = is;
        return this;
    }

    field(field: FormFieldType) {
        this._schema.field = field;
        // if (this._showCallback) {
        //     this._schema.field.showByCallback(this._showCallback);
        // }FIXME:
        return this;
    }

    suffixButton(button: StrongFBButtonWidget) {
        this._schema.suffixButton = button;
        return this;
    }

    size(size: FormFieldSize) {
        this._schema.size = size;
        return this;
    }

    label(text: string) {
        this._schema.label = text;
        return this;
    }
    appearance(typ: FormAppearance) {
        this._schema.appearance = typ;
        return this;
    }

    hint(text: string) {
        this._schema.hint = text;
        return this;
    }

    validator(validator: StrongFBValidator) {
        this._schema.validator = validator;
        return this;
    }

    /**
     * call this method after 'field' method
     * @param val 
     * @returns 
     */
    value<T = string>(val: T) {
        if (!this._schema.field) return this;

        this._schema.field['_schema']['value'] = val as any;
        return this;
    }


    async toObject() {
        let obj = this._schema;
        // =>normalize field
        if (this._schema.field) {
            let props = {};
            if (this._schema.field['toObject']) {
                props = await this._schema.field['toObject']() as any;
            } else {
                props = this._schema.field['_schema'] as any;
            }
            this._schema.field = {
                type: this._schema.field.widgetName,
                properties: props,
            } as any;
        }
        // =>normalize validator
        if (this._schema.validator) {
            this._schema.validator = this._schema.validator['_schema'] as any;
        }

        return obj;
    }


}