import { Component, Output, EventEmitter } from '@angular/core';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { CheckBoxSchema, CheckOption } from './check-box-interfaces';

@Component({
    selector: 'check-box-widget',
    templateUrl: './check-box.component.html',
    styleUrls: ['./check-box.component.scss']
})
export class StrongFBCheckBoxWidgetComponent extends StrongFBBaseWidget<CheckBoxSchema> {
    // value: string;
    // values: string[] | string = [];

    override schema: CheckBoxSchema;
    @Output() override ngModelChange = new EventEmitter<string | number>();

    override async onInit() {
        this.initSchema();
    }

    initSchema() {
        if (!this.widgetHeader) return;
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = this.normalizeSchema(this.schema);
        this.listenOnFormFieldChange('value');
    }

    normalizeSchema(schema: CheckBoxSchema) {
        if (!schema.status) schema.status = 'primary';
        if (!schema.optionsDirection) schema.optionsDirection = 'column';
        if (!schema.options) schema.options = {
            text: '',
            value: '',
        };
        schema.mode = Array.isArray(schema.options) ? 'multi' : 'single';
        if (schema.value) {
            if (Array.isArray(schema.options)) {
                for (const item of schema.options) {
                    item._checked = schema.value.indexOf(item.value) > -1;
                }
            }
            else {
                schema.options._checked = schema.value === schema.options.value ? true : false;
            }
        }
        return schema;
    }

    changeEvent(item: CheckOption, event: boolean) {
        if (this.schema.mode === 'single') {
            if (event) {
                this.schema.value = item.value;
            }
            else {
                this.schema.value = undefined;
            }
        } else {
            if (!this.schema.value) this.schema.value = [];
            if (event) {
                (this.schema.value as any).push(item.value);
            } else {
                const index = this.schema.value.indexOf(item.value);
                if (index > -1)
                    (this.schema.value as any).splice(index, 1);
            }
        }
        this.updateFormField('value');
        if (!this.schema.change) return;
        this.schema.change.call(this.widgetForm, this.schema.value, event, this.widgetHeader);
    }
}
