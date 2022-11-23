import { TableSchema } from "./table-interfaces";


export function refreshTable(tableRef) {
    tableRef.renderRows();
}

export function extraNormalizeSchema(schema: TableSchema) {
    // =>normalize status 
    // if (schema.status == 'basic') schema.status = undefined;
    // if (schema.status == 'info') schema.status = 'primary';
    // if (schema.status == 'danger' || schema.status == 'warning') schema.status = 'warn' as any;
    // if (schema.status == 'success') schema.status = 'accent' as any;


    return schema;
}