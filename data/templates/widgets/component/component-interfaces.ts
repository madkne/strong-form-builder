import { StrongFBComponentWidget } from "./component.header";

export interface ComponentInput<T = any> {
    name: string;
    value?: T;
}

export interface ComponentEvent<T = any> {
    name: string;
    callback: (event: T, self?: StrongFBComponentWidget) => any;
}

export interface ComponentSchema {
    component?: any;
    inputs?: ComponentInput[];
    events?: ComponentEvent[];
}