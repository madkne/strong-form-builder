import { Component, ElementRef, Input, OnChanges, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { takeUntil } from 'rxjs';
import { StrongFBFormClass } from '../../common/StrongFB-base';
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
    @Input() form: StrongFBFormClass;

    @Input() layout: StrongFBLayoutBuilder;

    layoutSchema: StrongFBLayoutBuilderSchema;

    layoutLoaded = false;

    override async onInit() {
        if (!this.layout || this.layoutLoaded) return;
        this.layoutLoaded = true;
        this.layout['_update$'].pipe(takeUntil(this.destroy$)).subscribe(it => {
            if (!it) return;
            // console.log('layout:', this.layout);
            this.layoutSchema = this.layout.schema;
            // =>load widgets, if exist
            if ((this.layoutSchema.widgets && this.layoutSchema.widgets.length > 0) || (this.layoutSchema.widgetHeaders && this.layoutSchema.widgetHeaders.length > 0)) {
                this.loadWidgets();
            }
        })
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['layout'] && !this.layoutLoaded) {
            this.onInit();


        }
    }



    async loadWidgets() {
        if (!this.widgetsNeedToReload) return;
        this.widgetsNeedToReload = false;
        let setContainerInterval = setInterval(async () => {
            if (!this.WidgetsSection) return;
            await this.loadDynamicWidgets(this.WidgetsSection, { widgets: this.layoutSchema.widgets, widgetHeaders: this.layoutSchema.widgetHeaders }, this.form);

            clearInterval(setContainerInterval);
        }, 100);
        // this.viewContainerRef.createComponent()
    }


}
