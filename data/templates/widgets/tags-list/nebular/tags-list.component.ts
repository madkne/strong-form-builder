import { Component, Output, EventEmitter, ViewChild, ElementRef } from '@angular/core';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { TagsListSchema } from './tags-list-interfaces';
import { takeUntil } from 'rxjs';
import { NbTagComponent, NbTagInputDirective } from '@nebular/theme';

@Component({
    selector: 'tags-list-widget',
    templateUrl: './tags-list.component.html',
    styleUrls: ['./tags-list.component.scss']
})
export class StrongFBTagsListWidgetComponent extends StrongFBBaseWidget<TagsListSchema> {

    @Output() override ngModelChange = new EventEmitter<string[]>();

    @ViewChild(NbTagInputDirective, { read: ElementRef }) tagInput: ElementRef<HTMLInputElement>;




    override schema: TagsListSchema;
    override async onInit() {
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = await this.normalizeSchema(this.schema);

        this.listenOnFormFieldChange('value');

    }



    normalizeSchema(schema: TagsListSchema) {
        if (!schema.status) schema.status = 'basic';
        if (schema.fullWidth === undefined) schema.fullWidth = true;
        if (schema.addable === undefined) schema.addable = true;
        if (schema.removable === undefined) schema.removable = true;
        if (schema.limit === undefined) schema.limit = 0;
        if (!schema.appearance) schema.appearance = 'filled';
        if (!schema.placeholder) schema.placeholder = '';
        if (!schema.separatorKey) schema.separatorKey = ['enter'];
        if (!schema.value) schema.value = [];


        return schema;
    }

    onTagRemove(tagToRemove: NbTagComponent) {
        if (this.schema.value.indexOf(tagToRemove.text) < 0 || !this.schema.removable) return;
        this.schema.value.splice(this.schema.value.indexOf(tagToRemove.text), 1);
        this.changeValue();
    }

    onTagAdd(value: string): void {
        value = value.trim();
        // =>check not null
        if (!value || value.length < 1) return;
        // =>check limit
        if (this.schema.limit > 0 && this.schema.value.length >= this.schema.limit) {
            return;
        }
        // =>check not duplicate
        if (this.schema.value.indexOf(value) > -1) {
            return;
        }
        // =>add new tag
        this.schema.value.push(value);
        this.changeValue();
        if (this.tagInput) {
            setTimeout(() => {
                this.tagInput.nativeElement.value = '';
            }, 10);
        }
    }


    getSeparatorKeys() {
        let keys = [];
        for (const key of this.schema.separatorKey) {
            switch (key) {
                case 'enter':
                    keys.push(13);
                    break;
                case 'comma':
                    keys.push(188);
                    break;
                case 'slash':
                    keys.push(191);
                    break;
                case 'space':
                    keys.push(32);
                    break;
            }
        }
        return keys;
    }

    changeValue() {
        this.updateFormField('value');
    }

    // changeEvent(event: string | string[]) {
    //     // =>set value to form field
    //     if (this.widgetHeader['_formFieldName']) {
    //         this.widgetForm['_formFieldValues'][this.widgetHeader['_formFieldName']] = event;
    //     }
    //     // console.log('change:', event)
    //     this.ngModelChange.emit(event);

    //     if (!this.schema.change) return;
    //     this.schema.change.call(this.widgetForm, event, this.widgetHeader);
    // }
}
