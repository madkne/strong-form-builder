import { CommonModule } from "@angular/common";
import { HttpClientModule } from "@angular/common/http";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";

import { StrongFBSharedModule } from "./StrongFB-shared.module";
import { StrongFBButtonWidgetComponent } from "./widgets/button/button.component";
import { StrongFBCardWidgetComponent } from "./widgets/card/card.component";
import { StrongFBDialogComponent } from "./widgets/dialog/dialog.component";
import { StrongFBFormFieldWidgetComponent } from "./widgets/form-field/form-field.component";
import { StrongFBFormComponent } from "./widgets/form/form.component";
import { StrongFBInputWidgetComponent } from "./widgets/input/input.component";
import { StrongFBLayoutComponent } from "./widgets/layout/layout.component";
import { StrongFBSelectWidgetComponent } from "./widgets/select/select.component";
import { StrongFBTabledWidgetComponent } from "./widgets/table/table.component";
import { StrongFBTagsListWidgetComponent } from "./widgets/tags-list/tags-list.component";
import { StrongFBTextAreaWidgetComponent } from "./widgets/textarea/textarea.component";

@NgModule({
    declarations: [
        StrongFBFormComponent,
        StrongFBInputWidgetComponent,
        StrongFBCardWidgetComponent,
        StrongFBLayoutComponent,
        StrongFBButtonWidgetComponent,
        StrongFBFormFieldWidgetComponent,
        StrongFBTabledWidgetComponent,
        StrongFBDialogComponent,
        StrongFBTextAreaWidgetComponent,
        StrongFBSelectWidgetComponent,
        StrongFBTagsListWidgetComponent,
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
        // StrongFBDialogComponent,
    ],
})
export class StrongFBModule { }
