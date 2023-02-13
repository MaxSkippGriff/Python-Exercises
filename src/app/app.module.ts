import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import {HttpClientModule} from '@angular/common/http';
import {HTTP_INTERCEPTORS} from '@angular/common/http'
import { DataService } from './_services/data.service';
import { AuthService } from './_services/auth.service';
import { TokenStorageService } from './_services/token-storage.service';

import { AuthInterceptor } from './_services/auth.interceptor';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { StartPageComponent } from './start-page/start-page.component';
import { TitleComponent } from './start-page/title/title.component';
import { BackgroundComponent } from './start-page/background/background.component';
import { BgmComponent } from './common/bgm/bgm.component';
import { Btngrp1Component } from './start-page/btngrp1/btngrp1.component';
import { LoginComponent } from './login-page/login.component';
import { Title2Component } from './common/title2/title2.component';
import { SignupComponent } from './signup-page/signup.component';
import { ProfileComponent } from './home-page/profile/profile.component';
import { LeaderboardComponent } from './home-page/leaderboard/leaderboard.component';
import { HomePageComponent } from './home-page/home-page.component';
import { NavbarComponent } from './home-page/navbar/navbar.component';
import { GameMenuComponent } from './home-page/game-menu/game-menu.component';
import { ConnectFourComponent } from './games/connect-4/connect-four/connect-four.component';
import { JitsiComponent } from './jitsi/jitsi.component';
import { CardComponent } from './games/memory-game/memory-components/card/card.component';
import { StartComponent } from "./games/route/start/start.component";
import { RankingComponent } from './games/route/ranking/ranking.component';
import { GameplayComponent } from './games/route/gameplay/gameplay.component';
import { MemoryGameComponent } from './games/memory-game/memory-components/memory-game/memory-game.component';
import { GameWindowComponent } from './games/memory-game/memory-components/game-window/game-window.component';
import { ButtonComponent } from './games/memory-game/memory-components/button/button.component';
import { HeadingComponent } from './games/memory-game/memory-components/heading/heading.component';
import { ConnectButtonComponent } from './games/memory-game/memory-components/start-game-components/connect-button/connect-button.component';
import { ReadyButtonComponent } from './games/memory-game/memory-components/start-game-components/ready-button/ready-button.component';
import { StartConnectFourComponent } from './games/route/start-connect-four/start-connect-four.component';
import { GameplayConnectFourComponent } from './games/route/gameplay-connect-four/gameplay-connect-four.component';
import { ConnectFourContainerComponent } from './games/connect-4/connect-four-container/connect-four-container.component';
import { GameWindowC4Component } from './games/connect-4/game-window-c4/game-window-c4.component';



@NgModule({
  declarations: [
    AppComponent,
    StartPageComponent,
    TitleComponent,
    BackgroundComponent,
    BgmComponent,
    Btngrp1Component,
    LoginComponent,
    Title2Component,
    SignupComponent,
    ProfileComponent,
    LeaderboardComponent,
    HomePageComponent,
    NavbarComponent,
    GameMenuComponent,
    ConnectFourComponent,
    JitsiComponent,
    CardComponent,
    StartComponent,
    RankingComponent,
    GameplayComponent,
    MemoryGameComponent,
    GameWindowComponent,
    ButtonComponent,
    HeadingComponent,
    ConnectButtonComponent,
    ReadyButtonComponent,
    StartConnectFourComponent,
    ButtonComponent,
    GameplayConnectFourComponent,
    ConnectFourContainerComponent,
    GameWindowC4Component
  ],
  imports: [
    BrowserModule,
    FormsModule,
    ReactiveFormsModule,
    AppRoutingModule,
    HttpClientModule,
  ],
  providers: [{ provide: HTTP_INTERCEPTORS, useClass: AuthInterceptor, multi: true }, DataService],
  bootstrap: [AppComponent]
})
export class AppModule { }
