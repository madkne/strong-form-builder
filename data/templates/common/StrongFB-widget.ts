import { StrongFBFormClass } from "./StrongFB-base";
import { StrongFBBaseWidgetHeader } from "./StrongFB-widget-header";
import { BehaviorSubject, interval, Subject, take, takeUntil } from 'rxjs';
import { AfterViewInit, ChangeDetectorRef, Component, ElementRef, EventEmitter, Inject, Input, OnChanges, OnDestroy, Output, SimpleChanges, ViewContainerRef } from "@angular/core";
import { StrongFBLayoutBuilderSchema, StrongFBLayoutBuilderWidgetFunction } from "./StrongFB-layout-builder-types";
import { Block } from 'notiflix/build/notiflix-block-aio';
import { checkAndDoByInterval, SFB_info, SFB_warn } from "./StrongFB-common";
import { StrongFBHelper } from "../StrongFB-helpers";
import { StrongFBHttpService } from "../services/StrongFB-http.service";
import { APIRequest, FormFieldMetaData, StrongFBJsonApiRequestSchema } from "./StrongFB-interfaces";


@Component({
    selector: 'widget',
    template: '<div></div>'
})
export class StrongFBBaseWidget<SCHEMA extends object = { [k: string]: any }> implements AfterViewInit {
    protected _widgetId: string;
    protected showLoading = true;
    @Input() public widgetHeader: StrongFBBaseWidgetHeader<SCHEMA>;
    @Input() public widgetForm: StrongFBFormClass;
    protected destroy$ = new Subject<boolean>();
    protected viewInit$ = new BehaviorSubject<boolean>(false);
    protected displayComponentLoading = false;
    protected ngModelValue: any;
    protected prefixId = 'unknown';

    @Output() ngModelChange = new EventEmitter<any>();
    @Output() showChange = new EventEmitter<boolean>();

    public schema: SCHEMA;
    public show = true;
    public readyToUse = false;
    public valueChanges$ = new BehaviorSubject<[boolean, any]>([false, undefined]);

    protected emitAutoReadyToUse = true;

    /******************************************* */

    constructor(protected elRef: ElementRef, protected cdr: ChangeDetectorRef) {


    }

