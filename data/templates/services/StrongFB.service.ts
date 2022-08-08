
import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';
import { Router } from '@angular/router';

import { StrongFBFormClass } from '../common/StrongFB-base';
import { StrongFBHttpService } from './StrongFB-http.service';

@Injectable({
    providedIn: 'root'
})
export class StrongFBService {
    constructor(
        protected _http: StrongFBHttpService,
        protected _router: Router,
    ) {

    }
    // async loadFormOnNgContainer(container: ViewContainerRef: form: StrongFBBase) {

    // }
    /**
     * create an instance from your form class
     * @param form your page form that extends from StrongFBBase
     * @returns 
     */
    async loadFormClass(form: any): Promise<StrongFBFormClass> {
        let formInstance = new form(this._http, this);

        return formInstance;
    }

    goToPage(path: string) {
        return this._router.navigateByUrl(path);
    }


}