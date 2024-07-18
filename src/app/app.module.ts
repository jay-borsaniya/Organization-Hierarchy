import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';

import { AppComponent } from './app.component';
import { HierarchyComponent } from './hierarchy/hierarchy.component';
import { AddEmployeeDialogComponent } from './hierarchy/card/add-employee-dialog/add-employee-dialog.component';

import { MatDialogModule } from '@angular/material/dialog';
import { CardComponent } from './hierarchy/card/card.component';
import { ChildCardComponent } from './hierarchy/card/child-card/child-card.component';
import { ReactiveFormsModule } from '@angular/forms';

import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    AppComponent,
    HierarchyComponent,
    AddEmployeeDialogComponent,
    CardComponent,
    ChildCardComponent,
  ],
  imports: [BrowserModule, MatDialogModule, ReactiveFormsModule, HttpClientModule],
  providers: [],
  bootstrap: [AppComponent],
})
export class AppModule {}
