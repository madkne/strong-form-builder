import { BehaviorSubject } from "rxjs";
import { json2WidgetClass } from "../../common/helpers/StrongFB-json";
import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBValidatorName, StrongFBWidgetShowCallback } from "../../common/StrongFB-types";
import { StrongFBValidator } from "../../common/StrongFB-validator";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { StrongFBButtonWidget } from "../button/button.header";
import { StrongFBInputWidget } from "../input/input.header";
import { FormAppearance, FormFieldErrorCallback, FormFieldSchema, FormFieldSize, FormFieldType } from "./form-field-interfaces";
import { StrongFBFormFieldWidgetComponent } from "./form-field.component";



export class StrongFBFormFieldWidget extends StrongFBBaseWidgetHeader<FormFieldSchema> {

    private _updateValue$ = new BehaviorSubject<boolean>(false);

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
        this._updateValue$.next(true);
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

    private _loadFromJson(json: object) {
        this._schema = json as any;
        // =>parse validator
        if (this._schema?.validator) {
            let validator = new StrongFBValidator();
            validator['_schema'] = this._schema.validator as any
            this._schema.validator = validator;
        }
        // =>parse field
        if (this._schema?.field) {
            this._schema.field = json2WidgetClass(this._schema.field as any) as any;
        }

    }
}