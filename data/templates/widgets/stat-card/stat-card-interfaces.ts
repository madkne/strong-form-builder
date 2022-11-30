import { StrongFBFormClass } from "../../common/StrongFB-base";
import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBStatisticsCardWidget } from "./stat-card.header";
import { ButtonSchema } from '../button/button-interfaces';

export interface StatisticsCardHeader<H extends string = string> {

}

export interface StatisticsCardChangeProgress {
    /**
     * @example 'last week'
     */
    ratioText?: string;
    disabled?: boolean;
    /**
     * @return number as percent
     */
    calculatorFunc?: (oldValue: number, newValue: number, self?: StrongFBStatisticsCardWidget) => Promise<number> | number;

    __ratioPercent?: number;
}

export interface StatisticsCardUpdateInfo {
    /**
        * in mill seconds (ms)
        */
    updatePeriod?: number;
    getInfo?: (self?: StrongFBStatisticsCardWidget) => Promise<number> | number;
}


export type StatisticsCardClickEvent = (value: number, self?: StrongFBStatisticsCardWidget) => void;

export type StatisticsCardSymbol = 'percent' | 'number';

export interface StatisticsCardSchema {
    title: string;
    value: number;
    icon?: string;
    updateInfo?: StatisticsCardUpdateInfo;
    fullWidth?: boolean;
    /**
     * @default random color
     */
    color?: string;
    /**
     * @default number
     */
    symbol?: StatisticsCardSymbol;
    ratioChange?: StatisticsCardChangeProgress;
    buttons?: ButtonSchema[];
    /*******EVENTS******* */
    click?: StatisticsCardClickEvent;
}