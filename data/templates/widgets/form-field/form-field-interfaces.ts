import { StrongFBValidator } from "../../common/StrongFB-validator";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { ButtonSchema } from "../button/button-interfaces";
import { StrongFBButtonWidget } from "../button/button.header";
import { StrongFBInputWidget } from "../input/input.header";



export type FormFieldSize = 'small' | 'medium' | 'large';

export type FormFieldStatus = 'default' | 'primary' | 'info' | 'success' | 'warning' | 'danger';

export type FormFieldType = StrongFBInputWidget;

export interface FormFieldSchema {

    /**
     * @default medium
     */
    size?: FormFieldSize;
    /**
     * @default default
     */
    status?: FormFieldStatus;
    /**
     * @default false
     */
    disabled?: boolean;
    hint?: string;
    label?: string;
    /**
     * icon start of input
     */
    prefixIcon?: string;
    /**
     * icon end of input
     */
    suffixIcon?: string;
    /**
     * text in start of input
     * like: '$' 
     */
    prefixText?: string;
    /**
     * text in end of input
     * like: '.00' 
     */
    suffixText?: string;

    suffixButton?: StrongFBButtonWidget;

    validator?: StrongFBValidator;

    /**
    * 
    * @param field StrongFBInputWidget | StrongFBTextareaWidget | StrongFBSelectWidget
    */
    field?: FormFieldType;


    __suffixButtonWidget?: StrongFBBaseWidgetHeader<ButtonSchema>;

}