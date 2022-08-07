import { Component, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { StrongFBBase } from '../../common/StrongFB-base';
import { StrongFBLayoutBuilder } from '../../common/StrongFB-layout-builder';
import { StrongFBLayoutBuilderSchema } from '../../common/StrongFB-layout-builder-types';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';

@Component({
    selector: 'strong-layout-builder',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class StrongFBLayoutComponent extends StrongFBBaseWidget implements OnChanges {
    @ViewChild('WidgetsSection', { read: ViewContainerRef }) WidgetsSection: ViewContainerRef;
    widgetsNeedToReload = true;


    constructor(private viewContainerRef: ViewContainerRef) {
        super();
    }
    @Input() form: StrongFBBase;

    @Input() layout: StrongFBLayoutBuilder;

    layoutSchema: StrongFBLayoutBuilderSchema;


    ngOnChanges(changes: SimpleChanges): void {
        if (changes['layout']) {
            console.log('layout:', this.layout);
            this.layoutSchema = this.layout.schema;
            // =>load widgets, if exist
            if (this.layoutSchema.widgets && this.layoutSchema.widgets.length > 0) {
                this.loadWidgets();
            }
        }
    }

    async loadWidgets() {
        if (!this.widgetsNeedToReload) return;
        this.widgetsNeedToReload = false;
        let setContainerInterval = setInterval(async () => {
            if (!this.WidgetsSection) return;
            this.WidgetsSection.clear();
            for (const widgetFunction of this.layoutSchema.widgets) {
                let widget = await widgetFunction.call(this.form);
                console.log('loading widget:', widget.component)
                let component = this.WidgetsSection.createComponent(widget.component);
                component.instance['widgetHeader'] = widget;
            }


            clearInterval(setContainerInterval);
        }, 100);
        // this.viewContainerRef.createComponent()
    }


}
