import { Component, inject } from '@angular/core';
import { CommonModule, NgFor } from '@angular/common';
import { DataService, Bill } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { Observable } from 'rxjs';
import { NotificationService } from '../shared/notification/notification.service';

@Component({
  selector: 'app-bills',
  standalone: true,
  imports: [CommonModule, NgFor],
  templateUrl: './bills.component.html'
})
export class BillsComponent {
  private data = inject(DataService);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);

  bills$!: Observable<Bill[]>;
  me = this.auth.user;

  constructor() {
    this.load();
  }

  load() {
    this.bills$ = this.data.bills();
  }

  pay(b: Bill) {
    const confirm = window.confirm(`Pay ${b.amount} for ${b.bill_id} via UPI?`);
    if (!confirm) return;
    this.data.payBill(b.bill_id, b.user_id);
    this.data.addActivity({ user_id: b.user_id, text: `Paid bill ${b.bill_id} via UPI` });
    this.notify.push('success', `Payment successful for ${b.bill_id}`);
    setTimeout(() => this.load(), 300);
  }
}
