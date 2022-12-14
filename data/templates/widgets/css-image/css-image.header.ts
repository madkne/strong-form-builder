import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { CssImageEmojiName, CssImageIllustrationName, CssImageName, CssImageSchema, CssImageSize, CssImageType } from "./css-image-interfaces";
import { StrongFBCssImageWidgetComponent } from "./css-image.component";



export class StrongFBCssImageWidget extends StrongFBBaseWidgetHeader<CssImageSchema> {

    protected override _schema: CssImageSchema = {};

    override get component(): any {
        return StrongFBCssImageWidgetComponent;
    }

    override get widgetName(): string {
        return 'textarea';
    }


    size(size: CssImageSize) {
        this._schema.size = size;
        return this;
    }
    // type(type: CssImageType) {
    //     this._schema.type = type;
    //     return this;
    // }

    // name(name: CssImageName) {
    //     this._schema.name = name;
    //     return this;
    // }

    illustration(name: CssImageIllustrationName) {
        this._schema.type = 'illustration';
        this._schema.name = name;
        return this;
    }

    emoji(name: CssImageEmojiName) {
        this._schema.type = 'emoji';
        this._schema.name = name;
        return this;
    }

    title(title: string) {
        this._schema.title = title;
        return this;
    }

    background(bg: string) {
        this._schema.background = bg;
        return this;
    }
}