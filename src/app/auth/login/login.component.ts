import { Component, inject } from "@angular/core";
import { FormBuilder, ReactiveFormsModule, Validators } from "@angular/forms";
import { Router, RouterLink } from "@angular/router";
import { CommonModule } from "@angular/common";
import { DataService } from "../../services/data.service";
import { AuthService } from "../../services/auth.service";
import { NotificationService } from "../../shared/notification/notification.service";

@Component({
  selector: "app-login",
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, RouterLink],
  templateUrl: "./login.component.html",
})
export class LoginComponent {
  private fb = inject(FormBuilder);
  private data = inject(DataService);
  private auth = inject(AuthService);
  private notify = inject(NotificationService);
  private router = inject(Router);

  form = this.fb.group({
    email: ["", [Validators.required, Validators.email]],
    password: ["", [Validators.required, Validators.minLength(8)]],
  });

  loading = false;
  error: string | null = null;

  submit() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    this.loading = true;
    this.data.users().subscribe((users) => {
      const { email, password } = this.form.value as {
        email: string;
        password: string;
      };
      const user = users.find(
        (u) =>
          u.email.toLowerCase() === email.toLowerCase() &&
          u.password === password,
      );
      this.loading = false;
      if (!user) {
        this.error = "Invalid email or password";
        return;
      }
      this.error = null;
      this.auth.login({
        id: user.id,
        name: user.name,
        email: user.email,
        address: user.address,
        mobile: user.mobile,
      });
      this.notify.push("success", "Welcome back!");
      this.router.navigateByUrl("/dashboard");
    });
  }
}
