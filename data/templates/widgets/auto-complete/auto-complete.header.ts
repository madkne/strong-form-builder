import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { AutoCompleteAppearance, AutoCompleteChangeEvent, AutoCompleteLoadOptions, AutoCompleteOption, AutoCompleteSchema, AutoCompleteShape, AutoCompleteSize, AutoCompleteStatus } from "./auto-complete-interfaces";
import { StrongFBAutoCompleteWidgetComponent } from "./auto-complete.component";
import { BehaviorSubject } from 'rxjs';



export class StrongFBAutoCompleteWidget<FIELDS = { [k: string]: any }> extends StrongFBBaseWidgetHeader<AutoCompleteSchema> {
    private _updateOptions$ = new BehaviorSubject<boolean>(true);

    protected override _schema: AutoCompleteSchema = {};

    override get component(): any {
        return StrongFBAutoCompleteWidgetComponent;
    }

    override get widgetName(): string {
        return 'auto-complete';
    }

    size(size: AutoCompleteSize) {
        this._schema.size = size;
        return this;
    }

    appearance(appearance: AutoCompleteAppearance) {
        this._schema.appearance = appearance;
        return this;
    }

    shape(shape: AutoCompleteShape) {
        this._schema.shape = shape;
        return this;
    }

    status(status: AutoCompleteStatus) {
        this._schema.status = status;
        return this;
    }


    placeholder(text: string) {
        this._schema.placeholder = text;
        return this;
    }


    options(options: string[] | AutoCompleteOption[]) {
        if (typeof options[0] === 'string') {
            options = options.map(i => {
                return {
                    text: i,
                    value: i,
                } as AutoCompleteOption
            });
        }
        this._schema.options = options as AutoCompleteOption[];
        return this;
    }

    loadOptions(load: AutoCompleteLoadOptions) {
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

    forceToSelect(is = true) {
        this._schema.forceToSelectOption = is;
        return this;
    }

    /********************************* */
    /*************EVENTS************** */
    /********************************* */
    change(change: AutoCompleteChangeEvent) {
        this._schema.change = change;
        return this;
    }




}