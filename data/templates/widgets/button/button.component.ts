import { Component, SimpleChanges } from '@angular/core';
import { delay, takeUntil } from 'rxjs';
import { FormFieldMetaData } from '../../common/StrongFB-interfaces';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { StrongFBBaseWidgetHeader } from '../../common/StrongFB-widget-header';
import { ButtonSchema } from './button-interfaces';

@Component({
    selector: 'button-widget',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class StrongFBButtonWidgetComponent extends StrongFBBaseWidget<ButtonSchema> {

    override schema: ButtonSchema;
    override async onInit() {
        this.initSchema();
    }

    ngOnChanges(changes: SimpleChanges): void {
        // if (changes['widgetHeader']) {
        //     this.initSchema();
        // }

    }

    initSchema() {
        if (!this.widgetHeader) return;
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = this.normalizeSchema(this.schema);
        // =>if disabled for form fields
        if (this.schema.disabledForFormFields) {
            this.scanFormFields();
            // =>listen on every form fields changed
            this.widgetForm['_formFieldValuesUpdated$'].pipe(takeUntil(this.destroy$)).pipe(delay(100)).subscribe(it => {
                this.scanFormFields();
            });
        }

    }

    async scanFormFields() {
        this.schema.disabled = true;

        // =>get all need form fields
        let fieldsWithMeta: FormFieldMetaData[] = [];
        let allFormFields = this.widgetForm.formFieldValuesWithMeta();

        let isValidAllFields = true;
        // =>iterate all widgets
        for (const field of allFormFields) {

            // =>if select all fields or match fields
            if (this.schema.disabledForFormFields[0] === '*' || this.schema.disabledForFormFields.includes(field.name)) {
                fieldsWithMeta.push(field);
                // =>check all fields to valid
                if (field.is_show !== false && field.is_valid === false) {
                    isValidAllFields = false;
                    break;
                }
            }
        }

        // =>enable button
        if (isValidAllFields) {
            this.schema.disabled = false;
        }
    }



    normalizeSchema(schema: ButtonSchema) {
        if (!schema.size) schema.size = 'medium';
        if (!schema.shape) schema.shape = 'rectangle';
        if (!schema.status) schema.status = 'basic';
        if (schema.fullWidth === undefined) schema.fullWidth = false;
        if (!schema.appearance) schema.appearance = 'fill';
        if (!schema.mode) schema.mode = 'text';


        return schema;
    }


    clickEvent(event: MouseEvent) {
        if (!this.schema.click) return;
        this.schema.click.call(this.widgetForm, event, this.widgetHeader);
    }
}
