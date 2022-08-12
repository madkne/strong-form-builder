import { StrongFBSelectWidget } from "./select.header";



export type SelectSize = 'small' | 'medium' | 'large';

export type SelectStatus = 'basic' | 'primary' | 'info' | 'success' | 'warning' | 'danger';

export type SelectShape = 'rectangle' | 'round';
export type SelectAppearance = 'filled' | 'outline' | 'colorful';

export type SelectChangeEvent = (event?: MouseEvent, selected?: string | string[], self?: StrongFBSelectWidget) => Promise<any> | any;

export interface SelectOption {
    text: string;
    value: string;
}

export type SelectLoadOptions = (self?: StrongFBSelectWidget) => Promise<SelectOption> | SelectOption;

export interface SelectSchema {
    /**
     * @default medium
     */
    size?: SelectSize;
    /**
     * @default filled
     */
    appearance?: SelectAppearance;
    /**
     * @default rectangle
     */
    shape?: SelectShape;
    /**
     * @default default
     */
    status?: SelectStatus;
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
    options?: SelectOption[];

    loadOptions?: SelectLoadOptions;


    /********************************* */
    /*************EVENTS************** */
    /********************************* */
    change?: SelectChangeEvent;
}