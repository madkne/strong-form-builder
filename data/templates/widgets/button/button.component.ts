import { ChangeDetectorRef, Component, ElementRef, Input, SimpleChanges } from '@angular/core';
import { delay, takeUntil } from 'rxjs';
import { FormFieldMetaData } from '../../common/StrongFB-interfaces';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { StrongFBBaseWidgetHeader } from '../../common/StrongFB-widget-header';
import { StrongFBHttpService } from '../../services/StrongFB-http.service';
import { ButtonSchema } from './button-interfaces';
import { extraNormalizeSchema } from './convertor';

@Component({
    selector: 'button-widget',
    templateUrl: './button.component.html',
    styleUrls: ['./button.component.scss']
})
export class StrongFBButtonWidgetComponent extends StrongFBBaseWidget<ButtonSchema> {

    @Input() override schema: ButtonSchema;

    constructor(public elRef: ElementRef<any>, public cdr: ChangeDetectorRef, public http: StrongFBHttpService) {
        super(elRef, cdr);
    }

    override async onInit() {
        this.initSchema();
    }

    ngOnChanges(changes: SimpleChanges): void {
        // if (changes['widgetHeader']) {
        //     this.initSchema();
        // }

    }

    initSchema() {
        if (this.widgetHeader) {
            this.schema = this.widgetHeader.schema;
        } else if (!this.schema) {
            this.schema = {};
        }
        // =>normalize schema
        this.schema = this.normalizeSchema(this.schema);
        // =>if disabled for form fields
        if (this.schema.disabledForFormFields) {
            this.scanFormFields();
            // =>listen on every form fields changed
            this.widgetForm['_formFieldValuesUpdated$'].pipe(takeUntil(this.destroy$)).pipe(delay(100)).subscribe(it => {
                this.scanFormFields();
            });
        }

    }

    async scanFormFields() {
        this.schema.disabled = true;
        let needFormFields = await this.getFormFieldsByNames(this.schema.disabledForFormFields);
        let isValidAllFields = needFormFields.isValidAllFields;
        // let fieldsWithMeta = needFormFields.fieldsWithMeta;
        // // =>get all need form fields
        // let fieldsWithMeta: FormFieldMetaData[] = [];
        // let allFormFields = this.widgetForm.formFieldValuesWithMeta();

        // let isValidAllFields = true;
        // // =>iterate all widgets
        // for (const field of allFormFields) {

        //     // =>if select all fields or match fields
        //     if (this.schema.disabledForFormFields[0] === '*' || this.schema.disabledForFormFields.includes(field.name)) {
        //         fieldsWithMeta.push(field);
        //         // =>check all fields to valid
        //         if (field.is_show !== false && field.is_valid === false) {
        //             isValidAllFields = false;
        //             break;
        //         }
        //     }
        // }

        // =>enable button
        if (isValidAllFields) {
            this.schema.disabled = false;
        }
    }



    normalizeSchema(schema: ButtonSchema) {
        if (!schema.size) schema.size = 'medium';
        if (!schema.shape) schema.shape = 'rectangle';
        if (!schema.status) schema.status = 'basic';
        if (schema.fullWidth === undefined) schema.fullWidth = false;
        if (!schema.appearance) schema.appearance = 'fill';
        if (!schema.mode) schema.mode = 'text';
        schema = extraNormalizeSchema(schema);

        return schema;
    }


    async clickEvent(event: MouseEvent) {
        if (!this.schema.click) return;
        // =>if json mode
        if (this.widgetHeader['_isJsonMode']) {
            await this.sendRequestByJsonApi(this.http, this.schema.click as any);
        }
        else {
            this.schema.click.call(this.widgetForm, event, this.widgetHeader);
        }
    }
}
