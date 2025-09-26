import { Injectable, signal } from '@angular/core';
import { Router } from '@angular/router';

export interface SessionUser {
  id: number;
  name: string;
  email: string;
  address: string;
  mobile: string;
}

const LS_KEY = 'voltpay_session_user';

@Injectable({ providedIn: 'root' })
export class AuthService {
  user = signal<SessionUser | null>(this.read());

  constructor(private router: Router) {}

  private read(): SessionUser | null {
    try {
      const raw = localStorage.getItem(LS_KEY);
      return raw ? (JSON.parse(raw) as SessionUser) : null;
    } catch {
      return null;
    }
  }

  private write(user: SessionUser | null) {
    if (!user) localStorage.removeItem(LS_KEY);
    else localStorage.setItem(LS_KEY, JSON.stringify(user));
  }

  login(user: SessionUser) {
    this.user.set(user);
    this.write(user);
  }

  logout() {
    this.user.set(null);
    this.write(null);
    this.router.navigateByUrl('/login');
  }

  isAuthenticated() {
    return !!this.user();
  }
}
