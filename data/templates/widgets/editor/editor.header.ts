import { StrongFBLayoutBuilder } from "../../common/StrongFB-layout-builder";
import { StrongFBBaseWidgetHeader } from "../../common/StrongFB-widget-header";
import { InputSize, InputStatus, InputType } from "../input/input-interfaces";
import { EditorProductType, EditorSchema, EditorType } from "./editor-interfaces";
import { StrongFBEditorWidgetComponent } from "./editor.component";



export class StrongFBEditorWidget<FIELDS = { [k: string]: any }> extends StrongFBBaseWidgetHeader<EditorSchema> {

    protected override _schema: EditorSchema = {};

    override get component(): any {
        return StrongFBEditorWidgetComponent;
    }

    override get widgetName(): string {
        return 'editor';
    }


    type(typ: EditorType) {
        this._schema.type = typ;
        return this;
    }

    placeholder(text: string) {
        this._schema.placeholder = text;
        return this;
    }

    disabled(is = true) {
        this._schema.disabled = is;
        return this;
    }

    editorType(editor: EditorProductType) {
        this._schema.editorType = editor;
        return this;
    }

    value(text: string) {
        this._schema.value = text;
        return this;
    }

    formFieldName(name: keyof FIELDS) {
        this._formFieldName = name as any;
        return this;
    }


    maxWidth(width: string) {
        this._schema.maxWidth = width;
        return this;
    }
}