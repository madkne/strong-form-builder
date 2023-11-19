import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";


export interface CardSchema {
    content?: {
        layout: StrongFBLayoutBuilder;
        styles?: object;
    };
    header?: {
        layout?: StrongFBLayoutBuilder;
        text?: string;
    };
    footer?: {
        layout: StrongFBLayoutBuilder;
    };
}