import { Component, inject } from "@angular/core";
import { CommonModule } from "@angular/common";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { DataService, DataUser } from "../../services/data.service";
import { NotificationService } from "../../shared/notification/notification.service";

@Component({
  selector: "app-register",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./register.component.html",
})
export class RegisterComponent {
  private fb = inject(FormBuilder);
  private data = inject(DataService);
  private notify = inject(NotificationService);
  private router = inject(Router);

  form = this.fb.group({
    name: ["", [Validators.required, Validators.minLength(2)]],
    email: ["", [Validators.required, Validators.email]],
    password: [
      "",
      [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[A-Z])(?=.*[a-z])(?=.*\d).+$/),
      ],
    ],
    address: ["", [Validators.required, Validators.minLength(4)]],
    mobile: [
      "",
      [Validators.required, Validators.pattern(/^[0-9+\-\s]{10,}$/)],
    ],
  });

  submitting = false;
  error: string | null = null;

  submit() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.submitting = true;
    this.data.users().subscribe((users) => {
      const v = this.form.value as Required<DataUser>;
      if (users.some((u) => u.email.toLowerCase() === v.email.toLowerCase())) {
        this.error = "Email already registered";
        this.submitting = false;
        return;
      }
      const nextId = Math.max(...users.map((u) => u.id), 0) + 1;
      const next = [...users, { ...v, id: nextId } as DataUser];
      this.data.saveUsers(next);
      this.error = null;
      this.submitting = false;
      this.notify.push("success", "Registration Successful! Please sign in.");
      this.router.navigateByUrl("/login");
    });
  }
}
