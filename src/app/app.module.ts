import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import {DeviceDetectorModule} from 'ngx-device-detector';
import { RankingComponent } from './ranking/ranking.component';
import { SolarComponent } from './solar/solar.component';

@NgModule({
  declarations: [
    AppComponent,
    RankingComponent,
    SolarComponent
  ],
  imports: [
    BrowserModule,
    FormsModule,
    DeviceDetectorModule.forRoot()
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
