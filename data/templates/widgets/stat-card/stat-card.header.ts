
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { StrongFBStatisticsCardWidgetComponent } from "./stat-card.component";
import { StatisticsCardHeader, StatisticsCardSchema, StatisticsCardUpdateInfo, StatisticsCardSymbol, StatisticsCardChangeProgress, StatisticsCardClickEvent } from "./stat-card-interfaces";
import { ButtonSchema } from "../button/button-interfaces";



export class StrongFBStatisticsCardWidget extends StrongFBBaseWidgetHeader {

    protected override _schema: StatisticsCardSchema = {
        title: '',
        value: 0,
    };

    override get component(): any {
        return StrongFBStatisticsCardWidgetComponent;
    }

    override get widgetName(): string {
        return 'statistics-card';
    }

    // fullWidth(is = true) {
    //     this._schema.fullWidth = is;
    //     return this;
    // }
    icon(icon: string) {
        this._schema.icon = icon;
        return this;
    }
    title(title: string) {
        this._schema.title = title;
        return this;
    }
    symbol(symbol: StatisticsCardSymbol) {
        this._schema.symbol = symbol;
        return this;
    }
    update(update: StatisticsCardUpdateInfo) {
        this._schema.updateInfo = update;
        return this;
    }

    setRatio(ratio: StatisticsCardChangeProgress) {
        this._schema.ratioChange = ratio;
        return this;
    }

    buttons(buttons: ButtonSchema | ButtonSchema[]) {
        if (!Array.isArray(buttons)) buttons = [buttons];
        // =>normalize buttons
        for (const btn of buttons) {
            if (!btn.size) btn.size = 'tiny';
        }

        this._schema.buttons = buttons;
        return this;
    }
    /********************************* */
    /*************EVENTS************** */
    /********************************* */
    click(click: StatisticsCardClickEvent) {
        this._schema.click = click;
        return this;
    }



}