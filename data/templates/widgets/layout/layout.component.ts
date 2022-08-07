import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
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

    // protected override  showLoading = false;


    constructor(protected override elRef: ElementRef) {
        super(elRef);
    }
    @Input() form: StrongFBBase;

    @Input() layout: StrongFBLayoutBuilder;

    layoutSchema: StrongFBLayoutBuilderSchema;


    ngOnChanges(changes: SimpleChanges): void {
        if (changes['layout']) {
            // console.log('layout:', this.layout);
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
            await this.loadDynamicWidgets(this.WidgetsSection, this.layoutSchema.widgets, this.form);

            clearInterval(setContainerInterval);
        }, 100);
        // this.viewContainerRef.createComponent()
    }


}
