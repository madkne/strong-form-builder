# Dialog Sample

## description

in main form you can call `openDialog` method on a button click. and you must pass another form to open it.



## code

### `main.form.ts` file

```ts
openDialog() {
     let dialogRef = await this.service.dialog(ExecuteProcessActionForm, {
        title: act.name,
        actions: [
            {
                text: 'Apply',
                status: 'primary',
                action: async (values) => {
                    console.log('values', values);
                    // =>init form data
                    let formData = new FormData();
                    for (const key of Object.keys(values)) {
                        if (key === 'message') {
                            formData.append('message', values[key]);
                        } else {
                            formData.append(`field.${key}`, values[key]);
                        }
                    }
                    formData.append('state_action', act.name);
                    formData.append('process_id', row['_id']);
                    // =>send params by api
                    let res = await this.http.sendPromise({
                        method: 'POST',
                        path: '/workflow/action',
                        formData,
                    });
                    // =>if failed
                    if (res.error) {
                        console.log('err:', res.error)
                        this.notify(String(res.error.error['data']), 'failure');
                        return false;
                    } else {
                        this.notify(`Added new worker with id '${res.result['data']}'`, 'success');
                        return true;
                    }
                }
            },
            {
                isCancel: true,
            }
        ],
        data: { passData },
    });
    // console.log('ref:', dialogRef);
    await dialogRef.instance.open();
}
```

### `execute-process-actionForm.form.ts` file

```ts
type widgets = 'cartableTable' | 'refreshButton';

interface InitData {
    workflow_name: string;
    workflow_version: number;
    name: string;
    required_fields: string[];
    optional_fields: string[];
}

export class ExecuteProcessActionForm extends StrongFBFormClass<widgets, object, InitData> {
    required_fields: { name: string; type: 'string'; validation?: { type: string; value?: string[] | number }[] }[] = [];
    message_required = false;
    override get layout() {
        return this.layoutBuilder().columnBox().layout([
            this.layoutBuilder().columnBox().widgets(this.requiredFields).finish(),
        ]).finish();
    }

    override async onInit() {
        // =>get workflow fields
        let fieldsRes = await this.http.get('/workflow/fields', {
            workflow_name: this.initialData.workflow_name,
            workflow_version: this.initialData.workflow_version,
        });
        // =>if failed
        if (fieldsRes.error) {
            console.error('error:', fieldsRes);
            return;
        }
        for (const field of this.initialData.required_fields) {
            this.required_fields.push(fieldsRes.result['data'].find(i => i.name === field));
        }

        console.log('init data:', this.initialData, fieldsRes.result['data'])
    }

    requiredFields() {
        let fields = [];
        for (const field of this.required_fields) {
            if (field.type === 'string') {
                fields.push(
                    new StrongFBFormFieldWidget()
                        .field(new StrongFBInputWidget().formFieldName(field.name))
                        .label(field.name)
                        .validator(new StrongFBValidator().required())
                );
            }
            else if (field.type === 'file') {
                let fileWidget = new StrongFBFileUploaderWidget()
                    .formFieldName(field.name);

                if (field.validation) {
                    if (field.validation.find(i => i.type === 'file_type')) {
                        fileWidget.accept(field.validation.find(i => i.type === 'file_type').value as any)
                    }
                }
                fields.push(new StrongFBFormFieldWidget()
                    .field(fileWidget).label(field.name).validator(new StrongFBValidator().required()));
            }
        }

        fields.push(new StrongFBFormFieldWidget().label('Message').field(new StrongFBEditorWidget().placeholder('message ...').formFieldName('message')).validator(this.message_required ? new StrongFBValidator().required() : undefined));

        return fields;
    }

}
```