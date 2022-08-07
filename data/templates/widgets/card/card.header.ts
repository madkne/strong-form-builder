import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { StrongFBCardWidgetComponent } from "./card.component";



export class StrongFBCardWidget extends StrongFBBaseWidgetHeader {

    override get component(): any {
        return StrongFBCardWidgetComponent;
    }

    override get name(): string {
        return 'card';
    }

    header(layout: StrongFBLayoutBuilder): StrongFBCardWidget;
    header(text: string): StrongFBCardWidget;
    header(param: StrongFBLayoutBuilder | string): StrongFBCardWidget {
        if (typeof param === 'string') {

        } else {

        }
        return this;
    }

    content(layout: StrongFBLayoutBuilder) {
        return this;
    }

    footer(layout: StrongFBLayoutBuilder) {
        return this;
    }
}