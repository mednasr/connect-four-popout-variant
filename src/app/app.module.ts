import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
//Modules
import { AppRoutingModule } from './app-routing.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { NgxsModule } from '@ngxs/store';
import { NgxsReduxDevtoolsPluginModule } from '@ngxs/devtools-plugin';
import { NgxsLoggerPluginModule } from '@ngxs/logger-plugin';
//Angular material
import {MatButtonModule} from '@angular/material/button';
import {MatListModule} from '@angular/material/list';
import {MatIconModule} from '@angular/material/icon';
import {MatSlideToggleModule} from '@angular/material/slide-toggle';
import {MatSelectModule} from '@angular/material/select';
//Components
import { AppComponent } from './app.component';
import { BoardComponent } from './components/board/board.component';
import { SidebarComponent } from './components/sidebar/sidebar.component';
//Services
import { GameService } from './services/game.service';
import { ColorService } from './services/color.service';




@NgModule({
  declarations: [
    AppComponent,
    BoardComponent,
    SidebarComponent,
  ],
  imports: [
    BrowserModule,
    NgxsModule.forRoot([
    ]),
    NgxsReduxDevtoolsPluginModule.forRoot(),
    NgxsLoggerPluginModule.forRoot(),
    AppRoutingModule,
    BrowserAnimationsModule,
    MatButtonModule,
    MatListModule,
    MatIconModule,
    MatSlideToggleModule,
    MatSelectModule
  ],
  providers: [
    ColorService,
    GameService,
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }


