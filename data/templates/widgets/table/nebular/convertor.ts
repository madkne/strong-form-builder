import { TableColumnMapValueType } from "../table-interfaces";
import { TableSchema, TableColumnAction } from "./table-interfaces";

export function refreshTable(tableRef) {
    //nothing to do!
}

export function extraNormalizeSchema(schema: TableSchema) {

    return schema;
}

export function normalizeActions(actions: TableColumnAction[]) {

    return actions;
}

export function normalizeTagColumn(tags: TableColumnMapValueType, type: 'tag' | 'tagsList') {
    return tags;
}