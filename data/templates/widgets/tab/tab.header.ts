
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { StrongFBTabWidgetComponent } from "./tab.component";
import { TabContent, TabHeader, TabSchema } from "./tab-interfaces";



export class StrongFBTabWidget<HEADER extends string = string> extends StrongFBBaseWidgetHeader {

    protected override _schema: TabSchema<HEADER> = {};

    override get component(): any {
        return StrongFBTabWidgetComponent;
    }

    override get widgetName(): string {
        return 'tab';
    }

    // fullWidth(is = true) {
    //     this._schema.fullWidth = is;
    //     return this;
    // }


    tab<D extends object = object>(header: TabHeader<HEADER>, content: TabContent<D>) {
        if (!this._schema.tabHeaders) this._schema.tabHeaders = [];
        if (!this._schema.tabContents) this._schema.tabContents = {};
        // =>add header
        this._schema.tabHeaders.push(header);
        // =>add content
        this._schema.tabContents[header.name] = content;

        return this;
    }

    /**
     * set or not set padding for tab contents
     * @param is 
     */
    tabPadding(is = true) {
        this._schema.tabPadding = is;
        return this;
    }


}