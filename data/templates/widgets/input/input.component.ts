import { Component, Output, EventEmitter } from '@angular/core';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { InputSchema } from './input-interfaces';
import { syncSchema } from './convertor';
import { takeUntil } from 'rxjs';

@Component({
    selector: 'input-widget',
    templateUrl: './input.component.html',
    styleUrls: ['./input.component.scss']
})
export class StrongFBInputWidgetComponent extends StrongFBBaseWidget<InputSchema> {

    override schema: InputSchema;
    @Output() override ngModelChange = new EventEmitter<string | number>();


    override async onInit() {
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = this.normalizeSchema(this.schema);
        // =>sync schema with ui framework
        this.schema = syncSchema(this.schema);

        this.listenOnFormFieldChange('value');
        // =>listen on value change
        this.valueChanges$.pipe(takeUntil(this.destroy$)).subscribe(async (it: [boolean, any]) => {
            if (!it || !it[0]) return;
            this.schema.value = it[1];
            if (it[1] === undefined || it[1] === null) {
                this.changeValue();
            }
        });
    }

    normalizeSchema(schema: InputSchema) {
        if (!schema.size) schema.size = 'medium';
        if (!schema.shape) schema.shape = 'rectangle';
        if (!schema.status) schema.status = 'basic';
        if (schema.fullWidth === undefined) schema.fullWidth = true;
        if (!schema.type) schema.type = 'text';


        return schema;
    }

    changeValue(event?) {
        this.updateFormField('value');
    }

    keyupEvent(event: KeyboardEvent) {
        if (!this.schema.keyEvents) return;
        // console.log('key event:', event);
        for (const key of this.schema.keyEvents) {
            if (key.keyType !== 'keyup' || key.keyNumber !== event.keyCode || !key.callback) continue;

            key.callback.call(this.widgetForm, event, this.widgetHeader);
            break;
        }
    }

    suffixButtonClick(e) {
        if (!this.schema?._form?.suffixButton?.schema['click']) return;
        this.schema?._form?.suffixButton?.schema['click'].call(this.widgetForm, e, this.schema?._form?.suffixButton);
    }
}
