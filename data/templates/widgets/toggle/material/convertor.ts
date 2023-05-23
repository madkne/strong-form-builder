import { ToggleSchema } from './toggle-interfaces';


export function extraNormalizeSchema(schema: ToggleSchema) {
    // =>normalize status 
    if (schema.status == 'basic') schema.status = undefined;
    if (schema.status == 'info') schema.status = 'primary';
    if (schema.status == 'danger' || schema.status == 'warning') schema.status = 'warn' as any;
    if (schema.status == 'success') schema.status = 'accent' as any;


    return schema;
}