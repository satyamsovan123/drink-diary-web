import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { SignupComponent } from './components/signup/signup.component';
import { SigninComponent } from './components/signin/signin.component';
import { ErrorComponent } from './components/error/error.component';
import { DataComponent } from './components/data/data.component';
import { AuthenticationGuard } from './services/authentication.guard';
import { HelpComponent } from './components/help/help.component';

const routes: Routes = [
  { path: '', component: HomeComponent },
  {
    path: 'signup',
    component: SignupComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'signin',
    component: SigninComponent,
    canActivate: [AuthenticationGuard],
  },
  {
    path: 'error',
    component: ErrorComponent,
  },
  {
    path: 'help',
    component: HelpComponent,
  },
  {
    path: 'data',
    component: DataComponent,
    canActivate: [AuthenticationGuard],
  },
  { path: '**', component: HomeComponent },
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule],
})
export class AppRoutingModule {}
