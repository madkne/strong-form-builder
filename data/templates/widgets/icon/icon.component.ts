import { ChangeDetectorRef, Component, ElementRef, Input, SimpleChanges } from '@angular/core';
import { delay, takeUntil } from 'rxjs';
import { CustomFontPackInterface } from '../../common/StrongFB-interfaces';
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

    customFontPack: CustomFontPackInterface;
    containsIcon = false;
    /********************************** */
    constructor(public override elRef: ElementRef<any>, public override cdr: ChangeDetectorRef, public http: StrongFBHttpService, public srv: StrongFBService, public locale: StrongFBLocaleService) {
        super(elRef, cdr);
    }
    /********************************** */
    override async onInit() {
    }
    /********************************** */
    ngOnChanges(changes: SimpleChanges): void {
        if (this.srv['_customFontPack']) {
            this.customFontPack = this.srv['_customFontPack'];
        }
        // =>if icon changed
        if (changes['icon']) {
            this.show = false;
            setTimeout(() => {
                this.show = true;
                // =>reset icon, if font-awesome
                if (this.customFontPack?.type === 'font-awesome') {
                    this.resetFontAwesomeIcons();
                }
                this.containsIcon = true;
            }, 30);
        }
    }
    /********************************** */
    resetFontAwesomeIcons() {
        if (this.containsIcon) {
            while (true) {
                const element = document.getElementById('fa_' + this.widgetId);
                if (!element) break;
                element.parentNode.removeChild(element);
            }
        }
    }
}
