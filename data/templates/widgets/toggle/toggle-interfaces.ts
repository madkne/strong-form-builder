

export type ToggleLabel = 'left' | 'right' | 'start' | 'end';

export type ToggleStatus = 'basic' | 'primary' | 'info' | 'success' | 'warning' | 'danger';

export interface ToggleSchema {
    /**
     * @default basic
     */
    status?: ToggleStatus;
    /**
     * @default left
     */
    labelPosition?: ToggleLabel;
    /**
     * @default false
     */
    checked?: boolean;
    /**
     * @default false
     */
    disabled?: boolean;
    /**
     * @default false
    */
    value?: boolean;
    label?: string;
}