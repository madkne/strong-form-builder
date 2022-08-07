
import { ComponentFactoryResolver, Injectable, Injector } from '@angular/core';

import { StrongFBBase } from '../common/StrongFB-base';

@Injectable({
    providedIn: 'root'
})
export class StrongFBService {

    constructor(
        private componentFactoryResolver: ComponentFactoryResolver,
        private injector: Injector,
    ) { }
    // async loadFormOnNgContainer(container: ViewContainerRef: form: StrongFBBase) {

    // }


    // async loadComponent(componentName: ComponentName) {
    //     return new Promise((res) => {
    //       let setContainerInterval = setInterval(async () => {
    //         if (!this.pageContainer || !this.componentFactoryResolver) return;
    //         // =>detach all before views
    //         // for (let i = 0; i < this.pageContainer.length; i++) {
    //         //   this.pageContainer.detach(i);
    //         // }
    //         let componentClass = ComponentLookupRegistry.get(componentName);
    //         if (!componentClass) {
    //           Public.warning('not found component', componentName);
    //           clearInterval(setContainerInterval);
    //           res(undefined);
    //           return;
    //         }
    //         this.pageContainer.clear();
    //         const factory = this.componentFactoryResolver.resolveComponentFactory(componentClass);
    //         const componentInstance = this.pageContainer.createComponent(factory, 0, this.injector);

    //         clearInterval(setContainerInterval);
    //         res(componentInstance);
    //       }, 150);
    //     });
    //   }

}