import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable } from 'rxjs';
import { convertBytesToHumanly, convertSecondsToHumanly, replaceByRegex, SFB_error, SFB_info, SFB_warn } from '../common/StrongFB-common';
import { LanguageInfo } from '../common/StrongFB-interfaces';
import { AvailableLanguage, AvailableLanguages, CustomLocales, Direction, LocaleCalendar, LocaleNamespace } from '../common/StrongFB-types';
import { Common_en } from '../locales/en/common';
import { EN_LANG_INFO } from '../locales/en/info';
import { EN_msgs } from '../locales/en/msgs';
import { Units_en } from '../locales/en/units';
import { Common_fa } from '../locales/fa/common';
import { FA_LANG_INFO } from '../locales/fa/info';
import { FA_msgs } from '../locales/fa/msgs';
import { Units_fa } from '../locales/fa/units';
import { StrongFBTransmitService } from './StrongFB-transmit.service';



@Injectable({
    providedIn: 'root'
})
export class StrongFBLocaleService<CN extends string = string> {

    protected lang: AvailableLanguage = 'en';
    protected localStorageKey = '_lang_';
    protected langInfo: LanguageInfo;
    protected namespaces: Map<LocaleNamespace, object>;
    protected direction$ = new BehaviorSubject<Direction>('rtl');
    private requiredNamespaces: LocaleNamespace[] = ['common', 'units', 'info', 'msgs'];
    protected allLoadedNamespaces: { [k in AvailableLanguage]: { [k1 in LocaleNamespace]: { [k2: string]: string } } } = {
        fa: {
            common: Common_fa,
            units: Units_fa,
            info: FA_LANG_INFO as any,
            msgs: FA_msgs,
        },
        en: {
            common: Common_en,
            units: Units_en,
            info: EN_LANG_INFO as any,
            msgs: EN_msgs,
        }

    };// = ['units', 'common'];
    protected allCustomLocales: CustomLocales;


    public languageChanged = new BehaviorSubject<AvailableLanguage>(undefined);

    /*************************************************************** */
    constructor(private transmit: StrongFBTransmitService) {
        // =>load default lang
        if (this.getLocalStorageLang()) {
            this.setLang(this.getLocalStorageLang());
        }
    }
    /*************************************************************** */
    async setLang(lang: AvailableLanguage | null) {
        // =>check if lang is available
        if (lang && AvailableLanguages.includes(lang)) {
            SFB_info('change system lang:', lang);
            this.lang = lang;
            // =>get lang info
            // this.langInfo = (await import('../locales/' + this.lang + '/info')).LANG_INFO;
            this.langInfo = this.allLoadedNamespaces[this.lang].info as any;
            // =>change dir of html tag
            setTimeout(() => {
                document.getElementsByTagName('html')[0].setAttribute('dir', this.langInfo.direction);
                document.getElementsByTagName('html')[0].setAttribute('lang', this.langInfo.code);
                // =>emit new direction
                this.direction$.next(this.langInfo.direction);
            }, 50);
            // =>set lang in local storage
            localStorage.setItem(this.localStorageKey, this.lang);
        }
        this.namespaces = new Map<LocaleNamespace, object>();
        // =>load required namespaces
        for (const namespace of this.requiredNamespaces) {
            await this.loadNamespace(namespace);

        }
        this.languageChanged.next(this.lang);
        // =>load default font
        // this.setMainFont();
    }
    /*************************************************************** */

