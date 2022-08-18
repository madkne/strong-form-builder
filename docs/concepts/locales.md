# Localization


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