import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { NotificationService } from '../shared/notification/notification.service';

interface Msg { id: string; from: 'user' | 'bot'; text: string; time: string; }

@Component({
  selector: 'app-help',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './help.component.html'
})
export class HelpComponent {
  private fb = inject(FormBuilder);
  private notify = inject(NotificationService);

  form = this.fb.group({ message: ['', Validators.required] });
  messages = signal<Msg[]>([]);

  send() {
    if (this.form.invalid) return this.form.markAllAsTouched();
    const text = this.form.value.message as string;
    const id = `M-${Date.now()}`;
    const now = new Date().toISOString();
    this.messages.update(m => [...m, { id, from: 'user', text, time: now }]);
    this.form.reset();
    this.notify.push('info', 'Message sent to support');
    setTimeout(() => this.botReply(text), 900);
  }

  botReply(userText: string) {
    const id = `M-${Date.now()+1}`;
    const now = new Date().toISOString();
    const reply = `Hi! We received your message: "${userText.substring(0,80)}". Our team will contact you soon.`;
    this.messages.update(m => [...m, { id, from: 'bot', text: reply, time: now }]);
  }
}
