import { Injectable } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

export type NoticeType = 'success' | 'info' | 'warning' | 'danger';

export interface Notice {
  type: NoticeType;
  message: string;
}

@Injectable({ providedIn: 'root' })
export class NotificationService {
  private notice$ = new BehaviorSubject<Notice | null>(null);

  get notification() {
    return this.notice$.asObservable();
  }

  push(type: NoticeType, message: string) {
    this.notice$.next({ type, message });
    setTimeout(() => {
      this.clear();
    }, 4000);
  }

  clear() {
    this.notice$.next(null);
  }
}
