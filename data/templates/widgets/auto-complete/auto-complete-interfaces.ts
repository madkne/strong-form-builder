import { StrongFBAutoCompleteWidget } from "./auto-complete.header";



export type AutoCompleteSize = 'small' | 'medium' | 'large';

export type AutoCompleteStatus = 'basic' | 'primary' | 'info' | 'success' | 'warning' | 'danger';

export type AutoCompleteShape = 'rectangle' | 'round';
export type AutoCompleteAppearance = 'filled' | 'outline' | 'colorful';

export type AutoCompleteChangeEvent = (selected?: string | string[], self?: StrongFBAutoCompleteWidget) => Promise<any> | any;

export interface AutoCompleteOption {
    text: string;
    value: string;
}

export type AutoCompleteLoadOptions = (self?: StrongFBAutoCompleteWidget, search?: string) => Promise<AutoCompleteOption[]> | AutoCompleteOption[];

export type AutoCompleteLoadTextByValueCallback = (value: string, self?: StrongFBAutoCompleteWidget) => Promise<string> | string;

export interface AutoCompleteSchema {
    /**
     * @default medium
     */
    size?: AutoCompleteSize;
    /**
     * @default filled
     */
    appearance?: AutoCompleteAppearance;
    /**
     * @default rectangle
     */
    shape?: AutoCompleteShape;
    /**
     * @default default
     */
    status?: AutoCompleteStatus;
    /**
     * @default false
     */
    disabled?: boolean;

    placeholder?: string;
    /**
     * @default false
     */
    fullWidth?: boolean;
    /**
     * Gives capability just write multiple over the element.
     * @default false
     */
    multiple?: boolean;
    value?: string | string[];
    selectedOptions?: AutoCompleteOption[];
    options?: AutoCompleteOption[];
    /**
     * user forces to select an option
     * @default false
     */
    forceToSelectOption?: boolean;

    loadOptions?: AutoCompleteLoadOptions;

    _searchText?: string;

    loadTextByValue?: AutoCompleteLoadTextByValueCallback;

    /********************************* */
    /*************EVENTS************** */
    /********************************* */
    change?: AutoCompleteChangeEvent;
}