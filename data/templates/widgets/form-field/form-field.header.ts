import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBValidatorName, StrongFBWidgetShowCallback } from "../../common/StrongFB-types";
import { StrongFBValidator } from "../../common/StrongFB-validator";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { StrongFBButtonWidget } from "../button/button.header";
import { StrongFBInputWidget } from "../input/input.header";
import { FormFieldErrorCallback, FormFieldSchema, FormFieldSize, FormFieldType } from "./form-field-interfaces";
import { StrongFBFormFieldWidgetComponent } from "./form-field.component";



export class StrongFBFormFieldWidget extends StrongFBBaseWidgetHeader<FormFieldSchema> {

    protected override _schema: FormFieldSchema = {};


    override get component(): any {
        return StrongFBFormFieldWidgetComponent;
    }

    override get widgetName(): string {
        return 'form-field';
    }


    disabled(is = true) {
        this._schema.disabled = is;
        return this;
    }

    field(field: FormFieldType) {
        this._schema.field = field;
        if (this._showCallback) {
            this._schema.field.showByCallback(this._showCallback);
        }
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

    // value<T = string>(text: T) {
    //     this._schema.value = text as any;
    //     return this;
    // }

    /**
     * @param callback 
     * @returns 
     */
    formFieldError(callback: FormFieldErrorCallback) {
        this._schema.formFieldErrorCallback = callback;
        return this;
    }
}