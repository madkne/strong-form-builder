import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import {
  NbActionsModule,
  NbCardModule,
  NbContextMenuModule,
  NbIconModule,
  NbInputModule,
  NbSelectModule,
  NbUserModule,
  NbTabsetModule,
  NbFormFieldModule,
  NbButtonModule,
  NbCheckboxModule,
  NbRouteTabsetModule,
  NbToggleModule,
  NbTagModule,
  NbTooltipModule,
  NbToastrModule,
  NbStepperModule,
  NbDialogModule,
  NbAutocompleteModule,
} from '@nebular/theme';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    NbIconModule,
    NbSelectModule,
    NbActionsModule,
    NbUserModule,
    NbContextMenuModule,
    NbInputModule,
    NbCardModule,
    NbTabsetModule,
    NbFormFieldModule,
    NbButtonModule,
    FormsModule,
    NbCheckboxModule,
    NbRouteTabsetModule,
    NbToggleModule,
    NbTagModule,
    NbTooltipModule,
    NbToastrModule,
    NbStepperModule,
    NbDialogModule.forRoot(),
    NbAutocompleteModule,

  ],
  providers: [],
  exports: [
    CommonModule,
    NbIconModule,
    NbSelectModule,
    NbActionsModule,
    NbUserModule,
    NbContextMenuModule,
    NbInputModule,
    NbCardModule,
    NbTabsetModule,
    NbFormFieldModule,
    NbButtonModule,
    FormsModule,
    NbCheckboxModule,
    NbRouteTabsetModule,
    NbToggleModule,
    NbTagModule,
    NbTooltipModule,
    NbToastrModule,
    NbStepperModule,
    NbDialogModule,
    NbAutocompleteModule,
  ],
})
export class StrongFBSharedModule { }
