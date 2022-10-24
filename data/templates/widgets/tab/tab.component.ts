import { ChangeDetectorRef, Component, ElementRef, ViewChild, ViewContainerRef } from '@angular/core';
import { SFB_warn } from '../../common/StrongFB-common';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { StrongFBService } from '../../services/StrongFB.service';
import { TabSchema } from './tab-interfaces';

@Component({
    selector: 'tab-widget',
    templateUrl: './tab.component.html',
    styleUrls: ['./tab.component.scss']
})
export class StrongFBTabWidgetComponent extends StrongFBBaseWidget<TabSchema> {


    protected override prefixId = 'tab';
    @ViewChild('TabComponentRef', { read: ViewContainerRef }) tabComponentRef: ViewContainerRef;

    // protected override emitAutoReadyToUse = false;

    constructor(
        private elref: ElementRef,
        private strongService: StrongFBService,
        protected detectChanges: ChangeDetectorRef) {
        super(elref, detectChanges);
    }

    override async onInit() {
        this.schema = this.widgetHeader.schema;
        // =>normalize schema
        this.schema = await this.normalizeSchema(this.schema);
    }

    normalizeSchema(schema: TabSchema) {
        if (schema.tabPadding === undefined) schema.tabPadding = true;
        if (!schema.tabContents) schema.tabContents = {};
        if (!schema.fullWidth) schema.fullWidth = false;
        if (!schema.tabHeaders) schema.tabHeaders = [];
        for (const header of schema.tabHeaders) {
            if (!header.mode) {
                header.mode = 'text';
            }
            if (!header.title) {
                header.title = header.name;
            }
        }


        return schema;
    }


    async changeTab(name: string, event) {
        // console.log('switch tab name:', name, event)
        let selectedTabHeader = this.schema.tabHeaders.find(i => i.name === name);
        // =>check before change event
        if (this.schema.tabBeforeChange) {
            if (!await this.schema.tabBeforeChange.call(this.widgetForm, selectedTabHeader, this.widgetHeader)) {
                return;
            }
        }
        // =>find tab content
        let content = this.schema.tabContents[name];
        if (!content) {
            SFB_warn(`not found any content for tab`, name);
            return;
        }
        // =>load form of tab content, if exist
        if (content.form) {
            content.__formInstance = await this.strongService.loadFormClass(content.form, content.formInitialData);
        }
        // =>load component of tab content, if exist
        if (content.component) {
            let ref = setInterval(async () => {
                if (!this.tabComponentRef) return;
                this.tabComponentRef.clear();
                content.__componentInstance = await this.widgetForm.service.loadDynamicComponent(this.tabComponentRef, content.component, content.formInitialData);
                this.cdr.detectChanges();
                clearInterval(ref);
            }, 10);
        }
        // =>change is active of tabs
        for (const tab of this.schema.tabHeaders) {
            if (tab.name === name) {
                tab.isActive = true;
            } else {
                tab.isActive = false;
            }
        }
        // =>raise click event
        if (this.schema.tabClick) {
            this.schema.tabClick.call(this.widgetForm, selectedTabHeader, this.widgetHeader);
        }
    }

}