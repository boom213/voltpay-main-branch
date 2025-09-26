import { Component, signal } from "@angular/core";
import { RouterOutlet } from "@angular/router";
import { NavbarComponent } from "./shared/navbar/navbar.component";
import { FooterComponent } from "./shared/footer/footer.component";
import { NotificationComponent } from "./shared/notification/notification.component";

@Component({
  selector: "app-root",
  standalone: true,
  imports: [
    RouterOutlet,
    NavbarComponent,
    FooterComponent,
    NotificationComponent,
  ],
  templateUrl: "./app.html",
  styleUrls: ["./app.css"],
})
export class App {
  protected readonly title = signal("VoltPay");
}