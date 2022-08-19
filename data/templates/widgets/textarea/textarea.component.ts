import { Component, Output, EventEmitter } from '@angular/core';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { TextAreaSchema } from './textarea-interfaces';

@Component({
    selector: 'textarea-widget',
    templateUrl: './textarea.component.html',
    styleUrls: ['./textarea.component.scss']
})
export class StrongFBTextAreaWidgetComponent extends StrongFBBaseWidget<TextAreaSchema> {

    override schema: TextAreaSchema;
    @Output() override ngModelChange = new EventEmitter<string>();


    override async onInit() {
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = this.normalizeSchema(this.schema);

        this.listenOnFormFieldChange('value');
    }

    normalizeSchema(schema: TextAreaSchema) {
        if (!schema.size) schema.size = 'medium';
        if (!schema.shape) schema.shape = 'rectangle';
        if (!schema.status) schema.status = 'basic';
        if (schema.fullWidth === undefined) schema.fullWidth = true;
        if (!schema.rows) schema.rows = 4;
        if (!schema.cols) schema.cols = 100;
        if (!schema.maxWidth) schema.maxWidth = '100%';
        if (!schema.maxHeight) schema.maxHeight = '300px';


        return schema;
    }

    changeValue(event) {
        this.updateFormField('value');
    }
}
