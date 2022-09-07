import { InputSize, InputStatus } from "../input/input-interfaces";

export type EditorType = 'markdown' | 'wysiwyg';

export type EditorProductType = 'ToastUI' | 'Froala';

export interface EditorSchema {

    /**
     * @default wysiwyg
     */
    type?: EditorType;
    placeholder?: string;
    /**
     * @default Froala
     */
    editorType?: EditorProductType;
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