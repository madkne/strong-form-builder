import { Component, Output, EventEmitter, ElementRef, ChangeDetectorRef } from '@angular/core';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { StrongFBLocaleService } from '../../services/StrongFB-locale.service';
import { StrongFBService } from '../../services/StrongFB.service';
import { EditorSchema } from './editor-interfaces';
// import Editor from '@toast-ui/editor';

declare var toastui;
declare var FroalaEditor;

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
    protected override emitAutoReadyToUse = false;
    protected override prefixId = 'editor';


    constructor(
        protected override elRef: ElementRef,
        protected srv: StrongFBService,
        protected locale: StrongFBLocaleService,
        protected override cdr: ChangeDetectorRef,
    ) {
        super(elRef, cdr);

    }


    override async onInit() {
        this.editorId = 'editor_' + this.widgetId;
        this.displayLoading();
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = this.normalizeSchema(this.schema);

        this.listenOnFormFieldChange('value');

        // =>if toastUI type
        if (this.schema.editorType === 'ToastUI') {
            this.toastUILoad();
        } else {
            this.froalaLoad();
        }

    }

    normalizeSchema(schema: EditorSchema) {
        if (!schema.type) schema.type = 'wysiwyg';
        if (!schema.minHeight) schema.minHeight = '200px';
        if (!schema.maxWidth) schema.minHeight = '100%';
        if (this.schema.value === undefined || this.schema.value === null) this.schema.value = '';
        if (!schema.editorType) schema.editorType = 'Froala';


        return schema;
    }

    changeValue(event?) {
        // console.log(event);
        // =>get value by type
        if (this.schema.type === 'markdown') {
            if (this.schema.editorType === 'ToastUI') {
                this.schema.value = this.editor.getMarkdown();
            } else {
                this.schema.value = this.editor.html.get();
            }
        } else if (this.schema.type === 'wysiwyg') {
            if (this.schema.editorType === 'ToastUI') {
                this.schema.value = this.editor.getHTML();
            } else {
                this.schema.value = this.editor.html.get();
            }
        }
        this.updateFormField('value');
    }



    async toastUILoad() {
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
            this.readyToUse = true;
            clearInterval(editorLoaded);
        }, 10);
    }


    async froalaLoad() {
        // =>load dynamic resources
        await this.srv.loadStyleLink(this.srv.assetsUrl('css/froala_editor.min.css'));
        await this.srv.loadStyleLink(this.srv.assetsUrl('css/froala_editor-plugins.pkgd.min.css'));
        if (this.srv['_darkTheme']) {
            await this.srv.loadStyleLink(this.srv.assetsUrl('css/froala_editor.dark.min.css'));
        }
        await this.srv.loadScript(this.srv.assetsUrl('js/froala_editor.pkgd.min.js'));
        // =>load language
        if (this.locale.getLangInfo().code !== 'en') {
            await this.srv.loadScript(this.srv.assetsUrl(`js/froala_editor-language-${this.locale.getLangInfo().code}.js`));

        }
        await this.srv.loadStyleBlock(`
        #fr-logo {
            display: none;
        }
        .fr-toolbar, .fr-wrapper, .fr-second-toolbar  {
            border-color: var(--input-basic-border-color) !important;
            background-color: var(--input-basic-background-color) !important;
            color: var(--card-text-color) !important;
        }

        `);

        let editorLoaded = setInterval(() => {
            if (!document.getElementById(this.editorId)) return;

            this.editor = new FroalaEditor(`div#${this.editorId}`,
                {
                    events: {
                        contentChanged: () => this.changeValue(),
                    },
                    charCounterMax: -1,
                    quickInsertEnabled: false,
                    charCounterCount: true,
                    codeMirror: false,
                    "emoticonsButtons": [
                        "emoticonsBack",
                        "|"
                    ],
                    "tableCellMultipleStyles": true,
                    // "tableCellStyles": {
                    //     "fr-highlighted": "Highlighted",
                    //     "fr-thick": "Thick"
                    // },
                    useClasses: false,
                    "language": this.locale.getLangInfo().code,
                    "direction": "auto",
                    "heightMax": this.schema.minHeight,
                    "iframe": false,
                    "toolbarButtons": {
                        "moreText": {
                            "buttons": [
                                "bold",
                                "italic",
                                "underline",
                                "strikeThrough",
                                "subscript",
                                "superscript",
                                "fontFamily",
                                "fontSize",
                                "textColor",
                                "backgroundColor",
                                "inlineClass",
                                "inlineStyle",
                                "clearFormatting"
                            ],
                            "buttonsVisible": 3,
                            "align": "left"
                        },
                        "moreParagraph": {
                            "buttons": [
                                "alignLeft",
                                "alignCenter",
                                "formatOLSimple",
                                "alignRight",
                                "alignJustify",
                                "paragraphFormat",
                                "paragraphStyle",
                                "lineHeight",
                                "outdent",
                                "indent",
                                "quote"
                            ],
                            "buttonsVisible": 3,
                            "align": "left"
                        },
                        "moreRich": {
                            "buttons": [
                                "insertLink",
                                "insertImage",
                                "insertVideo",
                                "insertTable",
                                "emoticons",
                                "specialCharacters",
                                "insertHR"
                            ],
                            "buttonsVisible": 2,
                            "align": "left"
                        },
                        "moreMisc": {
                            "buttons": [
                                "undo",
                                "redo",
                                "fullscreen",
                                "print",
                                "selectAll",
                                "html"
                            ],
                            "buttonsVisible": 2,
                            "align": "right"
                        },
                        "showMoreButtons": true
                    },
                    imageUpload: false,
                    videoUpload: false
                });

            this.displayLoading(false);
            this.readyToUse = true;
            clearInterval(editorLoaded);
        }, 10);
    }
}
