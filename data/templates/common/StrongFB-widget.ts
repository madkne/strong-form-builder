import { StrongFBBaseWidgetHeader } from "./StrongFB-widget-header";


export class StrongFBBaseWidget {
    protected widgetId: string;
    public widgetHeader: StrongFBBaseWidgetHeader;

    constructor() {
        this.widgetId = 'string_fb_widget_' + Math.ceil(Math.random() * 100000) + '_' + Math.ceil(Math.random() * 10000);
    }
}