    setConfigs(options: { customLocales: CustomLocales }) {
        this.allCustomLocales = options.customLocales;
    }
    /*************************************************************** */
    get direction(): BehaviorSubject<Direction> {
        // =>return observe of direction
        return this.direction$;
    }
    /*************************************************************** */
    getLangInfo(): LanguageInfo {
        return this.langInfo;
    }
    /*************************************************************** */
    getLocalStorageLang(): AvailableLanguage {
        let lang = localStorage.getItem(this.localStorageKey) as AvailableLanguage;
        if (lang && AvailableLanguages.includes(lang)) {
            return lang;
        }
        return undefined;
    }
    /*************************************************************** */
    async setMainFont(fontName: string | null = null) {
        // =>if not set user font, set default font of lang
        if (this.langInfo && !fontName) { fontName = this.langInfo.defaultFontName; }
        if (!fontName) { return; }
        // =>inject font to web
        const font = document.createElement('style');
        font.appendChild(document.createTextNode(`\
    @font-face {\
        font-family: main-font;\
        src: url(/assets/fonts/${fontName}/${fontName}.ttf) format('truetype');\
    }\
    `));
        // font.innerHTML = `\
        //  @font-face {\
        //     font-family: main-font;\
        //      src: url(/assets/fonts/${fontName}/${fontName}.ttf) format('truetype');\
        //  }\
        //  `;
        SFB_info('loading font for web:', fontName);
        document.head.appendChild(font);
    }
    /*************************************************************** */
    // async loadCustomNamespace(namespace: CN) {
    //     return await this._loadNamespace(namespace, this.customLocalesPath);
    // }
    /*************************************************************** */
    async loadNamespace(namespace: LocaleNamespace): Promise<boolean> {
        // return await this._loadNamespace(namespace, '../locales/');
        this.namespaces.set(namespace, this.allLoadedNamespaces[this.lang][namespace]);
        return true;
    }
    /*************************************************************** */

    async _loadNamespace(namespace: string, localesPath: string): Promise<boolean> {
        try {
            if (!this.namespaces) { return false; }
            // =>check if namespace loaded before
            if (this.namespaces.has(namespace as any)) { return true; }
            // =>import namespace file
            const keyValues = await import(localesPath + this.lang + '/' + namespace);
            this.namespaces.set(namespace as any, keyValues.LANG);
            return true;
        } catch (e) {
            SFB_warn('not found locale namespace', e);
            return false;
        }
    }
    /*************************************************************** */
    /**
     * used for custom locales
     * @param customNamespace 
     * @param key 
     * @param params 
     */
    __(customNamespace: CN, key: string, params?: object) {
        // =>check exist namespace
        if (!this.allCustomLocales || !this.allCustomLocales[this.lang] || !this.allCustomLocales[this.lang][customNamespace]) {
            return key;
        }
        // =>get value of key
        let text = this.allCustomLocales[this.lang][customNamespace][key];
        // =>in not exist, check in common namespace
        if (!text && this.allCustomLocales[this.lang]['common']) {
            text = this.allCustomLocales[this.lang]['common'][key];
        }
        // =>if must replace values in translate text
        if (text && params) {
            text = replaceByRegex(text, params);
        }
        return text ? text : key;
    }
    /*************************************************************** */
    trans(namespace: LocaleNamespace, key: string, params?: object): string {
        // =>check exist namespace
        if (!this.namespaces || !this.namespaces.has(namespace)) {
            SFB_warn('not found locale namespace', namespace);
            return key;
        }
        // =>get value of key
        let text = this.namespaces.get(namespace)[key] as (string | undefined);
        // =>in not exist, check in common namespace
        if (!text && this.namespaces.has('common')) {
            text = this.namespaces.get('common')[key] as (string | undefined);
        }
        // =>if must replace values in translate text
        if (text && params) {
            text = replaceByRegex(text, params);
        }
        return text ? text : key;
    }
    /*************************************************************** */
    // msg(key: string, mode: NotificationMode = 'error', values?: object): { text: string; description?: string; } {
    //     // =>check msgs namespace loaded
    //     if (!this.namespaces || !this.namespaces.has('msgs')) {
    //         return {
    //             text: key,
    //         };
    //     }
    //     // =>get text message value of key
    //     let text = this.namespaces.get('msgs')[mode][key] as (string | undefined);
    //     // =>get description message value of key
    //     let description = this.namespaces.get('msgs')[mode][key + '_des'] as (string | undefined);
    //     // =>if must replace values in translate text
    //     if (text && values) {
    //         text = replaceByRegex(text, values);
    //     }
    //     if (description && values) {
    //         description = replaceByRegex(description, values);
    //     }
    //     // =>if not text message
    //     if (!text) {
    //         text = key;
    //     }

