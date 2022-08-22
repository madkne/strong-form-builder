import { StrongFBFormClass } from "./StrongFB-base";
import { StrongFBBaseWidgetHeader } from "./StrongFB-widget-header";
import { BehaviorSubject, interval, Subject, take, takeUntil } from 'rxjs';
import { AfterViewInit, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewContainerRef } from "@angular/core";
import { StrongFBLayoutBuilderSchema, StrongFBLayoutBuilderWidgetFunction } from "./StrongFB-layout-builder-types";
import { Block } from 'notiflix/build/notiflix-block-aio';
import { SFB_info } from "./StrongFB-common";
import { StrongFBHelper } from "../StrongFB-helpers";


@Component({
    selector: 'widget',
    template: '<div></div>'
})
export class StrongFBBaseWidget<SCHEMA extends object = object> implements AfterViewInit {
    protected _widgetId: string;
    protected showLoading = true;
    @Input() public widgetHeader: StrongFBBaseWidgetHeader<SCHEMA>;
    @Input() public widgetForm: StrongFBFormClass;
    protected destroy$ = new Subject<boolean>();
    protected viewInit$ = new BehaviorSubject<boolean>(false);
    protected displayComponentLoading = false;

    @Output() ngModelChange = new EventEmitter<any>();
    public schema: SCHEMA;
    public show = true;

    public readyToUse = false;

    protected emitAutoReadyToUse = true;

    /******************************************* */

    constructor(protected elRef: ElementRef) {
        this._widgetId = 'strong_fb_widget_' + new Date().getTime() + '_' + Math.ceil(Math.random() * 10000);
        // =>add loading
        // if (this.showLoading) {
        //     let componentLoading = setInterval(() => {
        //         if (this.viewInit$.getValue()) {
        //             clearInterval(componentLoading);
        //             return;
        //         }
        //         this.displayLoading(true);
        //         // console.log('loading on:', this.elRef.nativeElement)
        //         clearInterval(componentLoading);
        //     }, 1);
        // }
    }

    get widgetId() {
        return this._widgetId;
    }

    /**
     * instead of override this function, call 'onInit' function
     */
    ngOnInit(): void {
        if (this.emitAutoReadyToUse) {
            this.readyToUse = true;
        }
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        // =>listen on loading
        let widgetComponentLoading = setInterval(() => {
            if (!this.widgetHeader || !this.widgetHeader['_isLoading']) return;
            this.widgetHeader['_isLoading'].pipe(takeUntil(this.destroy$)).subscribe(it => {
                if (it === undefined) return;
                this.displayLoading(it);
            });
            clearInterval(widgetComponentLoading);
        }, 10);

        // =>execute every 1s
        interval(1000).pipe(takeUntil(this.destroy$)).subscribe(async () => {
            // =>if have show callback function
            if (this.widgetHeader && this.widgetHeader['_showCallback']) {
                this.show = await this.widgetHeader['_showCallback'].call(this.widgetForm, this.widgetHeader);
            }
        });


        this.onInit();
    }
    /******************************************* */
    protected displayLoading(is = true) {
        try {
            if (is) {
                if (!this.elRef || !this.elRef.nativeElement) return;
                this.displayComponentLoading = true;
                this.elRef.nativeElement.id = this._widgetId;
                if (!document.getElementById(this._widgetId)) return;
                Block.circle([this.elRef.nativeElement], '', {
                    backgroundColor: StrongFBHelper.notifyBackgroundColor(),
                    svgColor: StrongFBHelper.loadingTextColor()
                });
            } else {
                this.displayComponentLoading = false;
                if (!document.getElementById(this._widgetId)) return;
                Block.remove('#' + this._widgetId);
            }
        } catch (e) { }
    }
    /******************************************* */

