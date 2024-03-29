import { FormFieldSchema } from "../form-field/form-field-interfaces";
import { StrongFBInputWidget } from "./input.header";


export type InputType = 'text' | 'password' | 'search' | 'email' | 'number' | 'color';

export type InputSize = 'small' | 'medium' | 'large';

export type InputStatus = 'basic' | 'primary' | 'info' | 'success' | 'warning' | 'danger';

export type InputKeyEvent = {
    keyNumber: number;
    keyType: 'keyup';
    callback: (event: KeyboardEvent, self?: StrongFBInputWidget) => any;
}

export interface InputSchema {
    /**
     * @default medium
     */
    size?: InputSize;
    /**
     * @default rectangle
     */
    shape?: 'round' | 'rectangle';
    /**
     * @default basic
     */
    status?: InputStatus;
    /**
     * @default true
     */
    fullWidth?: boolean;
    placeholder?: string;
    /**
     * @default text
     */
    type?: InputType;
    /**
     * @default false
     */
    disabled?: boolean;
    value?: string | number;
    direction?: string;
    textAlign?: string;

    _form?: FormFieldSchema;
    /********************************* */
    /*************EVENTS************** */
    /********************************* */
    keyEvents?: InputKeyEvent[];

}