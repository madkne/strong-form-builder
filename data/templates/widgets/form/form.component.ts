import { Component, Input, OnChanges, SimpleChanges } from '@angular/core';
import { StrongFBFormClass } from '../../common/StrongFB-base';
import { StrongFBLayoutBuilderSchema } from '../../common/StrongFB-layout-builder-types';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';

@Component({
    selector: 'strong-form-builder',
    templateUrl: './from.component.html',
    styleUrls: ['./from.component.scss']
})
export class StrongFBFormComponent extends StrongFBBaseWidget implements OnChanges {

    @Input() form: StrongFBFormClass;
    // @Input() initialData: object;

    // protected override  showLoading = false;

    formSchema: StrongFBLayoutBuilderSchema

    ngOnChanges(changes: SimpleChanges): void {
        if (changes['form'] && this.form) {
            // console.log('form layout:', this.form.layout.generateSchema());
            this.formSchema = this.form.layout.generateSchema();
            // this.form.layout.schema.
            // =>call onInit() of form
            if (!this.form['_callOnInit']) {
                this.form.onInit();
            }
        }
    }
}
