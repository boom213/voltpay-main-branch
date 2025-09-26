import { CommonModule } from "@angular/common";
import { Component, effect, signal } from "@angular/core";
import { NotificationService, Notice } from "./notification.service";

@Component({
  selector: "app-notification",
  standalone: true,
  imports: [CommonModule],
  template: `
    <div
      *ngIf="notice() as n"
      class="alert mb-0 rounded-0 text-center"
      [ngClass]="'alert-' + n.type"
    >
      {{ n.message }}
    </div>
  `,
})
export class NotificationComponent {
  protected notice = signal<Notice | null>(null);

  constructor(private notify: NotificationService) {
    effect(() => {
      const sub = this.notify.notification.subscribe((n) => this.notice.set(n));
      return () => sub.unsubscribe();
    });
  }
}
