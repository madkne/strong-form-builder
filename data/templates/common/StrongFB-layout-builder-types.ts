import { StrongFBLayoutBuilder } from "./StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "./StrongFB-widget-header";

export interface StrongFBLayoutBuilderGridCommonProperties<WIDGET extends string = string> {
    layout?: StrongFBLayoutBuilder<WIDGET> | StrongFBLayoutBuilder<WIDGET>[];
    class?: string[] | string;
    style?: { [k: string]: string };
    id?: string;
    layoutClasses?: string[][];
}
export interface StrongFBLayoutBuilderBoxCommonProperties<WIDGET extends string = string> {
    layout?: StrongFBLayoutBuilder<WIDGET> | StrongFBLayoutBuilder<WIDGET>[];
    class?: string[] | string;
    style?: { [k: string]: string };
    id?: string;
    widget?: () => StrongFBBaseWidgetHeader | (() => StrongFBBaseWidgetHeader)[];
}

export interface StrongFBLayoutBuilderNormalBoxProperties<WIDGET extends string = string> extends StrongFBLayoutBuilderBoxCommonProperties<WIDGET> {
    text?: string;
    html?: string;
}

export type StrongFBLayoutBuilderWidgetFunction<T = StrongFBBaseWidgetHeader> = () => Promise<T> | T;

export interface StrongFBLayoutBuilderSchema<WIDGET extends string = string> {
    type?: StrongFBLayoutBuilderType;
    classes?: string[];
    styles?: object;
    layouts?: StrongFBLayoutBuilder<WIDGET>[];
    text?: string;
    id?: string;
    widgets?: StrongFBLayoutBuilderWidgetFunction[];
    widgetHeaders?: StrongFBLayoutBuilderWidgetFunction<StrongFBBaseWidgetHeader[]>[];
    html?: string;
}

/*********************************** */
/*********************************** */
/*********************************** */
export type StrongFBLayoutBuilderType = 'box' | 'grid';

export type StrongFBLayoutBuilderGridColumnType = 'col-1' | 'col-2' | 'col-3' | 'col-4' | 'col-5' | 'col-6' | 'col-7' | 'col-8' | 'col-9' | 'col-10' | 'col-11' | 'col-12' | 'col-auto';