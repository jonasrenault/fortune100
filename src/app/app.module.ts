import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { HttpModule } from '@angular/http';

import { AppComponent } from './app.component';
import { CompaniesService } from './companies.service';
import { CompaniesComponent } from './companies/companies.component';
import { RadarChartComponent } from './radar-chart/radar-chart.component';

@NgModule({
  declarations: [
    AppComponent,
    CompaniesComponent,
    RadarChartComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    HttpModule,
    ReactiveFormsModule
  ],
  providers: [CompaniesService],
  bootstrap: [AppComponent]
})
export class AppModule { }
