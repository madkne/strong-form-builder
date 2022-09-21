import { StrongFBDatePickerWidget } from "./date-picker.header";


export type DatePickerType = 'rangePicker' | 'datePicker' | 'dateTimePicker'

export type DatePickerChangeEvent = (value: number | IDatePicker, self?: StrongFBDatePickerWidget) => Promise<any> | any;



export interface DatePickerSchema {
    /**
     * @default datepicker
     */
    pickerType?: DatePickerType;
    /**
     * @default false
     */
    disabled?: boolean;
    /**
     * @default false
     */
    fullWidth?: boolean;
    icon?: string;
    /**
     * @default 30
     */
    step?: number;
    value?: number | string | object;
    min?: number;
    max?: number;

    changeEvent?: DatePickerChangeEvent;
}

export interface IDatePicker {
    start?: any;
    end?: any;
}