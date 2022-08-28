# Select Widget

## Introduction

you can use select box with multiple selection support. and you can load options by Api.
sample code:

```ts
new StrongFBSelectWidget().formFieldName('category_uuid').loadOptions(async () => {
    let res = await this.http.get('learning/category/')
    var categoryList = res.result.data.map(item => ({
        text: item.title,
        value: item.uuid
    }))
    return categoryList
}).fullWidth().multiple(true).change((event, selected)=>{
    console.log('selected:', selected)
})

```

## methods

### `options` method

```ts
 options(options: string[] | SelectOption[]) 
```

you can pass static options on select widget.

### `loadOptions` method

```ts
loadOptions(load: SelectLoadOptions) 
```

you can pass options dynamically with a callback function. also you can call Api on it.


```ts
export type SelectLoadOptions = (self?: StrongFBSelectWidget) => Promise<SelectOption[]> | SelectOption[];
```

### `change` method

```ts
change(change: SelectChangeEvent)
```

when a value selected in select widget, callback function of this method raised.
