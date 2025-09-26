import { CommonModule, CurrencyPipe, DatePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, computed } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataService, Bill, Activity } from '../services/data.service';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule, NgIf, NgFor, CurrencyPipe, DatePipe],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private auth = inject(AuthService);
  private data = inject(DataService);

  me = this.auth.user;

  billsDue$ = this.data.bills();
  activities$ = this.data.activities();

  nextDue$ = this.billsDue$;

  totalDue = computed(() => 0);
}
