import { Component, SimpleChanges } from '@angular/core';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
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
        if (changes['widgetHeader']) {
            this.initSchema();
        }

    }

    initSchema() {
        if (!this.widgetHeader) return;
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = this.normalizeSchema(this.schema);

    }

    normalizeSchema(schema: ButtonSchema) {
        if (!schema.size) schema.size = 'medium';
        if (!schema.shape) schema.shape = 'rectangle';
        if (!schema.status) schema.status = 'default';
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
