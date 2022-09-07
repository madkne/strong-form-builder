import { ChangeDetectorRef, Component, ElementRef } from '@angular/core';
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


    async changeTab(name: string) {
        console.log('switch tab name:', name)
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
    }

}
