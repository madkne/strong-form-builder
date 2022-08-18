# Localization

## supported languages

for now we support these languages:

|**Language** | **code** | **used calendar** | **description** |
|:--------:|:---------:|:---------:|:---------:|
|English | en | gregorian | default language of form builder|
|Farsi | fa | jalali | - | 

also we used `moment` packages for support different calendars.
## Custom locales

you can define custom locales in configs. like:
```ts
this.srv.config({
    viewContainerRef: this.ServiceRef,
    apiEndPoint: SettingsService.API_ENDPOINT,
    customLocales: {
        en: {
            'login': login_LANG,
            'dashboard': dashboard_lang,
            'mini': {
                hello: 'Hello'
            }
        }
    }
});
```

?> you can define a `common` namespace in each locale, that is a fallback namespace. if not found your key in selected namespace, automatically search onto `common` namespace.


### create custom locale file

1. create a typescript file.

2. define an `export const` variable on it. (it's must be an object)

3. define your keys and values like:
```ts
export const lang = {
    "Hello World": "سلام دنیا"
};
```

you can use more advanced translation with params. define some parameters on value like:
```
activity_log_2: 'زمان به مدت :time ثبت شد',
```
`time` now is a parameter and you must set it on translating like:
```ts
let activity = this.__('activity_log_2', {time: 45});
```



4. add variable to  `customLocales` into configs.