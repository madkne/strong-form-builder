import { Component, Output, EventEmitter } from '@angular/core';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { ToggleSchema } from './toggle-interfaces';
@Component({
    selector: 'toggle-widget',
    templateUrl: './toggle.component.html',
    styleUrls: ['./toggle.component.scss']
})
export class StrongFBToggleWidgetComponent extends StrongFBBaseWidget<ToggleSchema> {

    override schema: ToggleSchema;
    @Output() override ngModelChange = new EventEmitter<boolean>();


    override async onInit() {
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = this.normalizeSchema(this.schema);

        this.listenOnFormFieldChange('value');
    }

    normalizeSchema(schema: ToggleSchema) {
        if (!schema.status) schema.status = 'basic';
        if (!schema.labelPosition) schema.labelPosition = 'left';
        if (!schema.checked) schema.checked = false;

        return schema;
    }

    changeValue(event) {
        this.updateFormField('value');
    }
}
