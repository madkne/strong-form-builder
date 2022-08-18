
import { Injectable, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { StrongFBFormClass } from '../common/StrongFB-base';
import { StrongFBConfigOptions, StrongFBDialogAction } from '../common/StrongFB-interfaces';
import { StrongFBDialogComponent } from '../widgets/dialog/dialog.component';
import { StrongFBHttpService } from './StrongFB-http.service';
import { StrongFBLocaleService } from './StrongFB-locale.service';

@Injectable({
    providedIn: 'root'
})
export class StrongFBService {
    protected _viewContainerRef: ViewContainerRef;
    protected _scripts: { src: string; loaded?: boolean; }[] = [];

    protected defaultOptions: StrongFBConfigOptions = {
        localStorageTokenKey: 'access_token',
        localStorageRefreshTokenKey: 'refresh_token',
        apiEndPoint: 'http:localhost:8081/api',
        authenticationHeaderName: 'Authentication',
        loginUrl: '/login',
        getRefreshTokenApi: async (http: StrongFBHttpService) => {
            return {
                access_token: '',
                refresh_token: '',
            }
        },
        language: 'en',
        viewContainerRef: null,
    }
    /********************************* */

    constructor(
        protected _http: StrongFBHttpService,
        protected _router: Router,
        protected _locale: StrongFBLocaleService,
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
        let formInstance = new form(this._http, this, {
            rtl: this._locale.getLangInfo()?.direction === 'rtl',
            initData: data,
        }) as StrongFBFormClass;

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
    loadScript(src: string) {
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

}