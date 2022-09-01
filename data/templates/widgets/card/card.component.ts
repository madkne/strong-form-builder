import { Component } from '@angular/core';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { CardSchema } from './card-interfaces';

@Component({
    selector: 'card-widget',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class StrongFBCardWidgetComponent extends StrongFBBaseWidget<CardSchema> {

    layoutsLoaded: { [k: string]: boolean } = {};

    protected override prefixId = 'card';

    protected override emitAutoReadyToUse = false;

    override async onInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        // console.log('card header:', this.widgetHeader)
    }

    childLayoutLoaded(layoutId: string) {
        // console.log('layout loaded:', layoutId)
        this.layoutsLoaded[layoutId] = true;
        // =>count layouts of card
        let layoutsCount = 0;
        if (this.widgetHeader.schema?.header?.layout) {
            layoutsCount++;
        }
        if (this.widgetHeader.schema.content?.layout) {
            layoutsCount++;
        }
        if (this.widgetHeader.schema.footer?.layout) {
            layoutsCount++;
        }

        if (Object.keys(this.layoutsLoaded).length === layoutsCount) {
            this.readyToUse = true;
        }
    }
}
