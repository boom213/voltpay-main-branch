import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../services/auth.service';
import { DataService } from '../services/data.service';
import { NotificationService } from '../shared/notification/notification.service';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html'
})
export class ProfileComponent {
  private fb = inject(FormBuilder);
  private auth = inject(AuthService);
  private data = inject(DataService);
  private notify = inject(NotificationService);

  me = this.auth.user;

  form = this.fb.group({ name: ['', Validators.required], address: ['', Validators.required], mobile: ['', [Validators.required]] });

  constructor() { this.populate(); }

  populate() {
    const u = this.me();
    if (u) this.form.patchValue({ name: u.name, address: u.address, mobile: u.mobile });
  }

  save() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const u = this.me();
    if (!u) return;
    this.data.users().subscribe((list) => {
      const next = list.map((x) => x.id === u.id ? { ...x, ...this.form.value } : x);
      this.data.saveUsers(next);
      const updated = { ...u, ...this.form.value };
      this.auth.login(updated);
      this.notify.push('success', 'Profile updated');
    });
  }
}
