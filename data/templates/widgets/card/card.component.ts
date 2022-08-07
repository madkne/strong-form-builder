import { Component } from '@angular/core';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { CardSchema } from './card-interfaces';

@Component({
    selector: 'card-widget',
    templateUrl: './card.component.html',
    styleUrls: ['./card.component.scss']
})
export class StrongFBCardWidgetComponent extends StrongFBBaseWidget<CardSchema> {
    override async onInit() {
        //Called after the constructor, initializing input properties, and the first call to ngOnChanges.
        //Add 'implements OnInit' to the class.
        // console.log('card header:', this.widgetHeader)
    }
}
