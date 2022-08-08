import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { StrongFBCardWidgetComponent } from "./card.component";
import { CardSchema } from "./card-interfaces";



export class StrongFBCardWidget extends StrongFBBaseWidgetHeader {

    protected override _schema: CardSchema = {};

    override get component(): any {
        return StrongFBCardWidgetComponent;
    }

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
}