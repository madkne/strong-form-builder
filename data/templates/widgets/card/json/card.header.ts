import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { CardSchema } from "./card-interfaces";



export class StrongFBCardWidget extends StrongFBBaseWidgetHeader {

    protected override _schema: CardSchema = {};

    override get widgetName(): string {
        return 'card';
    }

    header(layout: StrongFBLayoutBuilder): StrongFBCardWidget;
    header(text: string): StrongFBCardWidget;
    header(param: StrongFBLayoutBuilder | string): StrongFBCardWidget {
        this._schema.header = {};
        if (typeof param === 'string') {
            this._schema.header.text = param;
        } else {
            this._schema.header.layout = param;
        }
        return this;
    }

    content(layout: StrongFBLayoutBuilder) {
        this._schema.content = {
            layout,
        };
        return this;
    }

    footer(layout: StrongFBLayoutBuilder) {
        this._schema.footer = {
            layout,
        };
        return this;
    }

    async toObject() {
        let obj = this._schema;
        // =>normalize header
        if (obj?.header?.layout) {
            obj.header.layout = await obj.header.layout.generateSchema(this) as any;
        }
        // =>normalize content
        if (obj?.content?.layout) {
            obj.content.layout = await obj.content.layout.generateSchema(this) as any;
        }
        // =>normalize footer
        if (obj?.footer?.layout) {
            obj.footer.layout = await obj.footer.layout.generateSchema(this) as any;
        }
        return obj;
    }
}