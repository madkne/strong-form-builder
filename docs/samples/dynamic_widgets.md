# Dynamic Widgets

## description

You can declare dynamic widgets and add them to your layout by `widgets` method.

## code

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
            /** add dynamic widgets */
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

    }

    /**
     * add dynamic widgets by API
     */
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