import { APIRequest } from "../../common/StrongFB-interfaces";
import { StrongFBJsonApiRequestSchema } from "../../common/StrongFB-interfaces";
import { StrongFBJsonApiRequest } from "../../common/StrongFB-json-api-request";
export interface JsonTableSchema<
  COL extends string = string,
  ROW extends object = object
> {
  columns?: TableColumn<COL, ROW>[];
  loadRowsByApi?: {
    options: APIRequest;
    /**
     * like 'data' property that real data items on it
     */
    responseKey?: string;
    request?: any; //(req: APIRequest<ROW>, page?: number) => Promise<APIResponse<ROW[]>> | Promise<ROW[]>;
  };
  mapApiPagination?: TableMapApiPagination;
}

export interface TableTagColumnMapValue {
  value: string;
  /**
   * @default basic
   */
  status?: "basic" | "primary" | "info" | "success" | "warning" | "danger";
}

export type TableColumnMapValueType =
  | string
  | TableTagColumnMapValue
  | TableTagColumnMapValue[];

export type TableColumnMapValue<
  T = TableColumnMapValueType,
  R extends object = object
> = (row?: R, index?: number, self?: any) => Promise<T> | T;

export interface TableColumn<
  N extends string = string,
  R extends object = object
> {
  name: N;
  title?: string;
  /**
   * @default string
   */
  type?: "string" | "actions" | "tag" | "tagsList" | "selectRow";
  /**
   * normalize value of row for this column
   * not exist for 'actions' type
   */
  mapValue?: TableColumnMapValue<TableColumnMapValueType, R>;

  hasSort?: boolean;
}

export interface TableLoadByApi<
  ROW extends object = object,
  COL extends string = string,
  BODY_REQUEST = any,
  RESPONSE = ROW[]
> {
  //   prepareRequest?: StrongFBJsonApiRequest;
  callRequest?: StrongFBJsonApiRequest;
  /**
   * like 'data' property that real data items on it
   */
  responseKey?: string;
  //   prepareRows?: StrongFBJsonApiRequestSchema;
}

export interface TableMapApiPagination {
  /**
   * @default 10
   */
  pageSize?: number;
  /**
   * field name in api response like 'meta.pagination.count'
   */
  pageCountResponse: string;
  /**
   * page size in api param
   * @default page_size
   */
  pageSizeParam?: string;
  /**
   * page in api param
   * @default page
   */
  pageParam?: string;

  /**
   * auto filled
   * no need to filled!
   */
  __pageCountResponse?: number;
}
