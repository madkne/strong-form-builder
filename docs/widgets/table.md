# Table Widget

## Introduction

table widget features:

1. load rows by API
2. supports pagination
3. supports custom column data types (like tag)
4. supports actions
5. supports add dynamic actions (by API)
6. supports select rows


## methods

### `columns` method

```ts
columns(columns: TableColumn<COL>[])
```

you can define your table columns by it.
for example:
```ts
new StrongFBTableWidget<TableColumns>().columns([
    { name: 'index', title: '#' },
    { name: 'pid', title: 'Process ID' },
    { name: 'workflow', title: 'Workflow' },
    { name: 'current_state', title: 'State', type: 'tag' },
    { name: 'options', title: 'Options', type: 'actions' },
    { name: 'actions', title: 'Actions', type: 'actions' },
])
```

> also you can define your mapping function as `mapValue` property instead of call `mapColumnValue` method for a column.

### `mapColumnValue` method

```ts
mapColumnValue<T = TableColumnMapValue>(column: COL, map: TableColumnMapValue<T>)
```

define a map function for a column.

> if a column does not exists, create it, but with `string` type.

in callback function pass these parameters:

- row : an object represents current row
- index: index of the row in all rows list
- self: the instance of current table widget class (you can call another method of table widget, with `self`)

?> in default, `this` points to parent form class instance.

### `mapActionsColumn` method

```ts
mapActionsColumn(column: COL, actions: TableColumnAction<ROW>[])
```

used for map actions type of column

if not exist column, create it!

TODO:

### `mapDynamicActionsColumn` method

```ts
mapDynamicActionsColumn(column: COL, fetch: TableColumnDynamicActionsType<ROW>)
```
used for dynamic map actions type of column (add dynamically actions)

if not exist column, create it!


TODO:

### `loadRowsByApi` method

```ts
loadRowsByApi(options: APIRequest, response?: TableLoadRowsResponse<ROW>)
```

?> in default, table widget works with `StrongFBHttpService` for call APIs.

you must one parameter and one optional parameter:

- **options** (*required*) this parameter is in type `APIRequest` and you can set `method`, `path` and other need properties.

- **response** if your API response needs to parse and can not be used directly, you can use this parameter to map your response to an Array of objects (as rows)

for example:

```ts
.loadRowsByApi({
    path: '/workflow/list',
    method: 'GET'
}, (res, err) => {
    if (err) {
        console.warn('error:', err);
        return [];
    }
    console.log('res:', res['data'])
    return res['data'];
})
```
in this example, you can not use directly API response and must to map it and return its `data` property. (also you can manage any error of API response here)


### `mapPaginationByApi` method

```ts
mapPaginationByApi(pagination: TableMapApiPagination)
```

when you can use this method, that call `loadRowsByApi` method also. 
and your API, support pagination feature.

you must pass an object as parameter. 


- **pageSize** you can set you custom page size. (default 10)
- **pageCountResponse** field name in api response like 'meta.pagination.count' (**required**)
- **pageSizeParam** page size in api param. like `http://api.com/my-api?page_size=10` (default `page_size`)
- **pageParam** page in api param. like `http://api.com/my-api?page=1` (default `page`)


### `updateRows` method

```ts
updateRows()
```

when call it, just refresh all rows.


### `selectable` method

```ts
selectable(selectable: TableSelectable<ROW>)
```

if you want to enable selecting rows, use this method.

you must declare a **callback** when row selected and **rowKey** function for calculate signature of every row.

you can also define limit for selected rows count (zero is unlimited)

and also you can select some rows on initial of table.

```ts
export interface TableSelectable<ROW extends object = object> {
    callback: TableSelectableCallback<ROW>;
    rowKey: (row: ROW, self?: StrongFBTableWidget) => string;
    multiple?: boolean;
    limit?: number;
    selectedRows?: ROW[];
}
```

