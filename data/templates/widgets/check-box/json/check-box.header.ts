import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { ChecKBoxChangeEvent, CheckBoxOptionsDirection, CheckBoxSchema, CheckBoxStatus, CheckOption } from "./check-box-interfaces";



export class StrongFBCheckBoxWidget<FIELDS = { [k: string]: any }> extends StrongFBBaseWidgetHeader {

    protected override _schema: CheckBoxSchema = {};


    override get widgetName(): string {
        return 'check-box';
    }

    status(status: CheckBoxStatus) {
        this._schema.status = status;
        return this;
    }

    formFieldName(name: keyof FIELDS) {
        this._formFieldName = name as any;
        return this;
    }

    options(options: CheckOption[] | CheckOption) {
        this._schema.options = options;
        return this;
    }

    optionsDirection(dir: CheckBoxOptionsDirection) {
        this._schema.optionsDirection = dir;
        return this;
    }

    disabled(is = true) {
        this._schema.disabled = is;
        return this;
    }
    /********************************* */
    /*************EVENTS************** */
    /********************************* */
    // change(change: ChecKBoxChangeEvent) {
    //     this._schema.change = change;
    //     return this;
    // }



}