import { StrongFBValidatorName } from "../../common/StrongFB-types";
import { StrongFBValidator } from "../../common/StrongFB-validator";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { ButtonSchema } from "../button/button-interfaces";
import { StrongFBButtonWidget } from "../button/button.header";
import { StrongFBEditorWidget } from "../editor/editor.header";
import { StrongFBFileUploaderWidget } from "../file-uploader/file-uploader.header";
import { StrongFBInputWidget } from "../input/input.header";
import { StrongFBRadioBoxWidget } from "../radio-box/radio-box.header";
import { StrongFBSelectWidget } from "../select/select.header";
import { StrongFBTagsListWidget } from "../tags-list/tags-list.header";
import { StrongFBTextAreaWidget } from "../textarea/textarea.header";
import { StrongFBToggleWidget } from "../toggle/toggle.header";
import { StrongFBFormFieldWidget } from "./form-field.header";



export type FormFieldSize = 'small' | 'medium' | 'large';


export type FormFieldType =
    StrongFBInputWidget |
    StrongFBTextAreaWidget |
    StrongFBSelectWidget |
    StrongFBTagsListWidget |
    StrongFBRadioBoxWidget |
    StrongFBFileUploaderWidget |
    StrongFBToggleWidget |
    StrongFBEditorWidget;

export type FormFieldErrorCallback = (name: StrongFBValidatorName, value?: any, self?: StrongFBFormFieldWidget) => any;

export interface FormFieldSchema {

    /**
     * @default medium
     */
    size?: FormFieldSize;

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

    formFieldErrorCallback?: FormFieldErrorCallback;

    formFieldHasError?: StrongFBValidatorName;

}