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

    content(layout: StrongFBLayoutBuilder, styles?: {}) {
        this._schema.content = {
            layout,
            styles,
        };
        return this;
    }

    footer(layout: StrongFBLayoutBuilder) {
        this._schema.footer = {
            layout,
        };
        return this;
    }

    private _loadFromJson(json: object) {
        this._schema = json as any;
        // =>parse header
        if (this._schema?.header?.layout) {
            let newLayout = new StrongFBLayoutBuilder();
            newLayout.loadSchemaByJson(this._schema.header.layout as any);
            this._schema.header.layout = newLayout;
        }
        // =>parse content
        if (this._schema?.content?.layout) {
            let newLayout = new StrongFBLayoutBuilder();
            newLayout.loadSchemaByJson(this._schema.content.layout as any);
            this._schema.content.layout = newLayout;
        }
        // =>parse footer
        if (this._schema?.footer?.layout) {
            let newLayout = new StrongFBLayoutBuilder();
            newLayout.loadSchemaByJson(this._schema.footer.layout as any);
            this._schema.footer.layout = newLayout;
        }

    }
}