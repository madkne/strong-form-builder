import { StrongFBRadioBoxWidget } from "./radio-box.header";





export type RadioBoxStatus =  'primary' | 'info' | 'success' | 'warning' | 'danger';

export type RadioBoxOptionsDirection = 'row' | 'column';
export interface RadioOption {
    text: string;
    value: string;
    disabled?: boolean;
}


export type RadioBoxChangeEvent = (event?: MouseEvent, self?: StrongFBRadioBoxWidget) => Promise<any> | any;

export interface RadioBoxSchema {
   
   
    /**
     * @default primary
     */
    status?: RadioBoxStatus;
    /**
     * @default false
     */
    disabled?: boolean;

    options?: RadioOption[];

    value?: string;
    /**
     * @default column
     */
    optionsDirection?: RadioBoxOptionsDirection;
    
    /********************************* */
    /*************EVENTS************** */
    /********************************* */
    change?: RadioBoxChangeEvent;
}