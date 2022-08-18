# StrongFB service

`StrongFBService` is important and main service of form builder that have some useful methods.

## Methods

### `config` method

```ts
config(options: StrongFBConfigOptions)
```

used for configure form builder. for more information click [here](../configs.md).


### `getUrlParam` method

```ts
getUrlParam<T = string>(key: string, def?: T)
```

used for get query parameter by key from url.

### `loadFromClass` method

```ts
async loadFormClass(form: any, data?: object): Promise<StrongFBFormClass>
```

it is an important method. when you want to initialize a form class and load it on `strong-form-builder` tag

for example:
```html
<strong-form-builder [form]="form"></strong-form-builder>
```

### `goToPage` method

```ts
goToPage(path: string)
```

used when you navigate by url.

### `dialog` method

```ts
async dialog<T extends object = object>(form: any, options: {
    title?: string;
    description?: string;
    html?: string;
    actions?: StrongFBDialogAction[],
    data?: T,
} = {})
```

used when load a form onto a dialog box.

### `locale` method

return an instance of `StrongFBLocaleService` service.

### `loadScript` method

used for load dynamically a script file.

### `notify` method

```ts
notify(options: {
    mode?: NotifyMode;
    text: string;
    callback?: () => any;
    timeout?: number;
    cssAnimationStyle?: NotifyCssAnimationStyle;
    rtl?: boolean;
    clickToClose?: boolean;
})
```
show a notification to user by `notiflix` package.


### `confirm` method

```ts
confirm(options: {
    title: string;
    text: string;
    rtl?: boolean;
    type?: 'confirm' | 'prompt';
    cssAnimationStyle?: NotifyCssAnimationStyle;

    okButtonText?: string;
    cancelButtonText?: string;
    okButtonCallback?: () => void;
    cancelButtonCallback?: () => void;
    inputPlaceholder?: string;
})
```
show a confirm or prompt to user by `notiflix` package.