    async onInit() {
        //TODO: fill by child
    }
    /******************************************* */
    /**
     * just for form fields
     * @param valueField 
     */
    listenOnFormFieldChange(valueField: keyof SCHEMA) {
        this.widgetForm['_formFieldValuesUpdated$'].pipe(takeUntil(this.destroy$)).subscribe(it => {
            if (!it) return;
            // =>set value by form field
            if (this.widgetHeader['_formFieldName']) {
                this.schema[valueField] = this.widgetForm['_formFieldValues'][this.widgetHeader['_formFieldName']];
            }
        })
    }
    /******************************************* */
    /**
    * just for form fields
    * @param valueField 
    */
    updateFormField(valueField: keyof SCHEMA) {
        // =>set value to form field
        if (this.widgetHeader['_formFieldName']) {
            this.widgetForm['_formFieldValues'][this.widgetHeader['_formFieldName']] = this.schema[valueField];
        }
        this.ngModelChange.emit(this.schema[valueField]);
        this.widgetForm['_formFieldValuesUpdated$'].next(true);
    }
    /******************************************* */

    // =>Called once, before the instance is destroyed.
    ngOnDestroy(): void {
        this.onDestroy();
        this.destroy$.next(true);
        this.destroy$.complete();
    }
    /******************************************* */
    onDestroy() {
        //TODO: fill by child
    }
    /******************************************* */
    async loadDynamicWidgets(container: ViewContainerRef, widgetsSchema: {
        widgets?: StrongFBLayoutBuilderWidgetFunction[];
        widgetHeaders?: StrongFBLayoutBuilderWidgetFunction<StrongFBBaseWidgetHeader[]>[];
    }, form?: StrongFBFormClass) {
        if (!form) form = this.widgetForm;
        let widgetComponents = [];
        container.clear();
        let widgetHeaders: StrongFBBaseWidgetHeader[] = [];
        // =>load all headers
        if (widgetsSchema.widgets) {
            for (const widgetFunction of widgetsSchema.widgets) {
                let widget = await widgetFunction.call(form) as StrongFBBaseWidgetHeader;
                // =>if has function name and no name property
                if (form[widgetFunction.name] && !widget['_name'] && widget['name']) {
                    widget.name(widgetFunction.name);
                }
                widgetHeaders.push(widget);
            }
        }
        if (widgetsSchema.widgetHeaders) {
            for (const widgetsFunction of widgetsSchema.widgetHeaders) {
                let widgets = await widgetsFunction.call(form) as StrongFBBaseWidgetHeader[];
                for (const widget of widgets) {
                    // =>if has function name and no name property
                    if (form[widgetsFunction.name] && !widget['_name'] && widget['name']) {
                        widget.name(widgetsFunction.name);
                    }
                    widgetHeaders.push(widget);
                }
            }
        }
        // =>iterate all widget headers
        for (const widget of widgetHeaders) {

            // SFB_info('loading widget:', widget.component, widgetFunction, form[widgetFunction.name])
            let component = container.createComponent(widget.component);
            widgetComponents.push(component);
            component.instance['widgetHeader'] = widget;
            component.instance['widgetForm'] = form;
            // =>if such widget exist in main form
            if (widget['_name']) {
                form['_usedWidgets'][widget['_name']] = widget;
                form['_usedWidgetComponents'][widget['_name']] = component;
            }
            // getting the component's HTML
            let widgetElement: HTMLElement = <HTMLElement>component.location.nativeElement;
            for (const key of Object.keys(widget['_commonStyles'])) {
                widgetElement.style[key] = widget['_commonStyles'][key];
            }

        }
        return { widgetComponents, widgetHeaders };
    }
    /******************************************* */
    /**
     * instead of override this function, call 'afterViewInit' function
     */
    ngAfterViewInit(): void {
        this.viewInit$.next(true);
        // =>remove loading
        // if (this.showLoading && this.displayComponentLoading) {
        //     console.log('after view init', this.elRef)
        //     this.displayLoading(false);
        //     // this.viewInit$.complete();
        // }
        // Block.remove([this.elRef.nativeElement]);
        this.afterViewInit();
    }


    afterViewInit() {

    }

}