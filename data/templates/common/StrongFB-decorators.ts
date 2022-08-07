import { SFB_info } from "./StrongFB-common";


export function StrongFBWidget(target: object, propertyKey: string | symbol, descriptor: PropertyDescriptor) {
    let method = descriptor.value;

    // console.log(`Here for descriptor ${propertyKey} with param `, method, descriptor);
    // descriptor.value = function (...args: any[]) {
    //     let widget = method.apply(this, args);
    //     SFB_info('used a widget:', widget, this, args, method);
    //     // this.usedWidgets.push(widget);
    // }
    return descriptor;
}