import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface DataUser { id: number; name: string; email: string; password: string; address: string; mobile: string; }
export interface Bill { bill_id: string; user_id: number; amount: number; due_date: string; status: 'Paid' | 'Due' | 'Overdue'; }
export interface Complaint { complaint_id: string; user_id: number; type: string; status: 'Open' | 'Resolved' | 'In Progress'; }
export interface Activity { id: string; user_id: number; date: string; text: string; }
export interface NotificationItem { id: string; user_id: number; type: 'success' | 'info' | 'warning' | 'danger'; message: string; }

export interface DataShape {
  users: DataUser[];
  bills: Bill[];
  complaints: Complaint[];
  activities: Activity[];
  notifications: NotificationItem[];
}

const LS_USERS = 'voltpay_users';

@Injectable({ providedIn: 'root' })
export class DataService {
  constructor(private http: HttpClient) {}

  private base$ = this.http.get<DataShape>('/data.json').pipe(shareReplay(1));

  users(): Observable<DataUser[]> {
    return this.base$.pipe(
      map((d) => {
        const override = localStorage.getItem(LS_USERS);
        if (override) return JSON.parse(override) as DataUser[];
        return d.users;
      })
    );
  }

  saveUsers(users: DataUser[]) {
    localStorage.setItem(LS_USERS, JSON.stringify(users));
  }

  bills(): Observable<Bill[]> { return this.base$.pipe(map((d) => d.bills)); }
  complaints(): Observable<Complaint[]> { return this.base$.pipe(map((d) => d.complaints)); }
  activities(): Observable<Activity[]> { return this.base$.pipe(map((d) => d.activities)); }
  notifications(): Observable<NotificationItem[]> { return this.base$.pipe(map((d) => d.notifications)); }
}
