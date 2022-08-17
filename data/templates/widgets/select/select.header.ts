import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { SelectAppearance, SelectChangeEvent, SelectLoadOptions, SelectOption, SelectSchema, SelectShape, SelectSize, SelectStatus } from "./select-interfaces";
import { StrongFBSelectWidgetComponent } from "./select.component";
import { BehaviorSubject } from 'rxjs';



export class StrongFBSelectWidget<FIELDS = { [k: string]: any }> extends StrongFBBaseWidgetHeader<SelectSchema> {
    private _updateOptions$ = new BehaviorSubject<boolean>(true);

    protected override _schema: SelectSchema = {};

    override get component(): any {
        return StrongFBSelectWidgetComponent;
    }

    override get widgetName(): string {
        return 'select';
    }

    size(size: SelectSize) {
        this._schema.size = size;
        return this;
    }

    appearance(appearance: SelectAppearance) {
        this._schema.appearance = appearance;
        return this;
    }

    shape(shape: SelectShape) {
        this._schema.shape = shape;
        return this;
    }

    status(status: SelectStatus) {
        this._schema.status = status;
        return this;
    }


    placeholder(text: string) {
        this._schema.placeholder = text;
        return this;
    }

    options(options: string[] | SelectOption[]) {
        if (typeof options[0] === 'string') {
            options = options.map(i => {
                return {
                    text: i,
                    value: i,
                } as SelectOption
            });
        }
        this._schema.options = options as SelectOption[];
        return this;
    }

    loadOptions(load: SelectLoadOptions) {
        this._schema.loadOptions = load;
        return this;
    }

    updateOptions() {
        this._updateOptions$.next(true);

    }

    formFieldName(name: keyof FIELDS) {
        this._formFieldName = name as any;
        return this;
    }

    fullWidth(is = true) {
        this._schema.fullWidth = is;
        return this;
    }

    selected(selected: string | string[]) {
        this._schema.value = selected;
        return this;
    }

    multiple(is = true) {
        this._schema.multiple = is;
        return this
    }

    /********************************* */
    /*************EVENTS************** */
    /********************************* */
    change(change: SelectChangeEvent) {
        this._schema.change = change;
        return this;
    }




}