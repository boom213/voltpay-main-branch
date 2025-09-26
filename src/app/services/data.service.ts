import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { map, shareReplay } from 'rxjs/operators';
import { Observable } from 'rxjs';

export interface DataUser { id: number; name: string; email: string; password: string; address: string; mobile: string; }
export interface Bill { bill_id: string; user_id: number; amount: number; due_date: string; status: 'Paid' | 'Due' | 'Overdue'; }
export interface Complaint { complaint_id: string; user_id: number; type: string; status: 'Open' | 'Resolved' | 'In Progress'; description?: string; }
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
const LS_BILLS = 'voltpay_bills';
const LS_COMPLAINTS = 'voltpay_complaints';
const LS_ACTS = 'voltpay_activities';
const LS_NOTIFS = 'voltpay_notifications';

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

  bills(): Observable<Bill[]> {
    return this.base$.pipe(
      map((d) => {
        const override = localStorage.getItem(LS_BILLS);
        if (override) return JSON.parse(override) as Bill[];
        return d.bills;
      })
    );
  }

  saveBills(bills: Bill[]) {
    localStorage.setItem(LS_BILLS, JSON.stringify(bills));
  }

  complaints(): Observable<Complaint[]> {
    return this.base$.pipe(
      map((d) => {
        const override = localStorage.getItem(LS_COMPLAINTS);
        if (override) return JSON.parse(override) as Complaint[];
        return d.complaints;
      })
    );
  }

  saveComplaints(items: Complaint[]) {
    localStorage.setItem(LS_COMPLAINTS, JSON.stringify(items));
  }

  activities(): Observable<Activity[]> { return this.base$.pipe(map((d) => {
    const override = localStorage.getItem(LS_ACTS);
    if (override) return JSON.parse(override) as Activity[];
    return d.activities;
  })); }

  saveActivities(items: Activity[]) { localStorage.setItem(LS_ACTS, JSON.stringify(items)); }

  notifications(): Observable<NotificationItem[]> { return this.base$.pipe(map((d) => {
    const override = localStorage.getItem(LS_NOTIFS);
    if (override) return JSON.parse(override) as NotificationItem[];
    return d.notifications;
  })); }

  saveNotifications(items: NotificationItem[]) { localStorage.setItem(LS_NOTIFS, JSON.stringify(items)); }

  // Helpers
  addComplaint(c: Omit<Complaint, 'complaint_id' | 'status'> & { status?: Complaint['status'] }) {
    this.complaints().subscribe((list) => {
      const nextId = `C-${Math.floor(1000 + Math.random() * 9000)}`;
      const next = [...list, { complaint_id: nextId, status: c.status ?? 'Open', ...c } as Complaint];
      this.saveComplaints(next);
    });
  }

  payBill(billId: string, userId: number) {
    this.bills().subscribe((list) => {
      const next = list.map((b) => {
        if (b.bill_id === billId && b.user_id === userId) return { ...b, status: 'Paid' };
        return b;
      });
      this.saveBills(next);
    });
  }

  addActivity(a: Omit<Activity, 'id' | 'date'>) {
    this.activities().subscribe((list) => {
      const nextId = `A-${Math.floor(1000 + Math.random() * 9000)}`;
      const now = new Date().toISOString();
      const next = [...list, { id: nextId, date: now, ...a } as Activity];
      this.saveActivities(next);
    });
  }
}
