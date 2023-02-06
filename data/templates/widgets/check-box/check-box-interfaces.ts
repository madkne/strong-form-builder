import { StrongFBCheckBoxWidget } from "./check-box.header";

export type CheckBoxStatus = 'primary' | 'info' | 'success' | 'warning' | 'danger' | 'basic';

export type CheckBoxOptionsDirection = 'row' | 'column';

export interface CheckOption {
    text: string;
    value: string;
    disabled?: boolean;
    _checked?: boolean;
}

export type ChecKBoxChangeEvent = (value?: string, event?: boolean, self?: StrongFBCheckBoxWidget) => Promise<any> | any;

export interface CheckBoxSchema {

    /**
     * @default primary
     */
    status?: CheckBoxStatus;

    /**
     * @default false
     */
    disabled?: boolean;

    name?: string;

    value?: string | string[];

    mode?: 'single' | 'multi';

    options?: CheckOption[] | CheckOption;
    
    /**
     * @default column
     */
    optionsDirection?: CheckBoxOptionsDirection;

    /********************************* */
    /*************EVENTS************** */
    /********************************* */
    change?: ChecKBoxChangeEvent;
}