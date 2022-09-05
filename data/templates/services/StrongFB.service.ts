
import { Injectable, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { StrongFBFormClass } from '../common/StrongFB-base';
import { StrongFBConfigOptions, StrongFBDialogAction } from '../common/StrongFB-interfaces';
import { StrongFBDialogComponent } from '../widgets/dialog/dialog.component';
import { StrongFBHttpService } from './StrongFB-http.service';
import { StrongFBLocaleService } from './StrongFB-locale.service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Confirm, IConfirmOptions } from 'notiflix/build/notiflix-confirm-aio';

import { NotifyCssAnimationStyle, NotifyMode } from '../common/StrongFB-types';
import { StrongFBHelper } from '../StrongFB-helpers';
import { StrongFBTransmitService } from './StrongFB-transmit.service';

@Injectable({
    providedIn: 'root'
})
export class StrongFBService {
    protected _viewContainerRef: ViewContainerRef;
    protected _scripts: { src: string; loaded?: boolean; }[] = [];
    protected _assetsBaseUrl: string;
    protected _darkTheme: boolean;
    protected _injectServices: { [k: string]: any } = {};

    protected defaultOptions: StrongFBConfigOptions = {
        localStorageTokenKey: 'access_token',
        localStorageRefreshTokenKey: 'refresh_token',
        apiEndPoint: 'http:localhost:8081/api',
        authenticationHeaderName: 'Authentication',
        loginUrl: '/login',
        assetsBaseUrl: '/assets/StrongFB',
        getRefreshTokenApi: async (http: StrongFBHttpService) => {
            return {
                access_token: '',
                refresh_token: '',
            }
        },
        language: 'en',
        viewContainerRef: null,
        darkTheme: false,
        injectServices: {},
    }
    /********************************* */

    constructor(
        protected _http: StrongFBHttpService,
        protected _router: Router,
        protected _locale: StrongFBLocaleService,
        protected _activeRoute: ActivatedRoute,
        protected _transmit: StrongFBTransmitService,
    ) {

    }
    /********************************* */
    config(options: StrongFBConfigOptions) {
        if (!options) options = {} as any;
        // =>merge with default options
        for (const key of Object.keys(this.defaultOptions)) {
            if (options[key] === undefined) {
                options[key] = this.defaultOptions[key];
            }
        }

        // =>set http options
        this._http.configs({
            updateInterval: 1000,
            tokenKey: options.localStorageTokenKey,
            refreshTokenKey: options.localStorageRefreshTokenKey,
            apiEndpoint: options.apiEndPoint,
            authenticationHeaderName: options.authenticationHeaderName,
            loginPath: options.loginUrl,
            getRefreshTokenApi: options.getRefreshTokenApi,
        });
        // =>set locale options
        if (!this._locale.getLocalStorageLang()) {
            this._locale.setLang(options.language);
        }
        if (options.customLocales) {
            this._locale.setConfigs({
                customLocales: options.customLocales,
            })
        }
        // =>set service options
        this._viewContainerRef = options.viewContainerRef;
        this._assetsBaseUrl = options.assetsBaseUrl;
        this._darkTheme = options.darkTheme;
        this._injectServices = options.injectServices;

    }
    /********************************* */
    assetsUrl(path: string) {
        if (!this._assetsBaseUrl.endsWith('/')) this._assetsBaseUrl += '/';
        return this._assetsBaseUrl + path;
    }
    /********************************* */
    getUrlParam<T = string>(key: string, def?: T) {
        let value = this._activeRoute.snapshot.queryParamMap.get(key);
        if (value === undefined || value === null) return def;
        return value;
    }
    /********************************* */
    get activeRoute() {
        return this.activeRoute;
    }
    /********************************* */

    // async loadFormOnNgContainer(container: ViewContainerRef: form: StrongFBBase) {
    /********************************* */

    // }
    /**
     * create an instance from your form class
     * @param form your page form that extends from StrongFBBase
     * @returns 
     */
    async loadFormClass(form: any, data?: object): Promise<StrongFBFormClass> {
        let formInstance = new form(
            this._http,
            this,
            this._transmit,
            {
                rtl: this._locale.getLangInfo()?.direction === 'rtl',
                initData: data,
            },
        ) as StrongFBFormClass;

        return formInstance;
    }
    /********************************* */
    goToPage(path: string) {
        return this._router.navigateByUrl(path);
    }
    /********************************* */
    async dialog<T extends object = object>(form: any, options: {
        title?: string;
        description?: string;
        html?: string;
        actions?: StrongFBDialogAction[],
        data?: T,
    } = {}) {
        // =>create instance of form
        let formInstance = await this.loadFormClass(form, options.data);
        // =>init dialog component
        let component = this._viewContainerRef.createComponent(StrongFBDialogComponent);
        component.instance['form'] = formInstance;
        component.instance['widgetForm'] = form;
        if (options.title) {
            component.instance['title'] = options.title;
        }
        if (options.description) {
            component.instance['description'] = options.description;
        }
        if (options.html) {
            component.instance['html'] = options.html;
        }
        if (options.actions) {
            component.instance['actions'] = options.actions;
        }
        // if (options.data) {
        //     component.instance['initialData'] = options.data;
        // }
        return component;
    }
    /********************************* */
    locale() {
        return this._locale;
    }
    /********************************* */
    async loadScript(src: string) {
        return new Promise((resolve, reject) => {
            let scriptObject = this._scripts.find(i => i.src == src);
            if (!scriptObject) {
                this._scripts.push({
                    src,
                    loaded: false,
                });
                scriptObject = this._scripts[this._scripts.length - 1];
            }
            //resolve if already loaded
            if (scriptObject.loaded) {
                resolve(scriptObject);
            }
            else {
                //load script
                let script = document.createElement('script');
                script.type = 'text/javascript';
                script.src = src;
                if (script['readyState']) {  //IE
                    script['onreadystatechange'] = () => {
                        if (script['readyState'] === "loaded" || script['readyState'] === "complete") {
                            script['onreadystatechange'] = null;
                            scriptObject.loaded = true;
                            resolve(scriptObject);
                        }
                    };
                } else {  //Others
                    script.onload = () => {
                        scriptObject.loaded = true;
                        resolve(scriptObject);
                    };
                }
                script.onerror = (error: any) => resolve(scriptObject);
                document.getElementsByTagName('head')[0].appendChild(script);
            }
        });
    }
    /********************************* */
    notify(options: {
        mode?: NotifyMode;
        text: string;
        callback?: () => any;
        timeout?: number;
        cssAnimationStyle?: NotifyCssAnimationStyle;
        rtl?: boolean;
        clickToClose?: boolean;
    }) {
        // =>set defaults
        if (!options.mode) options.mode = 'info';
        if (!options.timeout) options.timeout = 3000;
        if (!options.cssAnimationStyle) options.cssAnimationStyle = 'fade';
        if (options.rtl === undefined) options.rtl = this.locale().getLangInfo()?.direction === 'rtl';
        if (options.clickToClose === undefined) options.clickToClose = true;
        // =>show notification
        if (options.callback) {
            Notify[options.mode](options.text, options.callback, {
                cssAnimationStyle: options.cssAnimationStyle,
                timeout: options.timeout,
                rtl: options.rtl,
                clickToClose: options.clickToClose,
            });
        } else {
            Notify[options.mode](options.text, {
                cssAnimationStyle: options.cssAnimationStyle,
                timeout: options.timeout,
                rtl: options.rtl,
                clickToClose: options.clickToClose,
            });
        }

    }
    /********************************* */
    confirm(options: {
        title: string;
        text: string;
        rtl?: boolean;
        type?: 'confirm' | 'prompt';
        cssAnimationStyle?: NotifyCssAnimationStyle;

        okButtonText?: string;
        cancelButtonText?: string;
        okButtonCallback?: (value?: string) => void;
        cancelButtonCallback?: (value?: string) => void;
        inputPlaceholder?: string;
    }) {
        // =>set defaults
        if (options.rtl === undefined) options.rtl = this.locale().getLangInfo()?.direction === 'rtl';
        if (!options.type) options.type = 'confirm';
        if (!options.cssAnimationStyle) options.cssAnimationStyle = 'fade';
        if (!options.okButtonText) options.okButtonText = this.locale().trans('common', 'ok');
        if (!options.cancelButtonText) options.cancelButtonText = this.locale().trans('common', 'cancel');

        // =>set confirm options
        let confirmOptions: IConfirmOptions = {
            rtl: options.rtl,
            cssAnimationStyle: options.cssAnimationStyle as any,
            backgroundColor: StrongFBHelper.notifyBackgroundColor(),
            messageColor: StrongFBHelper.notifyTextColor(),
            titleColor: StrongFBHelper.notifyTitleColor(),
        }
        // =>show confirm
        if (options.type === 'confirm') {
            Confirm.show(
                options.title,
                options.text,
                options.okButtonText,
                options.cancelButtonText,
                options.okButtonCallback,
                options.cancelButtonCallback,
                confirmOptions,
            );
        } else if (options.type === 'prompt') {
            Confirm.ask(
                options.title,
                options.text,
                options.inputPlaceholder,
                options.okButtonText,
                options.cancelButtonText,
                options.okButtonCallback,
                options.cancelButtonCallback,
                confirmOptions,
            );
        }
    }
    /********************************* */
    async loadStyleLink(srcUrl: string) {
        const head = document.getElementsByTagName('head')[0];
        const style = document.createElement('link');
        style.id = 'css-styling';
        style.rel = 'stylesheet';
        style.href = `${srcUrl}`;
        head.appendChild(style);
    }
    /********************************* */
    async loadStyleBlock(block: string) {
        const head = document.getElementsByTagName('head')[0];
        const style = document.createElement('style');
        style.innerHTML = block;
        head.appendChild(style);
    }

}