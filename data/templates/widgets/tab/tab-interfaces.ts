import { StrongFBFormClass } from "../../common/StrongFB-base";
import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";

export interface TabHeader<H extends string = string> {
    name: H;
    title?: string;
    disabled?: boolean;
    icon?: string;
    /**
     * @default text
     */
    mode?: 'icon' | 'text' | 'textWithIcon';
    /**
     * @default false
     */
    isActive?: boolean;
}

export interface TabContent<D = object> {
    form?: any;
    layout?: StrongFBLayoutBuilder;
    html?: string;
    formInitialData?: D;
    /**
     * auto filled by form builder
     */
    __formInstance?: any;
}

export interface TabSchema<H extends string = string> {
    tabHeaders?: TabHeader<H>[];
    /**
     * @default true
     */
    // fullWidth?: boolean;
    tabContents?: { [k in H]?: TabContent };
    /**
     * @default true
     */
    tabPadding?: boolean;
}