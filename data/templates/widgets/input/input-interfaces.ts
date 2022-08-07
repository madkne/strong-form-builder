

export type InputType = 'text' | 'password' | 'search' | 'email' | 'number';

export type InputSize = 'small' | 'medium' | 'large';

export type InputStatus = 'basic' | 'primary' | 'info' | 'success' | 'warning' | 'danger';

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


}