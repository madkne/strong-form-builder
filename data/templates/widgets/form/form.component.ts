import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { takeUntil } from 'rxjs';
import { StrongFBFormClass } from '../../common/StrongFB-base';
import { StrongFBLayoutBuilderSchema } from '../../common/StrongFB-layout-builder-types';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';

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

    formSchema: StrongFBLayoutBuilderSchema

    override async onInit() {
        if (!this.form) return;
        this.initStart = true;
        this.form.service.locale().languageChanged.pipe(takeUntil(this.destroy$)).subscribe(it => {
            if (!it) return;
            this.updateForm();
        });
    }

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['form'] && this.form) {
            // console.log('form layout:', this.form.layout.generateSchema());
            this.updateForm();
            if (!this.initStart) {
                this.ngOnInit();
            }
            // this.form.layout.schema.
            // =>call onInit() of form
            if (!this.form['_callOnInit']) {
                this.form.onInit();
            }
        }
    }

    updateForm() {
        this.formSchema = this.form.layout.generateSchema();
    }

    override onDestroy() {
        this.form['destroy$'].next(true);
        this.form['destroy$'].complete();
    }
}
