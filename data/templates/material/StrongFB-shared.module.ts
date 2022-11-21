import { CommonModule } from "@angular/common";
import { NgModule } from "@angular/core";
import { FormsModule } from "@angular/forms";
import { MatMenuModule } from '@angular/material/menu';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatInputModule } from '@angular/material/input';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatSlideToggleModule } from '@angular/material/slide-toggle';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressBarModule } from '@angular/material/progress-bar';
import { MatRippleModule } from '@angular/material/core';
import { DragDropModule } from '@angular/cdk/drag-drop';
import { MatBadgeModule } from '@angular/material/badge';
import { MatSelectModule } from '@angular/material/select';
import { MatTableModule } from '@angular/material/table';
import { MatChipsModule } from '@angular/material/chips';
import { MatTooltipModule } from '@angular/material/tooltip';
import { MatCardModule } from '@angular/material/card';

@NgModule({
  declarations: [],
  imports: [
    CommonModule,
    FormsModule,


    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatProgressBarModule,
    MatMenuModule,
    MatRippleModule,
    DragDropModule,
    MatBadgeModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    MatCardModule,

  ],
  providers: [],
  exports: [
    CommonModule,
    FormsModule,

    MatFormFieldModule,
    MatIconModule,
    MatButtonModule,
    MatInputModule,
    MatCheckboxModule,
    MatSlideToggleModule,
    MatDividerModule,
    MatProgressBarModule,
    MatMenuModule,
    MatRippleModule,
    DragDropModule,
    MatBadgeModule,
    MatSelectModule,
    MatTableModule,
    MatChipsModule,
    MatTooltipModule,
    MatCardModule,
  ],
})
export class StrongFBSharedModule { }
