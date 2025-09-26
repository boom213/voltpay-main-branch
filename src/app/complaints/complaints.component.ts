import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { DataService, Complaint } from '../services/data.service';
import { AuthService } from '../services/auth.service';
import { NotificationService } from '../shared/notification/notification.service';

@Component({
  selector: 'app-complaints',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './complaints.component.html'
})
export class ComplaintsComponent {
  private fb = inject(FormBuilder);
  private data = inject(DataService);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);

  form = this.fb.group({ type: ['', Validators.required], description: ['', Validators.required] });

  complaints: Complaint[] = [];
  me = this.auth.user;

  constructor() { this.load(); }

  load() {
    this.data.complaints().subscribe((c) => {
      const uid = this.me()?.id ?? -1;
      this.complaints = c.filter(x => x.user_id === uid);
    });
  }

  submit() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const v = this.form.value as { type: string; description: string };
    const user_id = this.me()?.id ?? 0;
    this.data.addComplaint({ user_id, type: v.type, description: v.description });
    this.notify.push('success', 'Complaint registered');
    this.form.reset();
    setTimeout(()=> this.load(), 200);
  }
}
