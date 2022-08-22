import { AfterViewInit, Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { takeUntil } from 'rxjs';
import { SFB_warn } from '../../common/StrongFB-common';
import { StrongFBValidatorName } from '../../common/StrongFB-types';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { StrongFBBaseWidgetHeader } from '../../common/StrongFB-widget-header';
import { StrongFBInputWidget } from '../input/input.header';
import { FormFieldSchema } from './form-field-interfaces';

@Component({
    selector: 'form-field-widget',
    templateUrl: './form-field.component.html',
    styleUrls: ['./form-field.component.scss']
})
export class StrongFBFormFieldWidgetComponent extends StrongFBBaseWidget<FormFieldSchema> implements AfterViewInit {
    @ViewChild('FieldContainer', { read: ViewContainerRef }) FieldContainer: ViewContainerRef;
    override schema: FormFieldSchema;
    fieldIsLoaded = false;
    fieldWidget: StrongFBBaseWidgetHeader;
    formFieldInstance: ComponentRef<StrongFBBaseWidget>[] = [];
    errorMessage: string;



    override async onInit() {
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = await this.normalizeSchema(this.schema);

    }

    async normalizeSchema(schema: FormFieldSchema) {
        if (this.schema.validator && !this.schema.validator['_widgetForm']) {
            this.schema.validator['_widgetForm'] = this.widgetForm;
        }
        if (!schema.size) schema.size = 'medium';
        // =>if no any fields, load fallback
        if (!schema.field) {
            schema.field = new StrongFBInputWidget();
        }
        // =>set field size, same as form field
        if (schema.field['size']) {
            schema.field['size'](schema.size);
        }
        // =>load suffix button
        if (this.schema.field) {
            schema.__suffixButtonWidget = await (() => this.schema.suffixButton).call(this.widgetForm);
        }


        return schema;
    }

    get fieldId() {
        if (!this.formFieldInstance || this.formFieldInstance.length == 0) return '';
        return this.formFieldInstance[0].instance.widgetId;
    }

    override afterViewInit(): void {

        let setContainerInterval = setInterval(async () => {
            if (!this.FieldContainer) return;
            this.FieldContainer.clear();
            // =>load dynamic field
            this.formFieldInstance = (await this.loadDynamicWidgets(this.FieldContainer, { widgets: [() => this.schema.field] })).widgetComponents;
            this.fieldIsLoaded = true;

            // =>listen on ngModelChange
            this.formFieldInstance[0].instance['ngModelChange'].pipe(takeUntil(this.destroy$)).subscribe(it => this.changeFormFieldValue(it));
            // =>if field is required
            //FIXME: may be set default value on field nad must be check it!
            if (this.schema.validator && this.schema.validator.schema.find(i => i.name === 'required') && this.formFieldInstance[0].instance.show && !this.schema.formFieldHasError) {
                this.formFieldError('required', undefined);
                this.widgetForm['_formFieldValuesUpdated$'].next(true);
            }

            clearInterval(setContainerInterval);
        }, 100);

    }

    isRequiredField() {
        if (!this.schema?.validator) return false;
        if (this.schema.validator.schema.find(i => i.name === 'required')) return true;
        return false;
    }

    async changeFormFieldValue(event) {
        // console.log('change value:', event);
        // =>check validators with value
        let widget = this.formFieldInstance[0].instance;
        this.schema.formFieldHasError = undefined;
        if (this.schema.validator) {
            let res = await this.schema.validator.checkValidators(event, this.widgetForm);
            if (res.isValid) {
                this.errorMessage = undefined;
                // =>set success status
                widget.schema['status'] = 'success';
            } else {
                this.formFieldError(res.name, event, res.error);
                // =>reset value in form field
                if (widget.widgetHeader['_formFieldName']) {
                    widget.widgetForm['_formFieldValues'][widget.widgetHeader['_formFieldName']] = undefined;
                }

                // =>reset value of widget
                widget.schema['value'] = undefined;
                // =>set danger status
                widget.schema['status'] = 'danger';

            }
        }
    }

    formFieldError(name: StrongFBValidatorName, value: any, error?: string) {
        this.schema.formFieldHasError = name;
        this.widgetHeader['_schema']['formFieldHasError'] = name;
        if (error) {
            this.errorMessage = error;
        }
        // =>raise form field error
        if (this.schema.formFieldErrorCallback) {
            this.schema.formFieldErrorCallback.call(this.widgetForm, name, value, this.widgetHeader);
        }
    }
}
