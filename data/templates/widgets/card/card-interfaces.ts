import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";


export interface CardSchema {
    content?: {
        layout: StrongFBLayoutBuilder;
    };
    header?: {
        layout?: StrongFBLayoutBuilder;
        text?: string;
    };
    footer?: {
        layout: StrongFBLayoutBuilder;
    };
}