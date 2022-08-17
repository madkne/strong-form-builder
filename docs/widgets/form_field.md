# Form Field Widget


## Supported widgets

these widgets supported by form field widget as a field:

1. **input** `StrongFBInputWidget`
2. **textarea** `StrongFBTextAreaWidget`
3. **select** `StrongFBSelectWidget`
4. **tags list** `StrongFBTagsListWidget`
5. **radio box** `StrongFBRadioBoxWidget`
6. **file uploader** `StrongFBFileUploaderWidget`



## methods

### `field` method

```ts
field(field: FormFieldType)
```

you can add supported widgets as field in form field. like `StrongFBInputWidget`.

### `label` method

```ts
label(text: string)
```

you can set a label for your form field widget instance.

### `validator` method

```ts
validator(validator: StrongFBValidator)
```

you can define some validators for your form field.

sample validators:

```ts
validator(new StrongFBValidator().minLength(5))
```

for more information about validators, read [here](../concepts/validators.md)
