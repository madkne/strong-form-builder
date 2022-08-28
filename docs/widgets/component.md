# Component Widget

## Introduction

you can show and use a custom component into your forms with this widget.

this widget get a component class and display it. you can interaction with its inputs and events.

sample code:

```ts
showBannerFile() {
    return new StrongFBComponentWidget().showByCallback(() => this.mode === 'edit').componentClass(ShowUploadedFilesComponent).input({ name: 'images', value: [this.newsData.banner] }).input({ name: 'title', value: 'banner image' })
}

```

## methods

### `componentClass` method

```ts
componentClass(classRef: any)
```
you must to call this method and pass it a component class.

### `input` method

```ts
input<T = any>(inputRef: ComponentInput<T>) 
```

you can set value on your component class properties ( variables) with it.

?> recommend that use `@Input()` for your component class properties.

you can call this method multiple for assign different component variables.

```ts
export interface ComponentInput<T = any> {
    name: string;
    value?: T;
}
```

### `event` method

```ts
event<T = any>(eventRef: ComponentEvent<T>)
```

you can set callback function on your component class events that declare with `@Output` decoration or any other of **rxjs** observable classes.

you can call this method multiple for assign callback on different component events.

```ts
export interface ComponentEvent<T = any> {
    name: string;
    callback: (event: T, self?: StrongFBComponentWidget) => any;
}
```