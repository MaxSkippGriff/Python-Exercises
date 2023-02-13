import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { AuthGuard } from './_services/auth-guard.guard';

import { StartPageComponent } from './start-page/start-page.component';
import { LoginComponent } from './login-page/login.component';
import { SignupComponent } from './signup-page/signup.component';
import { ProfileComponent } from './home-page/profile/profile.component';
import { LeaderboardComponent } from './home-page/leaderboard/leaderboard.component';
import { HomePageComponent } from './home-page/home-page.component';
import { GameMenuComponent } from './home-page/game-menu/game-menu.component';
import { ConnectFourComponent } from './games/connect-4/connect-four/connect-four.component';
import { StartComponent } from "./games/route/start/start.component";
import { GameplayComponent } from "./games/route/gameplay/gameplay.component";
import { RankingComponent } from "./games/route/ranking/ranking.component";
import { MemoryGameComponent } from './games/memory-game/memory-components/memory-game/memory-game.component';
import { StartConnectFourComponent } from './games/route/start-connect-four/start-connect-four.component';
import { GameplayConnectFourComponent } from './games/route/gameplay-connect-four/gameplay-connect-four.component';
import { ConnectFourContainerComponent } from './games/connect-4/connect-four-container/connect-four-container.component';


const routes: Routes = [
  {
    path: '',
    component: StartPageComponent
  },
  {
    path: 'login',
    component: LoginComponent
  },
  {
    path: 'signup',
    component: SignupComponent
  },
  {
    path: 'home',
    component: HomePageComponent,
    canActivate: [AuthGuard], //Prevent unauthorized access
    children: [
      {
        path: '',
        component: GameMenuComponent //redirect to game menu page by default with path /home
      },
      {
        path: 'profile', // subpath : /home/profile
        component: ProfileComponent
      },
      {
        path: 'leaderboard',
        component: LeaderboardComponent
      }
    ]
  },
  {
    path: 'connect4',
    redirectTo: '/connect4start',
    pathMatch: 'full'
  },

  { path: "connect4start", component: StartConnectFourComponent, canActivate: [AuthGuard]},
  { path: 'connect4_gameplay', component: ConnectFourContainerComponent, canActivate: [AuthGuard]},
  { path: "memorygame", redirectTo: "/start", pathMatch: "full" },
  { path: "start", component: StartComponent,canActivate: [AuthGuard]},
  { path: 'gameplay', component: GameplayComponent ,canActivate: [AuthGuard]},
  { path: 'ranking', component: RankingComponent,canActivate: [AuthGuard]}
];
@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
  providers: [AuthGuard]
})
export class AppRoutingModule { }
