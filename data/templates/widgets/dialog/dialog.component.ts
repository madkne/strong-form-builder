import { Component, ElementRef, Input, EventEmitter, SimpleChanges, TemplateRef, ViewChild, Output } from '@angular/core';
import { NbDialogRef, NbDialogService } from '@nebular/theme';
import { interval, takeUntil } from 'rxjs';
import { StrongFBFormClass } from '../../common/StrongFB-base';
import { StrongFBDialogAction } from '../../common/StrongFB-interfaces';
import { StrongFBLayoutBuilder } from '../../common/StrongFB-layout-builder';
import { StrongFBLayoutBuilderSchema } from '../../common/StrongFB-layout-builder-types';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { StrongFBTransmitService } from '../../services/StrongFB-transmit.service';

@Component({
    selector: 'strong-dialog',
    templateUrl: './dialog.component.html',
    styleUrls: ['./dialog.component.scss']
})
export class StrongFBDialogComponent extends StrongFBBaseWidget {
    @ViewChild('dialog') dialogTemplateRef: TemplateRef<any>;



    @Input() title: string;
    @Input() description: string;
    @Input() html: string; // support html
    // @Input() schema: FormBuilderSchema[];
    @Input() actions: StrongFBDialogAction[] = [];
    // @Input() table: PopupTable;
    @Input() form: StrongFBFormClass;
    @Input() initialData: object;
    // @Input() waitForComponentResponse = false;

    // @Output() formValuesByAction = new EventEmitter<[string, object]>();
    // protected override  showLoading = false;
    protected _dialogRef: NbDialogRef<StrongFBDialogComponent>;

    constructor(protected override elRef: ElementRef, private dialogService: NbDialogService, private transmit: StrongFBTransmitService) {
        super(elRef);
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
    async normalizeActions() {
        if (!this.actions || !Array.isArray(this.actions)) return;
        for (const act of this.actions) {
            // =>if show function
            if (act.show) {
                act.__show = await act.show();
            } else {
                act.__show = true;
            }
            // =>if is cancel
            if (act.isCancel) {
                if (!act.text) act.text = 'cancel';
                act.status = 'danger';
                act.closable = true;
            }
        }

    }
    /***************************************** */
    async open(): Promise<NbDialogRef<StrongFBDialogComponent>> {
        return new Promise((res) => {

            let dialogLoading = setInterval(() => {
                if (!this.dialogTemplateRef) return;
                // =>normalize actions
                this.normalizeActions();
                // =>open dialog
                let ref = this.dialogService.open(this.dialogTemplateRef, {
                    context: {
                        title: this.title,
                        description: this.description,
                        html: this.html,
                        actions: this.actions,
                        form: this.form,
                        data: this.initialData,
                    }
                });
                this._dialogRef = ref;
                clearInterval(dialogLoading);
                res(ref);
            }, 20);
        });
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
    async runActionFunction(action: StrongFBDialogAction) {
        if (action.action) {
            const ret = await action.action.call(this.widgetForm, this.form.formFieldValues());
            if (ret) {
                this._dialogRef.close(this.form.formFieldValues());
            }
        }
        if (action.closable) {
            this._dialogRef.close(this.form.formFieldValues());
        }
    }



}