import { NgModule } from '@angular/core';
import { AuthGuard } from './core/auth.guard';
import { AdminAuthGuard } from './core/admin-auth.guard';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactComponent } from './components/contact/contact.component';
import { LoginComponent } from './components/login/login.component';
import { PageNotFoundComponent } from './components/page-not-found/page-not-found.component';
import { ConsoleModule } from './console/console.module';
import { GalleryComponent } from './components/gallery/gallery.component';
import { ContributionsComponent } from './components/contributions/contributions.component';
import { ContributionsDetailsComponent } from './components/contributions/contributions-details/contributions-details.component';

const routes: Routes = [
  {
    path: 'console',
    loadChildren: () => {
      return ConsoleModule;
    },
    canActivate: [AdminAuthGuard],
  },
  {
    path: 'login',
    children: [{ path: '', component: LoginComponent }],
  },
  //HOME
  {
    path: '',
    children: [{ path: '', component: HomeComponent }],
  },
  {
    path: 'gallery',
    children: [{ path: '', component: GalleryComponent }],
  },
  {
    path: 'contributions',
    children: [
      { path: '', component: ContributionsComponent },
      { path: 'details', component: ContributionsDetailsComponent }],
  },
  //CONTACT
  {
    path: 'contact',
    children: [{ path: '', component: ContactComponent }],
  },
  //NOT FOUND
  { path: '404', component: PageNotFoundComponent },
  { path: '**', redirectTo: '404' },
];

@NgModule({
  imports: [
    RouterModule.forRoot(routes, {
      initialNavigation: 'enabled',
    }),
  ],
  exports: [RouterModule],
})
export class AppRoutingModule {}
