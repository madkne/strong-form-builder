
import { APIRequest } from "../../common/StrongFB-interfaces";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { TableColumn, TableColumnAction, TableColumnDynamicActionsType, TableColumnMapValue, TableLoadRowsResponse, TableMapApiPagination, TableNotFound, TableSchema, TableSelectable, TableSelectableCallback } from "./table-interfaces";
import { StrongFBTabledWidgetComponent } from "./table.component";
import { BehaviorSubject } from 'rxjs';




/**
 * table widget
 * @summary table widget with pagination
 */
export class StrongFBTableWidget<COL extends string = string, ROW extends object = object> extends StrongFBBaseWidgetHeader<TableSchema<COL>> {

    private _updateRows$ = new BehaviorSubject<boolean>(true);
    protected override _schema: TableSchema<COL> = {};

    override get component(): any {
        return StrongFBTabledWidgetComponent;
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

    loadRowsByApi(options: APIRequest, response?: TableLoadRowsResponse<ROW>) {
        this._schema.loadRowsByApi = {
            options,
            response: response ? response : (rep, err) => {
                if (err) return [];
                if (Array.isArray(rep)) return rep;
                return [];
            },
        };
        return this;
    }

    mapPaginationByApi(pagination: TableMapApiPagination) {
        this._schema.mapApiPagination = pagination;
        return this;
    }

    updateRows() {
        this._updateRows$.next(true);
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



}