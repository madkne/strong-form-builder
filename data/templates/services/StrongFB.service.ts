
import { Injectable, ViewContainerRef } from '@angular/core';
import { Router } from '@angular/router';

import { StrongFBFormClass } from '../common/StrongFB-base';
import { StrongFBDialogAction } from '../common/StrongFB-interfaces';
import { StrongFBDialogComponent } from '../widgets/dialog/dialog.component';
import { StrongFBHttpService } from './StrongFB-http.service';

@Injectable({
    providedIn: 'root'
})
export class StrongFBService {
    protected _viewContainerRef: ViewContainerRef;
    protected _rtl = false;

    constructor(
        protected _http: StrongFBHttpService,
        protected _router: Router,
    ) {

    }

    config(options: {
        _viewContainerRef: ViewContainerRef,
        rtl?: boolean;
    }) {
        this._viewContainerRef = options._viewContainerRef;
        if (options.rtl) this._rtl = options.rtl;
    }
    // async loadFormOnNgContainer(container: ViewContainerRef: form: StrongFBBase) {

    // }
    /**
     * create an instance from your form class
     * @param form your page form that extends from StrongFBBase
     * @returns 
     */
    async loadFormClass(form: any, data?: object): Promise<StrongFBFormClass> {
        let formInstance = new form(this._http, this, {
            rtl: this._rtl,
            initData: data,
        }) as StrongFBFormClass;

        return formInstance;
    }

    goToPage(path: string) {
        return this._router.navigateByUrl(path);
    }


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


}