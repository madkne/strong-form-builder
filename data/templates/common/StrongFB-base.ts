import { StrongFBLayoutBuilder } from "./StrongFB-layout-builder";


export class StrongFBBase<WIDGET extends string = string> {
    // protected _widgets: WIDGET[] = [];

    get layout(): StrongFBLayoutBuilder {
        return this.layoutBuilder();
    }

    layoutBuilder() {
        return new StrongFBLayoutBuilder<WIDGET>();
    }
}