import { SelectOption } from "../select/select-interfaces";
import { StrongFBTagsListWidget } from "./tags-list.header";




export type TagStatus = 'basic' | 'primary' | 'info' | 'success' | 'warning' | 'danger';

export type TagAppearance = 'filled' | 'outline';

export type TagSeparatorKey = 'enter' | 'space' | 'slash' | 'comma';





export interface TagsListSchema {

    /**
     * @default filled
     */
    appearance?: TagAppearance;
    /**
     * @default basic
     */
    status?: TagStatus;
    /**
     * @default false
     */
    disabled?: boolean;

    placeholder?: string;
    /**
     * @default true
     */
    fullWidth?: boolean;

    value?: string[];
    autoCompleteOptions?: SelectOption[];
    /**
     * @default ['enter']
     */
    separatorKey?: TagSeparatorKey[];
    /**
     * @default true
     */
    removable?: boolean;
    /**
     * @default true
     */
    addable?: boolean

    /**
     * @default 0 (no limit)
     */
    limit?: number;
    // loadOptions?: SelectLoadOptions;


    /********************************* */
    /*************EVENTS************** */
    /********************************* */

}