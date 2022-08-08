import { StrongFBLayoutBuilder } from "./StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "./StrongFB-widget-header";


export interface StrongFBLayoutBuilderBoxCommonProperties<WIDGET extends string = string> {
    layout?: StrongFBLayoutBuilder | StrongFBLayoutBuilder[];
    class?: string[] | string;
    style?: { [k: string]: string };
    id?: string;
    widget?: () => StrongFBBaseWidgetHeader | (() => StrongFBBaseWidgetHeader)[];
}

export interface StrongFBLayoutBuilderNormalBoxProperties<WIDGET extends string = string> extends StrongFBLayoutBuilderBoxCommonProperties<WIDGET> {
    text?: string;
    html?: string;
}

export type StrongFBLayoutBuilderWidgetFunction = () => StrongFBBaseWidgetHeader;

export interface StrongFBLayoutBuilderSchema<WIDGET extends string = string> {
    type?: StrongFBLayoutBuilderType;
    classes?: string[];
    styles?: object;
    layouts?: StrongFBLayoutBuilder[];
    text?: string;
    id?: string;
    widgets?: StrongFBLayoutBuilderWidgetFunction[];
    html?: string;
}

/*********************************** */
/*********************************** */
/*********************************** */
export type StrongFBLayoutBuilderType = 'box';