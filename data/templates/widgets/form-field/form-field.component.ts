import { AfterViewInit, Component, ViewChild, ViewContainerRef } from '@angular/core';
import { SFB_warn } from '../../common/StrongFB-common';
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



    override async onInit() {
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = await this.normalizeSchema(this.schema);

    }

    async normalizeSchema(schema: FormFieldSchema) {
        if (!schema.status) schema.status = 'default';
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

    override afterViewInit(): void {

        let setContainerInterval = setInterval(() => {
            if (!this.FieldContainer) return;
            this.FieldContainer.clear();
            this.loadDynamicWidgets(this.FieldContainer, [() => this.schema.field]);
            this.fieldIsLoaded = true;
            clearInterval(setContainerInterval);
        }, 100);

    }
}
