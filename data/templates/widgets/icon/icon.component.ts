import { ChangeDetectorRef, Component, ElementRef, Input, SimpleChanges } from '@angular/core';
import { delay, takeUntil } from 'rxjs';
import { StrongFBBaseWidget } from '../../common/StrongFB-widget';
import { StrongFBBaseWidgetHeader } from '../../common/StrongFB-widget-header';
import { StrongFBHttpService } from '../../services/StrongFB-http.service';
import { StrongFBLocaleService } from '../../services/StrongFB-locale.service';
import { StrongFBService } from '../../services/StrongFB.service';
import { IconSchema } from './icon-interfaces';

@Component({
    selector: 'icon-widget',
    templateUrl: './icon.component.html',
    styleUrls: ['./icon.component.scss']
})
export class StrongFBIconWidgetComponent extends StrongFBBaseWidget<IconSchema> {

    @Input() override schema: IconSchema;
    @Input() icon: string;

    constructor(public override elRef: ElementRef<any>, public override cdr: ChangeDetectorRef, public http: StrongFBHttpService, public srv: StrongFBService, public locale: StrongFBLocaleService) {
        super(elRef, cdr);
    }

    override async onInit() {
    }

    ngOnChanges(changes: SimpleChanges): void {
        // if (changes['widgetHeader']) {
        //     this.initSchema();
        // }

    }

}
