
import { Injectable, ViewContainerRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';

import { StrongFBFormClass } from '../common/StrongFB-base';
import { CustomFontPackInterface, StrongFBConfigOptions, StrongFBDialogAction, StrongFBFormOptions, StrongFBJsonFormSchema } from '../common/StrongFB-interfaces';
import { StrongFBDialogWidgetComponent } from '../widgets/dialog/dialog.component';
import { StrongFBHttpService } from './StrongFB-http.service';
import { StrongFBLocaleService } from './StrongFB-locale.service';
import { Notify } from 'notiflix/build/notiflix-notify-aio';
import { Confirm, IConfirmOptions } from 'notiflix/build/notiflix-confirm-aio';

import { NotifyCssAnimationStyle, NotifyMode } from '../common/StrongFB-types';
import { StrongFBHelper } from '../StrongFB-helpers';
import { StrongFBTransmitService } from './StrongFB-transmit.service';
import { checkAndDoByInterval, clone } from '../common/StrongFB-common';

@Injectable({
    providedIn: 'root'
})
export class StrongFBService {
    protected _configsLoaded = false;
    protected _viewContainerRef: ViewContainerRef;
    protected _scripts: { src: string; loaded?: boolean; }[] = [];
    protected _assetsBaseUrl: string;
    protected _darkTheme: boolean;
    protected _injectServices: { [k: string]: any } = {};
    protected _defaultLocaleNamespace: string;
    protected _defaultFontFamily: string;
    protected _customFontPack: CustomFontPackInterface;

    protected defaultOptions: StrongFBConfigOptions = {
        localStorageTokenKey: 'access_token',
        localStorageRefreshTokenKey: 'refresh_token',
        apiEndPoint: 'http:localhost:8081/api',
        authenticationHeaderName: 'Authentication',
        loginUrl: '/login',
        fontFamily: 'sans-serif',
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
    config(options?: StrongFBConfigOptions) {
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
        // =>set default locale
        this._defaultLocaleNamespace = options.defaultLocaleNamespace;
        // =>set service options
        this._viewContainerRef = options.viewContainerRef;
        this._defaultFontFamily = options.fontFamily;
        this._assetsBaseUrl = options.assetsBaseUrl;
        this._darkTheme = options.darkTheme;
        this._injectServices = options.injectServices;
        this._configsLoaded = true;
        this._customFontPack = options.customFontPack;
    }
    /********************************* */
    get configLoaded() {
        return this._configsLoaded;
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
        const formInstance = () => {
            let formInstance = new form(
                this._http,
                this,
                this._transmit,
                {
                    rtl: this._locale.getLangInfo()?.direction === 'rtl',
                    initData: data,
                    defaultLocaleNamespace: this._defaultLocaleNamespace,
                },
            ) as StrongFBFormClass;
            return formInstance;
        }
        if (this._configsLoaded) {
            return formInstance();
        } else {
            return await checkAndDoByInterval(
                () => this._configsLoaded,
                formInstance,
                2
            );
        }
    }
    /********************************* */
    goToPage(path: string) {
        return this._router.navigateByUrl(path);
    }
    /********************************* */
    /**
     * use instead 'dialogBox' method
     * @deprecated
     * @param form 
     * @param options 
     * @returns 
     */
    async dialog<T extends object = object>(form: any, options: {
        title?: string;
        description?: string;
        html?: string;
        actions?: StrongFBDialogAction[],
        data?: T,
        minWidth?: string;
    } = {}) {
        // =>create instance of form
        let formInstance: StrongFBFormClass;
        if (form) {
            formInstance = await this.loadFormClass(form, options.data);
        }
        // =>init dialog component
        let component = this._viewContainerRef.createComponent(StrongFBDialogWidgetComponent);
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
        if (options.minWidth) {
            component.instance['minWidth'] = options.minWidth;
        }
        // if (options.data) {
        //     component.instance['initialData'] = options.data;
        // }
        return component;
    }
    /********************************* */
    async dialogBox<SEND_DATA extends object = object, ACTION_FORM extends object = {}>(options: {
        form?: any;
        title?: string;
        description?: string;
        html?: string;
        actions?: StrongFBDialogAction<ACTION_FORM>[],
        data?: SEND_DATA,
        minWidth?: string;
        styles?: object;
    }) {
        // =>create instance of form
        let formInstance: StrongFBFormClass;
        if (options.form) {
            formInstance = await this.loadFormClass(options.form, options.data);
        }
        // =>init dialog component
        let component = this._viewContainerRef.createComponent(StrongFBDialogWidgetComponent);
        component.instance['form'] = formInstance;
        component.instance['widgetForm'] = options.form;
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
        if (options.minWidth) {
            component.instance['minWidth'] = options.minWidth;
        }
        if (options.styles) {
            component.instance['styles'] = options.styles;
        }
        // if (options.data) {
        //     component.instance['initialData'] = options.data;
        // }
        return component.instance;
    }
    /********************************* */
    async loadDynamicComponent(container: ViewContainerRef, component: any, data?: object) {
        let componentInstance = await container.createComponent(component);
        if (data) {
            for (const key of Object.keys(data)) {
                componentInstance.instance[key] = data[key];
            }
        }
        return componentInstance;
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
                script.referrerPolicy = "origin";
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
                fontFamily: this._defaultFontFamily,
            });
        } else {
            Notify[options.mode](options.text, {
                cssAnimationStyle: options.cssAnimationStyle,
                timeout: options.timeout,
                rtl: options.rtl,
                clickToClose: options.clickToClose,
                fontFamily: this._defaultFontFamily,
            });
        }

    }
    /********************************* */
    confirm(options: {
        title: string;
        text: string;
        rtl?: boolean;
        width?: string;
        type?: 'confirm' | 'prompt';
        messageMaxLength?: number;
        cssAnimationStyle?: NotifyCssAnimationStyle;

        okButtonText?: string;
        cancelButtonText?: string;
        okButtonCallback?: (value?: string) => void;
        cancelButtonCallback?: (value?: string) => void;
        inputPlaceholder?: string;
    }) {
        // =>set defaults
        if (!options.messageMaxLength) options.messageMaxLength = 110;
        if (!options.width) options.width = '300px';
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
            width: options.width,
            messageMaxLength: options.messageMaxLength,
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
            Confirm.prompt(
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
    /********************************* */
    async loadJsonForm(jsonForm: StrongFBJsonFormSchema, data?: object, options: { baseApiUrl?: string } = {}) {
        let formOptions: StrongFBFormOptions = {
            rtl: this._locale.getLangInfo()?.direction === 'rtl',
            initData: data,
            defaultLocaleNamespace: this._defaultLocaleNamespace,

        };
        if (options?.baseApiUrl) {
            formOptions.baseAPIUrl = options.baseApiUrl;
        }
        let form = new StrongFBFormClass(this._http, this, this._transmit, formOptions);
        // =>set layout
        form.importedLayout = () => {
            let json = clone(jsonForm);
            let layout = form.layoutBuilder();
            // =>if exist form layout
            if (json?.form?.layout) {
                layout.loadSchemaByJson(json.form.layout);
            }
            return layout;
        }

        return form;
    }
}