import { Component, Input, OnChanges, SimpleChanges, ElementRef, ChangeDetectorRef } from '@angular/core';
import { takeUntil } from 'rxjs';
import { StrongFBFormClass } from '../../common/StrongFB-base';
import { checkAndDoByInterval } from '../../common/StrongFB-common';
import { StrongFBJsonFormSchema } from '../../common/StrongFB-interfaces';
import { StrongFBLayoutBuilderSchema } from '../../common/StrongFB-layout-builder-types';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { StrongFBTransmitService } from '../../services/StrongFB-transmit.service';
import { StrongFBService } from '../../services/StrongFB.service';
import { Block } from 'notiflix/build/notiflix-block-aio';
import { StrongFBHelper } from "../../StrongFB-helpers";


@Component({
    selector: 'strong-form-builder',
    templateUrl: './from.component.html',
    styleUrls: ['./from.component.scss']
})
export class StrongFBFormComponent extends StrongFBBaseWidget implements OnChanges {
    initStart = false;
    formUpdating = false;
    @Input() form: StrongFBFormClass;
    // @Input() jsonForm: StrongFBJsonFormSchema;
    // @Input() initialData: object;

    // protected override  showLoading = false;
    constructor(
        public override elRef: ElementRef,
        public override cdr: ChangeDetectorRef,
        public srv: StrongFBService,
        private transmit: StrongFBTransmitService,
    ) {
        super(elRef, cdr);
    }

    formSchema: StrongFBLayoutBuilderSchema

    override async onInit() {
        if (!this.form || this.formUpdating) return;
        this.formUpdating = true;
        this.form['formWidgetId'] = this._widgetId;
        this.form.service.locale().languageChanged.pipe(takeUntil(this.destroy$)).subscribe(it => {
            if (!it) return;
            this.updateForm();
        });

        // =>listen on form loading
        this.transmit.listen('form-loading_' + this._widgetId as any).pipe(takeUntil(this.destroy$)).subscribe(it => {
            if (!it) return;
            // =>if match form id
            // if (it['formId'] === this._widgetId) {
            this.showCustomLoading(it['is'] ?? true, it['type'] ?? 'circle', it['message']);
            // }
        });
        // =>call onInit() of form
        if (!this.form['_callOnInit']) {
            this.form['_callOnInit'] = true;
            await this.form.onInit();
        }
        checkAndDoByInterval(
            () => this.srv.configLoaded,
            () => {
                this.initStart = true;
                this.formUpdating = false;
            }, 1);


    }

    async ngOnChanges(changes: SimpleChanges) {
        // =>if set form
        if (changes['form'] && this.form) {
            this.form['formWidgetId'] = this._widgetId;
            // console.log('form layout:', this.form.layout.generateSchema());
            this.updateForm();
            if (!this.initStart) {
                this.ngOnInit();
            }
        }
        // =>if set json form
        // else if (changes['jsonForm'] && this.jsonForm) {
        //     // =>convert json to form class
        //     //TODO: this.jsonToFormClass()
        // }
    }

    updateForm() {
        this.formSchema = this.form.layout.schema;
    }

    override onDestroy() {
        if (!this.form) return;
        this.form['destroy$'].next(true);
        this.form['destroy$'].complete();
    }

    mainLayoutLoaded() {
        // =>call onLoaded() of form
        if (this.form.onLoaded) {
            this.form.onLoaded();
        }
    }


    /******************************************* */
    protected showCustomLoading(is = true, type: 'circle' | 'standard' = 'circle', message?: string) {
        try {
            if (is) {
                if (!document.getElementById('form_' + this._widgetId)) return;
                Block[type]([document.getElementById('form_' + this._widgetId)], message ?? '', {
                    backgroundColor: StrongFBHelper.notifyBackgroundColor(),
                    svgColor: StrongFBHelper.loadingTextColor(),
                    fontFamily: this.srv['_defaultFontFamily'],
                });
            } else {
                checkAndDoByInterval(
                    () => document.getElementById('form_' + this._widgetId) !== null,
                    () => {
                        Block.remove('#form_' + this._widgetId);
                    }, 5);
                // if (!document.getElementById(this._widgetId)) return;
            }
        } catch (e) { }
    }
}
