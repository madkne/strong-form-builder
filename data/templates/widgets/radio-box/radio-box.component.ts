import { Component, Output, SimpleChanges, EventEmitter } from '@angular/core';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { RadioBoxSchema } from './radio-box-interfaces';

@Component({
    selector: 'radio-box-widget',
    templateUrl: './radio-box.component.html',
    styleUrls: ['./radio-box.component.scss']
})
export class StrongFBRadioBoxWidgetComponent extends StrongFBBaseWidget<RadioBoxSchema> {

    override schema: RadioBoxSchema;
    @Output() override ngModelChange = new EventEmitter<string | number>();

    override async onInit() {
        this.initSchema();
    }

    // ngOnChanges(changes: SimpleChanges): void {
    //     if (changes['widgetHeader']) {
    //         this.initSchema();
    //     }

    // }

    initSchema() {
        if (!this.widgetHeader) return;
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = this.normalizeSchema(this.schema);

        this.listenOnFormFieldChange('value');

    }

    normalizeSchema(schema: RadioBoxSchema) {

        if (!schema.status) schema.status = 'primary';
        if (!schema.optionsDirection) schema.optionsDirection = 'column';
        if (!schema.options) schema.options = [];


        return schema;
    }


    changeEvent(event: MouseEvent) {
        this.updateFormField('value');

        if (!this.schema.change) return;
        this.schema.change.call(this.widgetForm, event, this.widgetHeader);
    }
}
