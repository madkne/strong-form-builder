import { Component, Output, EventEmitter, ElementRef } from '@angular/core';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { StrongFBLocaleService } from '../../services/StrongFB-locale.service';
import { StrongFBService } from '../../services/StrongFB.service';
import { EditorSchema } from './editor-interfaces';
// import Editor from '@toast-ui/editor';

declare var toastui;

@Component({
    selector: 'editor-widget',
    templateUrl: './editor.component.html',
    styleUrls: ['./editor.component.scss']
})
export class StrongFBEditorWidgetComponent extends StrongFBBaseWidget<EditorSchema> {
    editorId: string;
    editor;
    override schema: EditorSchema;
    @Output() override ngModelChange = new EventEmitter<string | number>();

    constructor(
        protected override elRef: ElementRef,
        protected srv: StrongFBService,
        protected locale: StrongFBLocaleService,
    ) {
        super(elRef);
        this.editorId = 'editor_' + this.widgetId;
    }


    override async onInit() {
        this.displayLoading();
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = this.normalizeSchema(this.schema);

        this.listenOnFormFieldChange('value');
        // =>load dynamic resources
        await this.srv.loadScript(this.srv.assetsUrl('js/toastui-editor-all.min.js'));
        await this.srv.loadStyleLink(this.srv.assetsUrl('css/toastui-editor.min.css'));
        if (this.srv['_darkTheme']) {
            await this.srv.loadStyleLink(this.srv.assetsUrl('css/toastui-editor-dark.css'));
        }
        await this.srv.loadStyleBlock(`
        .toastui-editor-defaultUI {
            border-color: var(--input-basic-border-color) !important;
        }
        .toastui-editor-defaultUI-toolbar,
        .toastui-editor-ww-container,
        .toastui-editor-mode-switch,
        .toastui-editor-mode-switch .tab-item  {
            border-color: var(--input-basic-border-color) !important;
            background-color: var(--input-basic-background-color) !important;
            color: var(--card-text-color) !important;
        }

        .toastui-editor-toolbar-icons {
            border-color: var(--card-border-color);
        }
        `);
        // => translate 
        let transKeys = ['Insert image', 'Scroll', 'Headings', 'Line', 'Bold', 'Insert table', 'OK', 'Cancel', 'Description', 'Insert codeBlock', 'Select image file', 'File',
            'URL', 'Insert link', 'Image URL', 'Ordered list', 'Choose a file', 'Link text', 'Blockquote', 'Task', 'Unordered list', 'Inline code', 'Strike', 'Italic']
        let transObj = {};
        for (const key of transKeys) {
            transObj[key] = this.locale.trans('msgs', key);
        }
        toastui.Editor.setLanguage('en-US', transObj);

        let editorLoaded = setInterval(() => {
            if (!document.getElementById(this.editorId)) return;
            this.editor = new toastui.Editor({
                el: document.getElementById(this.editorId),
                initialEditType: this.schema.type,
                minHeight: this.schema.minHeight,
                // height: ($(window).height() - 50) + 'px',
                previewStyle: 'vertical',
                usageStatistics: false,
                initialValue: this.schema.value,
                placeholder: this.schema.placeholder,

                language: 'en-US',
                theme: this.srv['_darkTheme'] ? 'dark' : 'light',
                events: {
                    change: () => this.changeValue()
                },
                // hooks: {
                //     addImageBlobHook: async function (blob, callback) {
                //         var uploadedImageURL = await uploadImage(blob);
                //         callback(uploadedImageURL);
                //         return false;
                //     }
                // },
            });
            this.displayLoading(false);
            clearInterval(editorLoaded);
        }, 10);
    }

    normalizeSchema(schema: EditorSchema) {
        if (!schema.type) schema.type = 'wysiwyg';
        if (!schema.minHeight) schema.minHeight = '200px';
        if (!schema.maxWidth) schema.minHeight = '100%';


        return schema;
    }

    changeValue(event?) {
        // console.log(event);
        // =>get value by type
        if (this.schema.type === 'markdown') {
            this.schema.value = this.editor.getMarkdown();
        } else if (this.schema.type === 'wysiwyg') {
            this.schema.value = this.editor.getHTML();
        }
        this.updateFormField('value');
    }
}
