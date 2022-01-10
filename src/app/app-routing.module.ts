import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { AuthComponent } from './auth/auth.component';
import { VideoListComponent } from './video-list/video-list.component';


const routes: Routes = [
  { path:'', redirectTo: '/video-list', pathMatch: 'full' },
  { path:'video-list', component: VideoListComponent },
  { path: 'auth', component: AuthComponent }
];


@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
