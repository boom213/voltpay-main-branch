import { Component, OnDestroy, OnInit, signal } from "@angular/core";
import { CommonModule } from "@angular/common";
import { NotificationService, Notice } from "./notification.service";
import { Subject, takeUntil } from "rxjs";

@Component({
  selector: "app-notification",
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
export class NotificationComponent implements OnInit, OnDestroy {
  protected notice = signal<Notice | null>(null);

  private destroy$ = new Subject<void>();

  constructor(private notify: NotificationService) {}

  ngOnInit(): void {
    this.notify.notification
      .pipe(takeUntil(this.destroy$))
      .subscribe((n) => {
        this.notice.set(n);
        if (n) {
          setTimeout(() => this.notice.set(null), 3000); 
        }
      });
  }

  ngOnDestroy(): void {
    this.destroy$.next();
    this.destroy$.complete();
  }
}