import { Component } from "@angular/core";

@Component({
  selector: "app-footer",
  standalone: true,
  template: `
    <footer class="bg-dark text-light py-4 mt-auto">
      <div class="container d-flex justify-content-between align-items-center">
        <span class="small">© {{ year }} VoltPay. All rights reserved.</span>
        <div class="small opacity-75">Made with Angular & Bootstrap</div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  year = new Date().getFullYear();
}
