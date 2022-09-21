import { SimpleChanges, ViewEncapsulation } from '@angular/core';
import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { delay, takeUntil } from 'rxjs';

import { Moment } from 'moment';
import { FormFieldMetaData } from '../../common/StrongFB-interfaces';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { DatePickerSchema, IDatePicker } from './date-picker.interfaces';

@Component({
  selector: 'date-picker-widget',
  templateUrl: './date-picker.component.html',
  encapsulation: ViewEncapsulation.None
})
export class StrongFBDatepickerWidgetComponent extends StrongFBBaseWidget<DatePickerSchema> {
  @Input() ngModel: IDatePicker;

  onChangeDate(event: IDatePicker): void {
    this.ngModelChange.emit(this.ngModel);
  }

  override schema: DatePickerSchema;
  override async onInit() {
    this.initSchema();
  }

  ngOnChanges(changes: SimpleChanges): void {
    // if (changes['widgetHeader']) {
    //     this.initSchema();
    // }

  }

  changeValue(event) {
    this.schema.value = event.unix() * 1000;
    this.updateFormField('value');

    if (this.schema.changeEvent) {
      this.schema.changeEvent.call(this.widgetForm, this.schema.value, this.widgetHeader);
    }
  }

  changeRangeValue(event) {
    this.schema.value = {
      start: event.start.unix(),
      end: event.end.unix()
    }
    this.updateFormField('value');

    if (this.schema.changeEvent) {
      this.schema.changeEvent.call(this.widgetForm, this.schema.value, this.widgetHeader);
    }
  }

  initSchema() {
    if (!this.widgetHeader) return;
    this.schema = this.widgetHeader.schema;
    // =>normalize schema
    this.schema = this.normalizeSchema(this.schema);
  }

  normalizeSchema(schema: DatePickerSchema) {
    if (!schema.pickerType) schema.pickerType = 'datePicker';
    if (!schema.step) schema.step = 30;
    if (!schema.icon) schema.icon = 'calendar-outline';
    return schema;
  }
}
