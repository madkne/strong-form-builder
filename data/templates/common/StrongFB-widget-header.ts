

export class StrongFBBaseWidgetHeader<SCHEMA extends object = object> {

    protected _schema: SCHEMA = {} as any;

    get schema() {
        return this._schema;
    }

    get component(): any {
        return undefined;
    }

    get name(): string {
        return 'widget';
    }
}