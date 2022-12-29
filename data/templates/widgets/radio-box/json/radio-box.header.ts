import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { RadioBoxChangeEvent, RadioBoxOptionsDirection, RadioBoxSchema, RadioBoxStatus, RadioOption } from "./radio-box-interfaces";



export class StrongFBRadioBoxWidget<FIELDS = { [k: string]: any }> extends StrongFBBaseWidgetHeader {

    protected override _schema: RadioBoxSchema = {};

    override get widgetName(): string {
        return 'radio-box';
    }



    status(status: RadioBoxStatus) {
        this._schema.status = status;
        return this;
    }

    options(options: RadioOption[]) {
        this._schema.options = options;
        return this;
    }

    optionsDirection(dir: RadioBoxOptionsDirection) {
        this._schema.optionsDirection = dir;
        return this;
    }

    selectedOption(value: string) {
        this._schema.value = value;
        return this;
    }


    formFieldName(name: keyof FIELDS) {
        this._formFieldName = name as any;
        return this;
    }

    /********************************* */
    /*************EVENTS************** */
    /********************************* */
    // change(change: RadioBoxChangeEvent) {
    //     this._schema.change = change;
    //     return this;
    // }FIXME:




}