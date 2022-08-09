import { InputSize, InputStatus } from "../input/input-interfaces";


export interface TextAreaSchema {
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
     * @default false
     */
    disabled?: boolean;
    value?: string | number;
    /**
     * @default 4
     */
    rows?: number;
    /**
     * @default 100
     */
    cols?: number;
    /**
     * @default '100%'
     */
    maxWidth?: string;
    /**
     * @default '300px'
     */
    maxHeight?: string;


}