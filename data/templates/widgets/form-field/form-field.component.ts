import { AfterViewInit, Component, ComponentRef, ViewChild, ViewContainerRef } from '@angular/core';
import { takeUntil } from 'rxjs';
import { checkAndDoByInterval, SFB_warn } from '../../common/StrongFB-common';
import { StrongFBCheckValidatorsResponse } from '../../common/StrongFB-interfaces';
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

    protected override emitAutoReadyToUse = false;



    override async onInit() {
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = await this.normalizeSchema(this.schema);

    }

    override async onShow() {
        this.ngAfterViewInit();
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
        // =>set appearance
        if (!schema.appearance) {
            schema.appearance = 'default';
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
            // =>set field properties
            if (this.schema.disabled !== undefined) {
                this.schema.field.schema['disabled'] = this.schema.disabled;
            }
            // =>load dynamic field
            this.formFieldInstance = (await this.loadDynamicWidgets(this.FieldContainer, { widgets: [() => this.schema.field] })).widgetComponents;
            // =>set form schema on widget
            checkAndDoByInterval(
                () => this.formFieldInstance[0].instance['schema'] !== undefined,
                () => {
                    // =>check is required field
                    this.isRequiredField();
                    // =>set form
                    this.formFieldInstance[0].instance['schema']['_form'] = this.schema;
                    this.fieldIsLoaded = true;
                }, 5);

            // =>listen on ngModelChange
            this.formFieldInstance[0].instance['ngModelChange'].pipe(takeUntil(this.destroy$)).subscribe(it => this.changeFormFieldValue(it));
            // =>listen on showChange
            this.showChange.pipe(takeUntil(this.destroy$)).subscribe(it => {
                // =>set show state
                this.widgetForm.setFormFieldMeta(this.formFieldInstance[0].instance.widgetHeader['_formFieldName'], { is_show: it });
                this.changeFormFieldValue(this.formFieldInstance[0].instance['ngModelValue']);
            });

            // =>listen on showChange
            // this.formFieldInstance[0].instance.showChange.pipe(takeUntil(this.destroy$)).subscribe(it => {
            //     this.changeFormFieldValue(this.formFieldInstance[0].instance['ngModelValue']);
            // });
            this.readyToUse = true;
            clearInterval(setContainerInterval);
        }, 100);

    }

    isRequiredField() {
        let res = false;
        if (!this.schema?.validator) res = false;
        if (this.schema?.validator && this.schema.validator.schema.find(i => i.name === 'required')) res = true;
        this.schema.__isRequired = res;
        return res;
    }

    async changeFormFieldValue(event) {
        // console.log('change value:', event);
        // =>check validators with value
        let widget = this.formFieldInstance[0].instance;
        this.schema.formFieldHasError = undefined;
        if (this.schema.validator) {
            let validatorRes: StrongFBCheckValidatorsResponse;
            // =>if widget is shown
            if (widget.show) {
                validatorRes = await this.schema.validator.checkValidators(event, this.widgetForm, widget.widgetHeader.widgetName);
            }
            // =>if hide widget
            else {
                validatorRes = {
                    isValid: true,
                };
            }
            let fieldName = widget.widgetHeader['_formFieldName'];
            let isDirty = true;
            // =>if field has field name
            if (widget.widgetHeader['_formFieldName']) {
                // =>check dirty value
                isDirty = widget.widgetForm.formFieldMeta(fieldName)?.is_dirty;
                // =>set meta data of field
                widget.widgetForm.setFormFieldMeta(fieldName, { is_valid: validatorRes.isValid });
                // =>set error of validation, if dirty
                if (isDirty) {
                    widget.widgetForm.setFormFieldMeta(fieldName, { error: validatorRes.error });
                }
            }
            // =>if value not dirty, ignore!
            if (!isDirty) {
                this.widgetForm['_formFieldValuesUpdated$'].next(true);
                return;
            }
            // =>if valid value
            if (validatorRes.isValid) {
                this.errorMessage = undefined;
                // =>set success status
                widget.schema['status'] = 'success';
            }
            // =>if invalid value
            else {
                this.formFieldError(validatorRes.name, event, validatorRes.error);
                // =>reset value in form field
                if (widget.widgetHeader['_formFieldName']) {
                    // =>if set new value
                    widget.widgetForm['_formFieldValues'][widget.widgetHeader['_formFieldName']] = validatorRes.newValue ? validatorRes.newValue : undefined;
                }

                if (!widget.schema) {
                    widget.schema = {};
                }
                // =>reset value of widget or set new value
                if (validatorRes.newValue) {
                    widget.schema['value'] = validatorRes.newValue;
                } else {
                    widget.schema['value'] = undefined;
                }
                // =>set danger status
                widget.schema['status'] = 'danger';

            }


        }
    }

    formFieldError(name: StrongFBValidatorName, value: any, error?: string) {
        this.schema.formFieldHasError = name;
        this.widgetHeader['_schema']['formFieldHasError'] = name;
        if (error && (name !== 'required' || value !== undefined)) {
            this.errorMessage = error;
        }
        // =>raise form field error
        if (this.schema.formFieldErrorCallback) {
            this.schema.formFieldErrorCallback.call(this.widgetForm, name, value, this.widgetHeader);
        }
    }
}
