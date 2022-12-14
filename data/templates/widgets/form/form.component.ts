import { Component, Input, OnChanges, SimpleChanges, ElementRef, ChangeDetectorRef } from '@angular/core';
import { takeUntil } from 'rxjs';
import { StrongFBFormClass } from '../../common/StrongFB-base';
import { checkAndDoByInterval } from '../../common/StrongFB-common';
import { StrongFBLayoutBuilderSchema } from '../../common/StrongFB-layout-builder-types';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { StrongFBService } from '../../services/StrongFB.service';

@Component({
    selector: 'strong-form-builder',
    templateUrl: './from.component.html',
    styleUrls: ['./from.component.scss']
})
export class StrongFBFormComponent extends StrongFBBaseWidget implements OnChanges {
    initStart = false;
    @Input() form: StrongFBFormClass;
    // @Input() initialData: object;

    // protected override  showLoading = false;
    constructor(
        public override elRef: ElementRef,
        public override cdr: ChangeDetectorRef,
        public srv: StrongFBService
    ) {
        super(elRef, cdr);
    }

    formSchema: StrongFBLayoutBuilderSchema

    override async onInit() {
        if (!this.form) return;
        // =>call onInit() of form
        if (!this.form['_callOnInit']) {
            this.form['_callOnInit'] = true;
            await this.form.onInit();
        }
        checkAndDoByInterval(
            () => this.srv.configLoaded,
            () => {
                this.initStart = true;
            }, 1);

        this.form.service.locale().languageChanged.pipe(takeUntil(this.destroy$)).subscribe(it => {
            if (!it) return;
            this.updateForm();
        });
    }

    async ngOnChanges(changes: SimpleChanges) {
        if (changes['form'] && this.form) {

            // console.log('form layout:', this.form.layout.generateSchema());
            this.updateForm();
            if (!this.initStart) {
                this.ngOnInit();
            }

        }
    }

    updateForm() {
        this.formSchema = this.form.layout.generateSchema();
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
}
