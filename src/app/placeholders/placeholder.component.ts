import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-placeholder',
  standalone: true,
  imports: [CommonModule],
  template: `
    <div class="container py-5">
      <div class="text-center">
        <h1 class="display-6 fw-bold">{{ title }}</h1>
        <p class="lead text-muted">This page is coming next. Ask to generate it and we'll build it with full features.</p>
      </div>
    </div>
  `
})
export class PlaceholderComponent {
  protected title = inject(ActivatedRoute).snapshot.data['title'] ?? 'Coming Soon';
}
