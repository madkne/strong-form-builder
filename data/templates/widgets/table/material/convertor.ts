import { TableColumnMapValueType } from "./table-interfaces";
import { TableColumnAction, TableSchema } from "./table-interfaces";


export function refreshTable(tableRef) {
    if (!tableRef) return;
    tableRef.renderRows();
}

export function extraNormalizeSchema(schema: TableSchema) {



    return schema;
}

export function normalizeActions(actions: TableColumnAction[]) {
    // =>normalize status 
    for (const act of actions) {
        act.status = normalizeColor(act.status) as any;
    }
    return actions;
}

export function normalizeTagColumn(tags: TableColumnMapValueType, type: 'tag' | 'tagsList') {
    if (typeof tags !== 'string' && !Array.isArray(tags) && type === 'tag') {
        tags.status = normalizeColor(tags.status) as any;
    } else if (typeof tags !== 'string' && Array.isArray(tags) && type === 'tagsList') {
        for (const tag of tags) {
            tag.status = normalizeColor(tag.status) as any;
        }
    }
    return tags;
}


/**************************************** */
function normalizeColor(color: string) {
    if (color == 'basic') color = undefined;
    if (color == 'info') color = 'primary';
    if (color == 'danger' || color == 'warning') color = 'warn' as any;
    if (color == 'success') color = 'accent' as any;

    return color;
}