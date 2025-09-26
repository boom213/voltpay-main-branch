import { CommonModule } from '@angular/common';
import { Component, inject } from '@angular/core';
import { AuthService } from '../services/auth.service';
import { DataService, Bill, Activity } from '../services/data.service';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './dashboard.component.html'
})
export class DashboardComponent {
  private auth = inject(AuthService);
  private data = inject(DataService);

  me = this.auth.user;

  bills$ = this.data.bills();
  activities$ = this.data.activities();

  nextDue$: Observable<Bill | undefined> = this.bills$.pipe(map(list => list.find(b => b.status === 'Due')));
}
