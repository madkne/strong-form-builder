# Form Base

every form that you created, must be extend from `StrongFBFormClass` class.

this is form base class with some generics, methods and tricks!

## Generics

all generics are optional. but recommend to fill them and be on the way!


| **name** | **extend** | **default** | **description** |
|-------|-------|------|------|
|WIDGET | string | string | all widgets that used (most with methods)|
|FORM_FIELDS | object | object | for form fields (update, get values, set names) |
|INIT_FIELDS| object | FORM_FIELDS | for send fields to another form and get them into the form |
|CUSTOM_LOCALES | string | string | all custom locales that used in all forms of the project |

## Methods

### `onInit` method

`onInit` method is a method that automatically calls on startup of form by **StrongFB**. (call after layout complete)

so you can do your initial stuff on it. like call api or fill fields.

### `findWidgetByName` method

```ts
findWidgetByName<WIDGET_HEADER extends StrongFBBaseWidgetHeader = StrongFBBaseWidgetHeader>(name: WIDGET): WIDGET_HEADER
```

find a widget before used and init by its function name.

used for find a widget by its name. all widgets has `name()` method to set name.

?> in default, when you use a widget in a function, function name set as name of the main widget that used on it.

### `updateFormFields`  method
```ts
updateFormFields(fields: FORM_FIELDS)
```

used for update fields of your form field.

this update not effect on form field values!

### `formFieldValues` method

```ts
formFieldValues(): FORM_FIELDS
```

just return all form field values as a object.

used like for onclick of submit button.

### `notify` method

```ts
notify(text: string, mode: NotifyMode = 'info', timeout = 3000, cssAnimationStyle: 'fade' | 'zoom' | 'from-right' | 'from-top' | 'from-bottom' | 'from-left' = 'fade')
```

if you want to notification to user. you can use this.

### `confirm` method

```ts
async confirm(title: string, text: string): Promise<boolean> 
```

get title and text to show to user and pass you a boolean.

?> if you need to more customize confirm or prompt, you can call `confirm` method of `StrongFBService`.

### `propmt` method

```ts
async prompt(title: string, text: string, defaultValue?: string): Promise<string>
```

get title and text to show to user and pass you a string as user answer.

### `__` method

```ts
__(key: string, params?: object)
```

used for translate phrases like:

```ts
return new StrongFBButtonWidget().name('loginButton').text(this.__('login'))
```

### `layoutBuilder` method

return a instance of `StrongFBLayoutBuilder`

### `injectService` method

```ts
injectService<R = any ,T = string>(name: T): R
```

get a service name (before add it into configs) and pass you the service instance.



## Variables


### `layout` getter

this getter must be **override** in your form. and define a layout for your form that returns a `StrongFBLayoutBuilder` class.

### `http` getter

pass you an instance of `StrongFBHttpService` service to call APIs.

### `locale` getter

pass you an instance of `StrongFBLocaleService` service to call locale methods.


### `service` getter

pass you an instance of `StrongFBService` service to call common methods.


### `initialData` getter

pass you an object with type `INIT_FIELDS`. initial fields that passed by another form to this form.

### `defaultLocaleNamespace` variable

if you use custom locales in the form, you can use this variable to set default namespace used for translate phrases.

for example in a login form, you use from 'login' namespace (before defined in custom locales configs) and translate all phrases with 'login' or 'common' namespaces.

this variable effects on `__` method.
