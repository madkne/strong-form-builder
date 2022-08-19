import { InputSize, InputStatus } from "../input/input-interfaces";

export type EditorType = 'markdown' | 'wysiwyg';

export interface EditorSchema {

    /**
     * @default wysiwyg
     */
    type?: EditorType;
    placeholder?: string;
    /**
     * @default false
     */
    disabled?: boolean;
    value?: string;
    /**
     * @default '200px'
     */
    minHeight?: string;
    /**
     * @default '100%'
     */
    maxWidth?: string;
    /**
     * @default '300px'
     */
    // maxHeight?: string;


}