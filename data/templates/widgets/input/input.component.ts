import { Component, Output, EventEmitter } from '@angular/core';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { InputSchema } from './input-interfaces';
import { syncSchema } from './convertor';

@Component({
    selector: 'input-widget',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss']
})
export class StrongFBInputWidgetComponent extends StrongFBBaseWidget<InputSchema> {

    override schema: InputSchema;
    @Output() ngModelChange = new EventEmitter<string | number>();


    override async onInit() {
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = this.normalizeSchema(this.schema);
        // =>sync schema with ui framework
        this.schema = syncSchema(this.schema);

        this.listenOnFormFieldChange('value');
    }

    normalizeSchema(schema: InputSchema) {
        if (!schema.size) schema.size = 'medium';
        if (!schema.shape) schema.shape = 'rectangle';
        if (!schema.status) schema.status = 'basic';
        if (schema.fullWidth === undefined) schema.fullWidth = true;
        if (!schema.type) schema.type = 'text';


        return schema;
    }

    changeValue(event) {
        // =>set value to form field
        if (this.widgetHeader['_formFieldName']) {
            this.widgetForm['_formFieldValues'][this.widgetHeader['_formFieldName']] = this.schema.value;
        }
        this.ngModelChange.emit(this.schema.value);
    }
}
