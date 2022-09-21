import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { StrongFBDatepickerWidgetComponent } from "./date-picker.component";
import { DatePickerChangeEvent, DatePickerSchema, DatePickerType } from "./date-picker.interfaces";


/**
 * need to fix errors of it
 * @deprecated
 */
export class StrongFBDatePickerWidget<FIELDS = { [k: string]: any }> extends StrongFBBaseWidgetHeader {

    protected override _schema: DatePickerSchema = {};

    override get component(): any {
        return StrongFBDatepickerWidgetComponent;
    }

    override get widgetName(): string {
        return 'date-picker';
    }

    pickerType(pickerType: DatePickerType) {
        this._schema.pickerType = pickerType;
        return this;
    }

    icon(icon: string) {
        this._schema.icon = icon;
        return this;
    }

    fullWidth(is = true) {
        this._schema.fullWidth = is;
        return this;
    }

    step(step: number) {
        this._schema.step = step;
        return this;
    }

    min(min: number) {
        this._schema.min = min;
        return this;
    }

    max(max: number) {
        this._schema.max = max;
        return this;
    }

    formFieldName(name: keyof FIELDS) {
        this._formFieldName = name as any;
        return this;
    }

    value(text: number | string) {
        this._schema.value = text;
        return this;
    }



    /********************************* */
    /*************EVENTS************** */
    /********************************* */
    change(change?: DatePickerChangeEvent) {
        this._schema.changeEvent = change;
        return this;
    }

}