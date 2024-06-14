import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";

import {
  JsonTableSchema,
  TableColumn,
  TableColumnMapValue,
  TableLoadByApi,
  TableMapApiPagination,
} from "./table-interfaces";

export class StrongFBTableWidget<
  COL extends string = string,
  ROW extends object = object
> extends StrongFBBaseWidgetHeader<JsonTableSchema<COL>> {
  protected override _schema: JsonTableSchema<COL> = {};

  override get widgetName(): string {
    return "table";
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
  mapColumnValue<T = TableColumnMapValue>(
    column: COL,
    map: TableColumnMapValue<T, ROW>
  ) {
    if (!this._schema.columns) this._schema.columns = [];
    // =>find column by name
    let columnObject = this._schema.columns?.find((i) => i.name === column);
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

  loadTableByApi<BODY_REQUEST = {}, RESPONSE = ROW[]>(
    options: TableLoadByApi<ROW, COL, BODY_REQUEST, RESPONSE>
  ) {
    if (!options) return this;
    this._schema.loadRowsByApi = {
      options: { method: "GET", path: "/" },
      request: options.callRequest
        ? options.callRequest.toJson()
        : (undefined as any),
      responseKey: options.responseKey,
    };
    return this;
  }

  mapPaginationByApi(pagination: TableMapApiPagination) {
    this._schema.mapApiPagination = pagination;
    return this;
  }

  /********************************* */
  /*************EVENTS************** */
  /********************************* */
  // click(click: StrongFBJsonApiRequest) {
  //     this._schema.click = click.toJson();
  //     return this;
  // }
}
