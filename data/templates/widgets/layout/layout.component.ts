import { ChangeDetectorRef, Component, ElementRef, EventEmitter, Input, OnChanges, Output, SimpleChanges, ViewChild, ViewContainerRef } from '@angular/core';
import { takeUntil } from 'rxjs';
import { StrongFBFormClass } from '../../common/StrongFB-base';
import { StrongFBLayoutBuilder } from '../../common/StrongFB-layout-builder';
import { StrongFBLayoutBuilderSchema } from '../../common/StrongFB-layout-builder-types';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { StrongFBBaseWidgetHeader } from '../../common/StrongFB-widget-header';
import { StrongFBLocaleService } from '../../services/StrongFB-locale.service';

@Component({
    selector: 'strong-layout-builder',
    templateUrl: './layout.component.html',
    styleUrls: ['./layout.component.scss']
})
export class StrongFBLayoutComponent extends StrongFBBaseWidget implements OnChanges {
    @ViewChild('WidgetsSection', { read: ViewContainerRef }) WidgetsSection: ViewContainerRef;
    widgetsNeedToReload = true;

    protected override prefixId = 'layout';

    @Output() layoutLoadedEvent = new EventEmitter<boolean>();

    protected dynamicWidgets: {
        widgetComponents: any[];
        widgetHeaders: StrongFBBaseWidgetHeader<object, string>[];
    };


    constructor(
        protected override elRef: ElementRef,
        protected locale: StrongFBLocaleService,
        protected override cdr: ChangeDetectorRef,) {
        super(elRef, cdr);
    }
    @Input() form: StrongFBFormClass;

    @Input() layout: StrongFBLayoutBuilder;

    layoutSchema: StrongFBLayoutBuilderSchema;

    layoutLoaded = false;

    protected updatingLayout = false;

    protected layoutsLoaded: { [k: string]: boolean } = {};

    override async onInit() {

        if (!this.layout || this.layoutLoaded) return;
        this.layoutLoaded = true;
        this.layout['_update$'].pipe(takeUntil(this.destroy$)).subscribe(it => {
            if (!it) return;
            this.updateLayout();
        });

        this.locale.languageChanged.pipe(takeUntil(this.destroy$)).subscribe(it => {
            if (!it) return;
            this.updateLayout();
        });


    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['layout'] && !this.layoutLoaded) {
            this.onInit();


        }
    }

    async updateLayout() {
        if (this.updatingLayout) return;
        this.updatingLayout = true;
        this.displayLoading();
        // console.log('layout:', this.layout);
        this.layoutSchema = this.layout.schema;
        // =>load widgets, if exist
        if ((this.layoutSchema.widgets && this.layoutSchema.widgets.length > 0) || (this.layoutSchema.widgetHeaders && this.layoutSchema.widgetHeaders.length > 0)) {
            await this.loadWidgets();
        }
        this.displayLoading(false);
        // =>if no any child layouts
        if (!this.layoutSchema.layouts || this.layoutSchema.layouts.length === 0) {
            this.layoutLoadedEvent.emit(true);
        }
        this.updatingLayout = false;
    }

    // async checkForShowWidgets() {
    //     for (const widget of this.dynamicWidgets.widgetHeaders) {
    //         if (widget)
    //     }
    // }



    async loadWidgets() {
        if (!this.widgetsNeedToReload) return true;
        this.widgetsNeedToReload = false;
        return new Promise((res) => {

            let setContainerInterval = setInterval(async () => {
                if (!this.WidgetsSection) return;
                this.dynamicWidgets = await this.loadDynamicWidgets(this.WidgetsSection, { widgets: this.layoutSchema.widgets, widgetHeaders: this.layoutSchema.widgetHeaders }, this.form);
                // =>wait to ready to use all widgets
                let readyToUseWidgets = setInterval(() => {
                    let loadAll = true;
                    for (const wid of this.dynamicWidgets.widgetComponents) {
                        if (!wid.instance['readyToUse']) {
                            loadAll = false;
                            break;
                        }
                    }
                    if (loadAll) {
                        clearInterval(readyToUseWidgets);
                        res(true);
                    }
                }, 1);
                clearInterval(setContainerInterval);
            }, 5);
        });


        // this.viewContainerRef.createComponent()
    }

    childLayoutLoaded(layoutId: string) {
        // console.log('layout loaded:', layoutId)
        this.layoutsLoaded[layoutId] = true;

        if (Object.keys(this.layoutsLoaded).length === this.layoutSchema.layouts.length && !this.updatingLayout) {
            this.layoutLoadedEvent.emit(true);
        }
    }

}
