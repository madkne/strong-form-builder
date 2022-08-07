import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { StrongFBInputWidgetComponent } from "./input.component";



export class StrongFBInputWidget extends StrongFBBaseWidgetHeader {

    override get component(): any {
        return StrongFBInputWidgetComponent;
    }

    type(typ: 'text' | 'password' | 'search' | 'email') {

        return this;
    }
}