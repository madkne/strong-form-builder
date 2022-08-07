import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { StrongFBSharedModule } from "./StrongFB-shared.module";
import { StrongFBCardWidgetComponent } from "./widgets/card/card.component";
import { StrongFBFormComponent } from "./widgets/form/form.component";
import { StrongFBInputWidgetComponent } from "./widgets/input/input.component";
import { StrongFBLayoutComponent } from "./widgets/layout/layout.component";

@NgModule({
    declarations: [
        StrongFBFormComponent,
        StrongFBInputWidgetComponent,
        StrongFBCardWidgetComponent,
        StrongFBLayoutComponent,
    ],
    imports: [
        StrongFBSharedModule,
        CommonModule,
        FormsModule,
        HttpClientModule,
    ],
    providers: [],
    exports: [
        StrongFBFormComponent,
    ],
})
export class StrongFBModule { }
