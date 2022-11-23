import { Component, ElementRef, Input, EventEmitter, SimpleChanges, TemplateRef, ViewChild, Output, ChangeDetectorRef, Inject } from '@angular/core';
import { interval, takeUntil } from 'rxjs';
import { StrongFBFormClass } from '../../common/StrongFB-base';
import { StrongFBDialogAction } from '../../common/StrongFB-interfaces';
import { StrongFBLayoutBuilder } from '../../common/StrongFB-layout-builder';
import { StrongFBLayoutBuilderSchema } from '../../common/StrongFB-layout-builder-types';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { StrongFBLocaleService } from '../../services/StrongFB-locale.service';
import { StrongFBTransmitService } from '../../services/StrongFB-transmit.service';
import { MatDialogRef, MAT_DIALOG_DATA, MatDialog } from '@angular/material/dialog';
import { StrongFBService } from '../../services/StrongFB.service';


@Component({
    selector: 'strong-dialog',
    template: `<div></div>`
})
export class StrongFBDialogWidgetComponent extends StrongFBBaseWidget {
    // @ViewChild('dialog') dialogTemplateRef: TemplateRef<any>;



    @Input() title: string;
    @Input() description: string;
    @Input() html: string; // support html
    @Input() actions: StrongFBDialogAction[] = [];
    // @Input() table: PopupTable;
    @Input() form: StrongFBFormClass;
    @Input() initialData: object;
    // @Input() waitForComponentResponse = false;

    // @Output() formValuesByAction = new EventEmitter<[string, object]>();
    // protected override  showLoading = false;
    protected _dialogRef: MatDialogRef<StrongFBDialogWidgetRefComponent>;

    constructor(
        protected override elRef: ElementRef,
        private dialogService: MatDialog,
        private transmit: StrongFBTransmitService,
        private locale: StrongFBLocaleService,
        protected override cdr: ChangeDetectorRef,
        private strongfb: StrongFBService,
    ) {
        super(elRef, cdr);
    }

    layoutSchema: StrongFBLayoutBuilderSchema;

    layoutLoaded = false;

    override async onInit() {

        // =>listen on component response channel
        // this.transmit.listen('dialog-response').pipe(takeUntil(this.destroy$)).subscribe(it => {
        //     if (!it) return;
        //     // =>check for refId
        //     // if (it.refId !== this.refId) return;
        //     // // =>set schemaChangesJson
        //     // this.dataValues = it.values;
        //     // =>run action
        //     this.runActionFunction(it.action);
        // });
        // =>update every 1s
        interval(1000).pipe(takeUntil(this.destroy$)).subscribe(() => {
            this.normalizeActions();
        });
    }


    /***************************************** */
    protected async normalizeActions() {
        if (!this.actions || !Array.isArray(this.actions)) return;
        for (const act of this.actions) {
            // =>if show function
            if (act.show) {
                act.__show = await act.show();
            } else {
                act.__show = true;
            }
            if (!act.status) {
                act.status = 'primary';
            }
            // =>if is cancel
            if (act.isCancel) {
                if (!act.text) act.text = this.locale.trans('common', 'cancel');
                act.status = 'danger';
                act.closable = true;
            }
            // =>normalize status 
            if (act.status == 'basic') act.status = undefined;
            if (act.status == 'info') act.status = 'primary';
            if (act.status == 'danger' || act.status == 'warning') act.status = 'warn' as any;
            if (act.status == 'success') act.status = 'accent' as any;

        }


    }
    /***************************************** */
    async open(): Promise<MatDialogRef<StrongFBDialogWidgetRefComponent>> {
        return new Promise(async (res) => {

            // =>normalize actions
            this.normalizeActions();
            // =>open dialog
            let ref = this.dialogService.open(StrongFBDialogWidgetRefComponent, {
                data: {
                    form: this.form,
                    initialData: this.initialData,
                    actions: this.actions,
                    html: this.html,
                    description: this.description,
                    title: this.title,
                }
            });
            this._dialogRef = ref;
            res(ref);
        });
    }
}


@Component({
    selector: 'dialog-xxxxx-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class StrongFBDialogWidgetRefComponent extends StrongFBBaseWidget {
    constructor(
        protected override elRef: ElementRef,
        public locale: StrongFBLocaleService,
        public dialogRef: MatDialogRef<StrongFBDialogWidgetRefComponent>,
        protected override cdr: ChangeDetectorRef,
        @Inject(MAT_DIALOG_DATA) public data: {
            form: StrongFBFormClass;
            initialData: object;
            html?: string;
            description?: string;
            title?: string;
            actions?: StrongFBDialogAction[];
        },
    ) {
        super(elRef, cdr);
    }

    /***************************************** */
    async runAction(action: StrongFBDialogAction) {
        // =>if has component, send signal
        // if (this.componentClass) {
        //     this.transmit.emit('dialog-action-click', { action: action, refId: this.refId, });
        //     if (this.waitForComponentResponse) {
        //         return;
        //     }
        // }
        await this.runActionFunction(action);
    }
    /***************************************** */
    protected async runActionFunction(action: StrongFBDialogAction) {
        if (action.action) {
            const ret = await action.action.call(this.widgetForm, this.data.form.formFieldValues());
            if (ret) {
                this.dialogRef.close(this.data.form.formFieldValues());
            }
        }
        if (action.closable) {
            this.dialogRef.close(this.data.form.formFieldValues());
        }
    }
}