    //     return {
    //         text,
    //         description,
    //     };

    // }
    /*************************************************************** */
    // notify(key: string, values?: object): string {
    //     return this.trans('notification', key, values);
    // }
    /*************************************************************** */
    async getDateMoment(date?: Date) {
        const cal = this.getDateCalendar();
        return new Promise((res) => {
            if (cal === 'jalali') {
                import('jalali-moment').then(jalaliMoment => {
                    res(jalaliMoment['default'](date));
                });
            } else {
                import('moment').then(moment => {
                    res(moment['default'](date));
                });
            }
        });
    }
    /*************************************************************** */
    getDateCalendar(): LocaleCalendar {
        return this.langInfo.calendar ?? 'gregorian';
    }
    /*************************************************************** */
    async dateFormat(format: string, date?: Date): Promise<string> {
        // =>if date not defined, use now datetime
        if (!date) { date = new Date(); }
        // =>if format not defined, return!
        if (format === undefined || format === null) {
            return String(date);
        }

        let timeString;
        if (this.lang === 'fa') {
            // =>function that add 'j' to any token of text
            const replaceWithJ = (text: string, token: string): string => {
                const regex = new RegExp(`\\W${token}\\W`, 'g');
                const matches = text.match(regex);
                if (!matches) { return text; }
                for (const match of matches) {
                    const len = match.length;
                    text = text.replace(match, match[0] + 'j' + match.substr(1, len - 2) + match[len - 1]);
                }
                return text;
            };
            // =>add 'j' to all tokens
            const tokens = ['MMMM', 'MMM', 'MM', 'M', 'DDDD', 'DDD', 'DD', 'D', 'YYYY', 'YY'];
            format = ' ' + format + ' ';
            for (const token of tokens) {
                format = replaceWithJ(format, token);
            }
        }
        // =>create moment object by lang
        timeString = await this.getDateMoment(date);
        // log('date format:', format);
        timeString = timeString.locale(this.lang);
        // =>format as determine time
        return timeString.format(format.trim());
    }
    /*************************************************************** */
    getDateTimeFormat(date: number | string, format = "DD MMMM") {
        return this.dateFormat(format, new Date(date));
    }
    /*************************************************************** */
    humanlySize(bytes: number): string {
        return convertBytesToHumanly(bytes, [
            this.trans('units', 'bytes'),
            this.trans('units', 'kb'),
            this.trans('units', 'mb'),
            this.trans('units', 'gb'),
            this.trans('units', 'tb'),
            this.trans('units', 'pb'),
        ]);
    }
    /*************************************************************** */
    humanlyTime(seconds: number): string {
        const time = convertSecondsToHumanly(seconds);
        // =>weeks
        if (time.unit === 'w') {
            return this.trans('units', 'weeks_n', { n: time.time });
        }
        // =>days
        if (time.unit === 'd') {
            return this.trans('units', 'days_n', { n: time.time });
        }
        // =>hours
        if (time.unit === 'h') {
            return this.trans('units', 'hours_n', { n: time.time });
        }
        // =>minutes
        if (time.unit === 'm') {
            return this.trans('units', 'minutes_n', { n: time.time });
        }
        // =>seconds
        return this.trans('units', 'seconds_n', { n: time.time });
    }
    /*************************************************************** */
    /**
     * get an object (multi language) and return a property by lang code (fa, en)
     * @param obj
     * @returns
     */
    getObjectByCode<T = string>(obj: any): T {
        if (!this.langInfo) return undefined;
        return obj[this.langInfo.code] as T;
    }
}