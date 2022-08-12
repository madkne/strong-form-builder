

export class StrongFBBaseWidgetHeader<SCHEMA extends object = object, WIDGET_NAME extends string = string> {

    protected _schema: SCHEMA = {} as any;

    protected _formFieldName: string;

    protected _name: string;

    protected _commonStyles: object = {};

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

    margin2x(topBottom = '0.5em', leftRight = '0.5em') {
        this._commonStyles['margin'] = `${topBottom} ${leftRight}`;

        return this;
    }
    margin4x(top = '0.1em', bottom = '0.1em', left = '0.1em', right = '0.1em') {
        this._commonStyles['margin'] = `${top} ${bottom} ${left} ${right}`;

        return this;
    }

    minWidth(width = '100px') {
        this._commonStyles['min-width'] = width;

        return this;
    }
}