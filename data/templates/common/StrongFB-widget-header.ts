

export class StrongFBBaseWidgetHeader<SCHEMA extends object = object, WIDGET_NAME extends string = string> {

    protected _schema: SCHEMA = {} as any;

    protected _formFieldName: string;

    protected _name: string;

    get schema() {
        return this._schema;
    }

    get component(): any {
        return undefined;
    }

    get widgetName(): string {
        return 'widget';
    }

    name(name: WIDGET_NAME) {
        this._name = name;
        return this;
    }
}