import { APIRequest } from "../../common/StrongFB-interfaces";
import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { StrongFBButtonWidget } from "../button/button.header";
import { TableColumn, TableColumnAction, TableColumnMapValue, TableLoadRowsResponse, TableSchema } from "./table-interfaces";
import { StrongFBTabledWidgetComponent } from "./table.component";
import { BehaviorSubject } from 'rxjs';





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
    mapColumnValue<T = TableColumnMapValue>(column: COL, map: TableColumnMapValue<T>) {
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
        // =>add actions to row
        if (!this._schema.columnActions) this._schema.columnActions = {};

        this._schema.columnActions[column] = actions;

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

    updateRows() {
        this._updateRows$.next(true);
    }



}