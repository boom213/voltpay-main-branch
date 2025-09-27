import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { RouterLink, RouterModule, RouterOutlet } from '@angular/router';
import { App } from './app';
import { NavbarComponent } from './shared/navbar/navbar.component';
import { FooterComponent } from './shared/footer/footer.component';
import { NotificationComponent } from './shared/notification/notification.component';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule } from '@angular/forms';
import { LoginComponent } from './auth/login/login.component';
import { routes } from './app.routes'; 
import { HttpClientModule } from '@angular/common/http';

@NgModule({
  declarations: [
    App,
    LoginComponent,
    NavbarComponent,
    FooterComponent,
    NotificationComponent,
  ],
  imports: [
    BrowserModule,
    RouterModule.forRoot(routes),
    CommonModule,
    ReactiveFormsModule,
     HttpClientModule,
    RouterLink,
    RouterOutlet,
  ],
  providers: [],
  bootstrap: [App],
})
export class AppModule {}
