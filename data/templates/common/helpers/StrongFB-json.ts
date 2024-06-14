
import { StrongFBJsonLayoutBuilderWidget } from "../StrongFB-interfaces";
import { StrongFBBaseWidgetHeader } from "../StrongFB-widget-header";

// card
{% if (loadedWidgets.includes('card')) %}
import { StrongFBCardWidget } from "../../widgets/card/card.header";
{% endif %}

// button
{% if (loadedWidgets.includes('button')) %}
import { StrongFBButtonWidget } from "../../widgets/button/button.header";
{% endif %}

// input
{% if (loadedWidgets.includes('input')) %}
import { StrongFBInputWidget } from "../../widgets/input/input.header";
{% endif %}

// form-field
{% if (loadedWidgets.includes('form-field')) %}
import { StrongFBFormFieldWidget } from "../../widgets/form-field/form-field.header";
{% endif %}

// textarea
{% if (loadedWidgets.includes('textarea')) %}
import { StrongFBTextAreaWidget } from "../../widgets/textarea/textarea.header";
{% endif %}

// editor
{% if (loadedWidgets.includes('editor')) %}
import { StrongFBEditorWidget } from "../../widgets/editor/editor.header";
{% endif %}

// tags-list
{% if (loadedWidgets.includes('tags-list')) %}
import { StrongFBTagsListWidget } from "../../widgets/tags-list/tags-list.header";
{% endif %}

// table
{% if (loadedWidgets.includes('table')) %}
import { StrongFBTableWidget } from "../../widgets/table/table.header";
{% endif %}

export function json2WidgetClass(json: StrongFBJsonLayoutBuilderWidget) {
    let res: StrongFBBaseWidgetHeader;
    {% if (loadedWidgets.includes('card')) %}
    // =>check card widget
    if (json.type === 'card') {
        res = new StrongFBCardWidget();
    }
    {% endif %}
    {% if (loadedWidgets.includes('button')) %}
    // =>check button widget
    if (json.type === 'button') {
        res = new StrongFBButtonWidget();
    }
    {% endif %}

    {% if (loadedWidgets.includes('input')) %}
    // =>check input widget
    if (json.type === 'input') {
        res = new StrongFBInputWidget();
    }
    {% endif %}

    {% if (loadedWidgets.includes('form-field')) %}
    // =>check form field widget
    if (json.type === 'form-field') {
        res = new StrongFBFormFieldWidget();
    }
    {% endif %}

    {% if (loadedWidgets.includes('textarea')) %}
    // =>check textarea widget
    if (json.type === 'textarea') {
        res = new StrongFBTextAreaWidget();
    }
    {% endif %}

    {% if (loadedWidgets.includes('editor')) %}
    // =>check editor widget
    if (json.type === 'editor') {
        res = new StrongFBEditorWidget();
    }
    {% endif %}

    {% if (loadedWidgets.includes('tags-list')) %}
    // =>check tags-list widget
    if (json.type === 'tags-list') {
        res = new StrongFBTagsListWidget();
    }
    {% endif %}

    {% if (loadedWidgets.includes('table')) %}
    // =>check form field widget
    if (json.type === 'table') {
        res = new StrongFBTableWidget();
    }
    {% endif %}

    // =>parse json
    if (res) {
        res['_isJsonMode'] = true;
        if (res['_loadFromJson']) {
            res['_loadFromJson'](json.properties);
        } else {
            res['_schema'] = json.properties;
        }
        // =>load form field name
        if (json.formFieldName) {
            res['_formFieldName'] = json.formFieldName;
        }
        // =>load common styles
        if (json.commonStyles) {
            res['_commonStyles'] = json.commonStyles;
        }
    }

    return res;
}