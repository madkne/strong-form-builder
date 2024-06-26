
import { APIRequest, APIResponse } from "../../common/StrongFB-interfaces";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { TableColumn, TableColumnAction, TableColumnDynamicActionsType, TableColumnMapValue, TableColumnSortMode, TableLoadByApi, TableLoadRowsResponse, TableMapApiPagination, TableNotFound, TableResponsive, TableRowSetColorAction, TableSchema, TableSelectable, TableSelectableCallback } from "./table-interfaces";
import { StrongFBTableWidgetComponent } from "./table.component";
import { BehaviorSubject } from 'rxjs';




/**
 * table widget
 * @summary table widget with pagination
 */
export class StrongFBTableWidget<COL extends string = string, ROW extends object = object> extends StrongFBBaseWidgetHeader<TableSchema<COL>> {

    private _updateRows$ = new BehaviorSubject<{ resetPagination?: boolean }>({ resetPagination: true });
    protected override _schema: TableSchema<COL> = {};

    override get component(): any {
        return StrongFBTableWidgetComponent;
    }

    override get widgetName(): string {
        return 'table';
    }


    columns(columns: TableColumn<COL>[]) {
        this._schema.columns = columns;
        return this;
    }

    /**
     * 
     * you can directly define map in 'columns' function or use this method
     * if not exist column, create it!
     */
    mapColumnValue<T = TableColumnMapValue>(column: COL, map: TableColumnMapValue<T, ROW>) {
        if (!this._schema.columns) this._schema.columns = [];
        // =>find column by name
        let columnObject = this._schema.columns?.find(i => i.name === column);
        if (!columnObject) {
            this._schema.columns.push({
                name: column,
                mapValue: map as any,
            });
        } else {
            columnObject.mapValue = map as any;
        }
        return this;
    }

    // mapColumnSort<T = TableColumnMapValue>(column: COL, sort: TableColumnSortMode) {
    //     if (!this._schema.columns) this._schema.columns = [];
    //     // =>find column by name
    //     let columnObject = this._schema.columns?.find(i => i.name === column);
    //     if (!columnObject) {
    //         this._schema.columns.push({
    //             name: column,
    //             mapValue: map as any,
    //         });
    //     } else {
    //         columnObject.mapValue = map as any;
    //     }
    //     return this;
    // }
    /**
     * used for map actions type of column
     * if not exist column, create it!
     * @returns 
     */
    mapActionsColumn(column: COL, actions: TableColumnAction<ROW>[]) {
        if (!this._schema.columns) this._schema.columns = [];
        // =>find column by name
        let columnObject = this._schema.columns?.find(i => i.name === column);
        // =>if not exist, create it!
        if (!columnObject) {
            this._schema.columns.push({
                name: column,
                type: 'actions',
            });
            columnObject = this._schema.columns[this._schema.columns.length - 1];
        }
        columnObject.type = 'actions';
        // =>add actions to row
        if (!this._schema.columnActions) this._schema.columnActions = {};

        this._schema.columnActions[column] = actions;

        return this;
    }

    setRowColor(action: TableRowSetColorAction<ROW>) {
        this._schema.rowColorAction = action;
        return this;
    }
    /**
     * used for dynamic map actions type of column (add dynamically actions)
     * if not exist column, create it!
     * @param column 
     * @param fetch 
     */
    mapDynamicActionsColumn(column: COL, fetch: TableColumnDynamicActionsType<ROW>) {
        if (!this._schema.columns) this._schema.columns = [];
        // =>find column by name
        let columnObject = this._schema.columns?.find(i => i.name === column);
        // =>if not exist, create it!
        if (!columnObject) {
            this._schema.columns.push({
                name: column,
                type: 'actions',
            });
            columnObject = this._schema.columns[this._schema.columns.length - 1];
        }
        columnObject.type = 'actions';
        // =>add actions to row
        if (!this._schema.columnActions) this._schema.columnActions = {};

        this._schema.columnActions[column] = fetch;

        return this;
    }

    /**
     * use instead **'loadTableByApi'** method
     * @deprecated
     * @param options 
     * @param response 
     * @param request 
     * @returns 
     */
    loadRowsByApi(options: APIRequest, response?: TableLoadRowsResponse<ROW>, request?: (req: APIRequest<ROW>) => Promise<APIResponse<ROW[]>>) {
        this._schema.loadRowsByApi = {
            options,
            response: response ? response : (rep, err) => {
                if (err) return [];
                if (Array.isArray(rep)) return rep;
                return [];
            },
            request: request ? request : undefined,
        };
        return this;
    }

    loadTableByApi<BODY_REQUEST = {}, RESPONSE = ROW[]>(options: TableLoadByApi<ROW, COL, BODY_REQUEST, RESPONSE>) {
        if (!options) return this;
        this._schema.loadRowsByApi = {
            options: options.prepareRequest ? options.prepareRequest : { method: 'GET', path: '/' },
            response: options.prepareRows ? options.prepareRows as any : (rep, err) => {
                if (err) return [];
                if (Array.isArray(rep)) return rep;
                return [];
            },
            request: options.callRequest ? options.callRequest : undefined as any,
        };
        return this;
    }

    mapPaginationByApi(pagination: TableMapApiPagination) {
        this._schema.mapApiPagination = pagination;
        return this;
    }

    updateRows(resetPagination = true) {
        this._updateRows$.next({
            resetPagination,
        });
    }

    selectable(selectable: TableSelectable<ROW>) {
        this._schema.selectable = selectable;
        return this;
    }

    notFound(notfound?: TableNotFound) {
        this._schema.notFound = notfound;
        if (!this._schema.notFound) this._schema.notFound = {};
        return this;
    }

    responsive(options: TableResponsive) {
        this._schema.responsive = options;
        if (!this._schema.responsive.maxWidth) {
            this._schema.responsive.maxWidth = '100%';
        }
        return this;
    }


    private _loadFromJson(json: object) {
        this._schema = json as any;

    }


}