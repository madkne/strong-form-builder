import { ChangeDetectorRef, Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { colorIsLight, randomColor } from '../../common/StrongFB-common';
import { SFB_warn } from '../../common/StrongFB-common';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { StrongFBService } from '../../services/StrongFB.service';
import { StatisticsCardSchema } from './stat-card-interfaces';

@Component({
    selector: 'stat-card-widget',
    templateUrl: './stat-card.component.html',
    styleUrls: ['./stat-card.component.scss']
})
export class StrongFBStatisticsCardWidgetComponent extends StrongFBBaseWidget<StatisticsCardSchema> {

    mode: 'light' | 'dark' = 'light';
    protected override prefixId = 'statCard';

    // protected override emitAutoReadyToUse = false;

    constructor(
        private elref: ElementRef,
        private strongService: StrongFBService,
        protected detectChanges: ChangeDetectorRef) {
        super(elref, detectChanges);
    }

    override async onInit() {
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = await this.normalizeSchema(this.schema);
        this.calcBackground();
        this.updateStat();
        // =>listen on update stat
        if (this.schema.updateInfo.updatePeriod) {
            setInterval(() => {
                this.updateStat();
            }, this.schema.updateInfo.updatePeriod);
        }
    }

    async updateStat() {
        if (this.schema.updateInfo.getInfo) {
            let res = await this.schema.updateInfo.getInfo.call(this.widgetForm, this.widgetHeader);
            if (!isNaN(Number(res))) {
                let oldValue = this.schema.value;
                this.schema.value = Number(Number(res).toFixed(2));
                this.counterAnim(`#stat_` + this.widgetId, oldValue, this.schema.value);
                // =>check change ratio
                if (this.schema.ratioChange && oldValue) {
                    // =>if exist calc func
                    if (this.schema.ratioChange.calculatorFunc) {
                        this.schema.ratioChange.__ratioPercent = Number((await this.schema.ratioChange.calculatorFunc.call(this.widgetForm, oldValue, this.schema.value, this.widgetHeader)).toFixed(1));
                    }
                    // =>if not
                    else {
                        let tmpPercent = Number(((100 * this.schema.value) / oldValue).toFixed(1));
                        this.schema.ratioChange.__ratioPercent = Number((tmpPercent - 100).toFixed(1));

                    }
                }
            }
        }
    }

    normalizeSchema(schema: StatisticsCardSchema) {
        if (!schema.symbol) schema.symbol = 'number';
        if (!schema.color) schema.color = randomColor();
        if (!schema.updateInfo) {
            schema.updateInfo = {};
        }
        if (!schema.background) {
            schema.background = {
                mode: 'basic',
            };
        }
        return schema;
    }

    calcBackground() {
        // =>if mode is basic
        if (this.schema.background.mode === 'basic') {
            this.schema.background.__value = undefined;
        }
        // =>if mode is auto-gradient
        if (this.schema.background.mode === 'auto-gradient') {
            let dir = '-90deg';
            if (this.schema.background.direction) {
                dir = this.schema.background.direction + 'deg';
            }
            this.schema.background.__value = `linear-gradient(${dir}, ${this.schema.color}, #eeeeee)`;
        }
    }


    async counterAnim(qSelector, start = 0, end, duration = 1000) {
        const target = document.querySelector(qSelector);
        if (!target) return;
        let startTimestamp = null;
        const step = (timestamp) => {
            if (!startTimestamp) startTimestamp = timestamp;
            const progress = Math.min((timestamp - startTimestamp) / duration, 1);
            target.innerText = Math.floor(progress * (end - start) + start);
            if (progress < 1) {
                window.requestAnimationFrame(step);
            }
        };
        window.requestAnimationFrame(step);
    }

    detectColorByBg(color: string) {
        if (colorIsLight(color)) {
            this.mode = 'light';
            return '#424242';
        }
        this.mode = 'dark';
        return '#eee';
    }

}