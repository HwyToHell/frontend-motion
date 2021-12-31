import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { VideoListComponent } from './video-list/video-list.component';


const routes: Routes = [
  { path:'', redirectTo: '/video-list', pathMatch: 'full' },
  { path:'video-list', component: VideoListComponent },
];

const appRoutes: Routes = [
  { path: 'video-list', component: VideoListComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
