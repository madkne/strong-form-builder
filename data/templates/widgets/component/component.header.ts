import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { StrongFBComponentWidgetComponent } from "./component.component";
import { ComponentEvent, ComponentInput, ComponentSchema } from "./component-interfaces";



export class StrongFBComponentWidget extends StrongFBBaseWidgetHeader {

    protected override _schema: ComponentSchema = {};

    override get component(): any {
        return StrongFBComponentWidgetComponent;
    }

    override get widgetName(): string {
        return 'component';
    }

    componentClass(classRef: any) {
        this._schema.component = classRef;
        return this;
    }

    input<T = any>(inputRef: ComponentInput<T>) {
        if (!this._schema.inputs) this._schema.inputs = [];
        this._schema.inputs.push(inputRef);
        return this;
    }

    event<T = any>(eventRef: ComponentEvent<T>) {
        if (!this._schema.events) this._schema.events = [];
        this._schema.events.push(eventRef);
        return this;
    }
}