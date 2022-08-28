import { Component, ViewChild, ViewContainerRef } from '@angular/core';
import { takeUntil } from 'rxjs';
import { SFB_error } from '../../common/StrongFB-common';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { ComponentSchema } from './component-interfaces';

@Component({
    selector: 'component-widget',
    templateUrl: './component.component.html',
    styleUrls: ['./component.component.scss']
})
export class StrongFBComponentWidgetComponent extends StrongFBBaseWidget<ComponentSchema> {

    @ViewChild('componentRef', { read: ViewContainerRef }) componentRef: ViewContainerRef;
    // override schema: ComponentSchema;
    protected override emitAutoReadyToUse = false;

    override async onInit() {
        if (!this.widgetHeader) return;
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = this.normalizeSchema(this.schema);

    }


    normalizeSchema(schema: ComponentSchema) {

        if (!schema.events) schema.events = [];
        if (!schema.inputs) schema.inputs = [];
        if (!schema.component) {
            SFB_error('can not set component class');
            schema = undefined;
        }

        return schema;
    }

    override afterViewInit() {
        if (!this.schema) return;
        let ref = setInterval(() => {
            if (!this.componentRef) return;
            // =>load dynamic component
            let component = this.componentRef.createComponent(this.schema.component);
            // =>set inputs
            for (const input of this.schema.inputs) {
                component.instance[input.name] = input.value;
            }
            // =>listen on events
            for (const event of this.schema.events) {
                component.instance[event.name].pipe(takeUntil(this.destroy$)).subscribe(value => {
                    event.callback.call(this.widgetForm, value, this.widgetHeader);
                });
            }

            this.readyToUse = true;
            clearInterval(ref);
        }, 5);
    }

}
