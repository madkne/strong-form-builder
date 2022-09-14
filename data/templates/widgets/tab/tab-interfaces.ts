import { StrongFBFormClass } from "../../common/StrongFB-base";
import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBTabWidget } from "./tab.header";

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
    /**
     * useful for store additional data about tab and use them on events
     */
    meta?: object;
}

export interface TabContent<D = object> {
    form?: any;
    layout?: StrongFBLayoutBuilder;
    html?: string;
    formInitialData?: D;
    /**
     * @private
     * auto filled by form builder
     */
    __formInstance?: any;
    component?: any;
    /**
     * @private
     * auto filled by form builder
     */
    __componentInstance?: any;
}

export type TabClickEvent<H extends string = string> = (tab: TabHeader<H>, self?: StrongFBTabWidget) => void;

export type TabBeforeChangeEvent<H extends string = string> = (tab: TabHeader<H>, self?: StrongFBTabWidget) => Promise<boolean> | boolean;


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
    /*******EVENTS******* */
    tabClick?: TabClickEvent;
    tabBeforeChange?: TabBeforeChangeEvent;
}