import { Component, Output, EventEmitter, ChangeDetectorRef, ElementRef, HostListener, ViewChild } from '@angular/core';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { AutoCompleteOption, AutoCompleteSchema } from './auto-complete-interfaces';
import { takeUntil } from 'rxjs';
import { clone } from '../../common/StrongFB-common';

@Component({
    selector: 'auto-complete-widget',
    templateUrl: './auto-complete.component.html',
    styleUrls: ['./auto-complete.component.scss']
})
export class StrongFBAutoCompleteWidgetComponent extends StrongFBBaseWidget<AutoCompleteSchema> {

    showPopup = false;
    options: AutoCompleteOption[] = [];
    @Output() override ngModelChange = new EventEmitter<string | string[]>();
    @ViewChild(Object, { read: ElementRef }) tagInput: ElementRef<HTMLInputElement>;


    constructor(
        private eRef: ElementRef,
        protected override cdr: ChangeDetectorRef) {
        super(eRef, cdr);
    }

    override schema: AutoCompleteSchema;
    override async onInit() {
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = await this.normalizeSchema(this.schema);
        // =>listen on update rows
        this.widgetHeader['_updateOptions$'].pipe(takeUntil(this.destroy$)).subscribe(it => {
            if (!it) return;
            // =>load options
            this.loadOptions();
        });
        this.listenOnFormFieldChange('value');

    }

    async loadOptions() {
        this.options = [];

        // =>load simple options
        if (this.schema.options) {
            this.options = JSON.parse(JSON.stringify(this.schema.options));
        }
    }


    initSchema() {
        if (!this.widgetHeader) return;
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = this.normalizeSchema(this.schema);

    }

    normalizeSchema(schema: AutoCompleteSchema) {
        if (!schema.size) schema.size = 'medium';
        if (!schema.shape) schema.shape = 'rectangle';
        if (!schema.status) schema.status = 'basic';
        if (schema.fullWidth === undefined) schema.fullWidth = false;
        if (!schema.appearance) schema.appearance = 'filled';
        if (!schema.placeholder) schema.placeholder = '';
        if (schema.multiple) {
            if (!schema.value) schema.value = [];
        }
        if (!schema.selectedOptions) schema.selectedOptions = [];
        // =>if selected items
        if (schema.value) {
            this.changeEvent(schema.value);
        }

        return schema;
    }


    changeEvent(event: string | string[]) {
        this.schema.value = event;
        this.updateFormField('value');

        if (!this.schema.change) return;
        this.schema.change.call(this.widgetForm, this.schema.value, this.widgetHeader);
    }

    async changeValue(event) {

    }

    async keyupEvent(event: KeyboardEvent) {
        // =>if not force to select option
        if (!this.schema.forceToSelectOption) {
            this.schema.value = clone(this.schema._searchText);
            this.updateFormField('value');
        }
        // =>call load option function
        if (this.schema.loadOptions) {
            this.options = await this.schema.loadOptions.call(this.widgetForm, this.widgetHeader, this.schema._searchText);
        }
        this.showPopup = true;
    }
    @HostListener('document:click', ['$event'])
    clickout(event) {
        if (this.eRef.nativeElement.contains(event.target)) {
            // this.text = "clicked inside";
        } else {
            this.showPopup = false;
            // this.text = "clicked outside";
        }
    }

    showPopupPanel(is = undefined) {
        if (is === undefined) {
            is = this.showPopup ? false : true;
        }
        if (is) {
            if (this.options.length === 0) return;
            this.showPopup = true;
        } else {
            this.showPopup = false;
        }
    }

    isSelected(value: string) {
        if (this.schema.multiple) {
            return this.schema.value.indexOf(value) > -1;
        } else {
            return this.schema.value === value;
        }
    }

    onRemove(event) {
        // console.log('remove event:', event);
        // =>remove from selected options
        if (this.schema.selectedOptions.find(i => i.text === event.text)) {
            this.schema.selectedOptions.splice(this.schema.selectedOptions.findIndex(i => i.text === event.text), 1);
        }
        if (this.schema.multiple && (this.schema.value as string[]).indexOf(event.text) > -1) {
            (this.schema.value as string[]).splice((this.schema.value as string[]).indexOf(event.text), 1);
        } else if (!this.schema.multiple) {
            this.schema.value = undefined;
        }
    }


    toggleSelectOption(option: AutoCompleteOption) {
        // =>if exist option selected
        if (this.isSelected(option.value)) {
            // =>remove option from selected
            if (this.schema.multiple) {
                (this.schema.value as string[]).splice((this.schema.value as string[]).indexOf(option.value), 1);
            } else {
                this.schema.value = undefined;
            }
            this.schema.selectedOptions.splice(this.schema.selectedOptions.findIndex(i => i.value === option.value), 1);
        }
        else {
            // =>add option to selected
            if (this.schema.multiple) {
                (this.schema.value as string[]).push(option.value);
            } else {
                this.schema.value = option.value;
            }
            this.schema.selectedOptions.push(option);
            if (this.schema.multiple) {
                this.schema._searchText = '';
            }
        }
    }

    findTextOfValue(value: string) {
        // =>find value in selected options
        let option = this.schema.selectedOptions.find(i => i.value === value);
        if (option) return option.text;

        return value;
    }

    onAddValue(value: string) {
        // =>check exist in options
        let isOption = this.options.find(i => i.text == value) !== undefined;
        if (this.schema.forceToSelectOption && !isOption) {
            return;
        }
        if (value) {
            (this.schema.value as string[]).push(value);
        }
        this.schema._searchText = '';
    }

}