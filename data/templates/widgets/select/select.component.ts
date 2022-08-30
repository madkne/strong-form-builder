import { Component, Output, EventEmitter } from '@angular/core';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { SelectOption, SelectSchema } from './select-interfaces';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'select-widget',
    templateUrl: './select.component.html',
    styleUrls: ['./select.component.scss']
})
export class StrongFBSelectWidgetComponent extends StrongFBBaseWidget<SelectSchema> {

    options: SelectOption[] = [];
    @Output() override ngModelChange = new EventEmitter<string | string[]>();


    override schema: SelectSchema;
    override async onInit() {
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = await this.normalizeSchema(this.schema);
        // =>listen on update rows
        this.widgetHeader['_updateOptions$'].pipe(takeUntil(this.destroy$)).subscribe(it => {
            if (!it) return;
            // =>load options
            this.loadOptions();
        });
        this.listenOnFormFieldChange('value');

    }

    async loadOptions() {
        this.options = [];
        // =>load by callback function
        if (this.schema.loadOptions) {
            this.options = await this.schema.loadOptions.call(this.widgetForm, this.widgetHeader);
        }
        // =>load simple options
        else if (this.schema.options) {
            this.options = JSON.parse(JSON.stringify(this.schema.options));
        }
    }


    initSchema() {
        if (!this.widgetHeader) return;
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = this.normalizeSchema(this.schema);

    }

    normalizeSchema(schema: SelectSchema) {
        if (!schema.size) schema.size = 'medium';
        if (!schema.shape) schema.shape = 'rectangle';
        if (!schema.status) schema.status = 'basic';
        if (schema.fullWidth === undefined) schema.fullWidth = false;
        if (!schema.appearance) schema.appearance = 'filled';
        if (!schema.placeholder) schema.placeholder = '';
        // =>if selected items
        if (schema.value) {
            this.changeEvent(schema.value);
        }

        return schema;
    }


    changeEvent(event: string | string[]) {
        this.schema.value = event;
        this.updateFormField('value');

        if (!this.schema.change) return;
        this.schema.change.call(this.widgetForm, this.schema.value, this.widgetHeader);
    }
}
