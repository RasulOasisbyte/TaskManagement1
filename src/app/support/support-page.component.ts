import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';


@Component({
  selector: 'app-support-page',
  templateUrl:'./support-page.component.html',
  styleUrls: ['./support-page.component.scss'],
  standalone:false,
})
export class SupportPageComponent implements OnInit {

isLoggedIn: any;
isSidebarCollapsed: boolean;
isActive(arg0: string): any {
throw new Error('Method not implemented.');
}
support() {
throw new Error('Method not implemented.');
}
toggleSidebar() {
throw new Error('Method not implemented.');
}
logout() {
throw new Error('Method not implemented.');
}
  cartCount: number = 0; // Example cart count, can be dynamic

  constructor(private router: Router) {}

  ngOnInit(): void {
    // You can fetch the cart count from a service or API here
    this.cartCount = 3; // Static value for demo purposes
  }

  DashboardComponent(): void {
    // Navigate to the logout route
    this.router.navigate(['/auth/support/dashboard']);
  }
}


