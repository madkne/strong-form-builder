import { StrongFBLayoutBuilder } from "./common/StrongFB-layout-builder";
import { STRONGFB_VERSION } from "./info";


export class StrongFBMainClass<WIDGET extends string = string> {


    get layout(): StrongFBLayoutBuilder {
        return this.layoutBuilder();
    }

    layoutBuilder() {
        return new StrongFBLayoutBuilder<WIDGET>();
    }

    async toObject() {
        return {
            form: {
                layout: await this.layout.generateSchema(this),
            },
            version: STRONGFB_VERSION,
        };
    }

}