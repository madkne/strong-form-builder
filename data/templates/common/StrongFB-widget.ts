import { StrongFBBase } from "./StrongFB-base";
import { StrongFBBaseWidgetHeader } from "./StrongFB-widget-header";
import { BehaviorSubject, Subject, take } from 'rxjs';
import { AfterViewInit, Component, ElementRef, Inject, Input, OnChanges, OnDestroy, SimpleChanges, ViewContainerRef } from "@angular/core";
import { StrongFBLayoutBuilderWidgetFunction } from "./StrongFB-layout-builder-types";
import { Block } from 'notiflix/build/notiflix-block-aio';
import { SFB_info } from "./StrongFB-common";


@Component({
    selector: 'widget',
    template: '<div></div>'
})
export class StrongFBBaseWidget<SCHEMA extends object = object> implements AfterViewInit {
    protected widgetId: string;
    protected showLoading = true;
    @Input() public widgetHeader: StrongFBBaseWidgetHeader<SCHEMA>;
    @Input() public widgetForm: StrongFBBase;
    protected destroy$ = new Subject<boolean>();
    protected viewInit$ = new BehaviorSubject<boolean>(false);
    protected displayComponentLoading = false;

    /******************************************* */

    constructor(protected elRef: ElementRef) {
        this.widgetId = 'string_fb_widget_' + new Date().getTime() + '_' + Math.ceil(Math.random() * 10000);
        // =>add loading
        if (this.showLoading) {
            let componentLoading = setInterval(() => {
                if (this.viewInit$.getValue()) {
                    clearInterval(componentLoading);
                    return;
                }
                if (!this.elRef) return;
                this.displayComponentLoading = true;
                this.elRef.nativeElement.id = this.widgetId;
                Block.dots([this.elRef.nativeElement]);
                console.log('loading on:', this.elRef.nativeElement)
                clearInterval(componentLoading);
            }, 1);
        }
    }

    /**
     * instead of override this function, call 'onInit' function
     */
    ngOnInit(): void {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.



        this.onInit();
    }
    /******************************************* */

    async onInit() {

    }
    /******************************************* */

    // =>Called once, before the instance is destroyed.
    ngOnDestroy(): void {
        this.destroy$.next(true);
        this.destroy$.complete();
    }
    /******************************************* */
    async loadDynamicWidgets(container: ViewContainerRef, widgets?: StrongFBLayoutBuilderWidgetFunction[], form?: StrongFBBase) {
        if (!form) form = this.widgetForm;
        let widgetComponents = [];
        container.clear();
        for (const widgetFunction of widgets) {
            let widget = await widgetFunction.call(form);
            // SFB_info('loading widget:', widget.component, widgetFunction, form[widgetFunction.name])
            let component = container.createComponent(widget.component);
            component.instance['widgetHeader'] = widget;
            component.instance['widgetForm'] = form;
            // =>if such widget exist in main form
            if (form[widgetFunction.name]) {
                form['_usedWidgets'][widgetFunction.name] = widget;
                form['_usedWidgetComponents'][widgetFunction.name] = component;
            }
        }
        return widgetComponents;
    }
    /******************************************* */
    /**
     * instead of override this function, call 'afterViewInit' function
     */
    ngAfterViewInit(): void {
        this.viewInit$.next(true);
        // =>remove loading
        if (this.showLoading && this.displayComponentLoading) {
            console.log('after view init', this.elRef)
            //Called after ngAfterContentInit when the component's view has been initialized. Applies to components only.
            Block.remove('#' + this.widgetId);
            // this.viewInit$.complete();
        }
        // Block.remove([this.elRef.nativeElement]);
        this.afterViewInit();
    }


    afterViewInit() {

    }

}