    get widgetId() {
        this._generateWidgetId();
        return this._widgetId;
    }
    private _generateWidgetId() {
        if (this._widgetId) return;
        this._widgetId = `strong_fb_${this.prefixId}_widget_` + new Date().getTime() + '_' + Math.ceil(Math.random() * 10000);
        this.cdr.detectChanges();
    }
    /**
     * instead of override this function, call 'onInit' function
     */
    ngOnInit(): void {
        this._generateWidgetId();
        if (this.emitAutoReadyToUse) {
            this.readyToUse = true;
        }

        // =>listen on loading
        let widgetComponentLoading = setInterval(() => {
            if (!this.widgetHeader || !this.widgetHeader['_isLoading']) return;
            this.widgetHeader['_isLoading'].pipe(takeUntil(this.destroy$)).subscribe(it => {
                if (it === undefined) return;
                this.displayLoading(it);
            });
            clearInterval(widgetComponentLoading);
        }, 10);

        // =>execute every 500ms
        interval(500).pipe(takeUntil(this.destroy$)).subscribe(async () => {
            // =>if have show callback function
            try {
                if (this.widgetForm && this.widgetHeader && this.widgetHeader['_showCallback']) {
                    let beforeStateShow = this.show;
                    this.show = await this.widgetHeader['_showCallback'].call(this.widgetForm, this.widgetHeader);
                    if (beforeStateShow !== this.show) {
                        // =>set show state
                        this.widgetForm.setFormFieldMeta(this.widgetHeader['_formFieldName'], { is_show: this.show });
                        // =>emit show change event
                        this.showChange.emit(this.show);
                        // =>if show enabled, call onShow method
                        if (this.show) {
                            this.onShow();
                        }
                    }
                }
            } catch (e) {
                SFB_warn('invalid show callback', e);
            }
        });


        this.onInit();
    }
    /******************************************* */
    async onShow() {
        //TODO: fill by child
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
                checkAndDoByInterval(
                    () => document.getElementById(this._widgetId) !== null,
                    () => {
                        Block.remove('#' + this._widgetId);
                    }, 5);
                // if (!document.getElementById(this._widgetId)) return;
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
        /** on startup */
        // =>emit ng model change
        this.ngModelValue = this.schema[valueField];
        this.ngModelChange.emit(this.ngModelValue);
        // =>update form field
        if (this.widgetForm) {
            this.widgetForm['_formFieldValuesUpdated$'].next(true);
            // =>listen on form field update
            this.widgetForm['_formFieldValuesUpdated$'].pipe(takeUntil(this.destroy$)).subscribe(it => {
                if (!it) return;
                // =>set value by form field
                if (this.widgetHeader['_formFieldName'] && this.widgetForm['_formFieldValues'][this.widgetHeader['_formFieldName']] !== undefined) {
                    this.schema[valueField] = this.widgetForm['_formFieldValues'][this.widgetHeader['_formFieldName']];
                }
            });
            if (this.ngModelValue) {
                this.updateFormField(valueField);
            }
        }
    }
    /******************************************* */
    /**
    * just for form fields
    * @param valueField 
    */
    updateFormField(valueField: keyof SCHEMA) {
        if (this.widgetForm) {
            // =>set value to form field
            if (this.widgetHeader['_formFieldName']) {
                this.widgetForm['_formFieldValues'][this.widgetHeader['_formFieldName']] = this.schema[valueField];
            }
            this.ngModelValue = this.schema[valueField];
            this.makeDirtyField();
            this.ngModelChange.emit(this.schema[valueField]);
            this.widgetForm['_formFieldValuesUpdated$'].next(true);
        }
    }
    /******************************************* */
    /**
     * just used for form fields
     */
    makeDirtyField() {
        if (this.widgetForm && this.widgetHeader['_formFieldName']) {
            // => if before not dirty
            let beforeDirty = this.widgetForm.formFieldMeta(this.widgetHeader['_formFieldName'])?.is_dirty;
            this.widgetForm.setFormFieldMeta(this.widgetHeader['_formFieldName'], {
                is_dirty: true,
                is_show: this.show,
            });
            // =>if before not dirty, run validator
            if (beforeDirty !== true) {
                this.ngModelChange.emit(this.ngModelValue);
            }
        }
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
                if (!widget) {
                    SFB_warn(`can not find widget instance from '${widgetFunction.name}' function`)
                    continue;
                }
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
    /******************************************* */
    afterViewInit() {
        //TODO: fill by child
    }
    /******************************************* */
    async getFormFieldsByNames(names = ['*']) {
        // =>get all need form fields
        let fieldsWithMeta: FormFieldMetaData[] = [];
        let allFormFields = this.widgetForm.formFieldValuesWithMeta();

        let isValidAllFields = true;
        if (!names || names.length === 0) names = ['*'];
        // =>iterate all widgets
        for (const field of allFormFields) {
            // =>if select all fields or match fields
            if (names[0] === '*' || names.includes(field.name)) {
                // =>check all fields to valid
                if (field.is_show !== false && field.is_valid === false) {
                    isValidAllFields = false;
                    continue;
                }
                fieldsWithMeta.push(field);
            }
        }

        return { fieldsWithMeta, isValidAllFields };
    }
    /******************************************* */
    async sendRequestByJsonApi(http: StrongFBHttpService, jsonApiSchema: StrongFBJsonApiRequestSchema) {
        let data: APIRequest = {
            method: jsonApiSchema.method,
            path: jsonApiSchema.path,
            body: jsonApiSchema.body,
            params: jsonApiSchema.params as any,
            headers: jsonApiSchema.headers as any,
        };
        // =>if set url
        if (this.widgetForm['_options']?.baseAPIUrl) {
            data.baseUrl = this.widgetForm['_options']?.baseAPIUrl;
        }
        // =>iterate actions
        if (jsonApiSchema._actions) {
            for (const action of jsonApiSchema._actions) {
                if (action.name === 'append_form_fields_to_body') {
                    if (!data.body) data.body = {};
                    let needFormFields = await this.getFormFieldsByNames(action.value);
                    for (const field of needFormFields.fieldsWithMeta) {
                        data.body[field.name] = field.value;
                    }
                }
            }
        }
        // =>send request
        let res = await http.sendPromise(data);

    }

}