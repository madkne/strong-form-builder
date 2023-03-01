import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { IconSchema } from "./icon-interfaces";
import { StrongFBIconWidgetComponent } from "./icon.component";



export class StrongFBIconWidget extends StrongFBBaseWidgetHeader {

    protected override _schema: IconSchema = {};

    override get component(): any {
        return StrongFBIconWidgetComponent;
    }

    override get widgetName(): string {
        return 'icon';
    }

}