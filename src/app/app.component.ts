import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: false
})
export class AppComponent implements OnInit {
  title(title: any) {
    throw new Error('Method not implemented.');
  }
  isSidebarCollapsed: boolean = false;
  showHeaderAndSidebar: boolean = false;
  isLoggedIn: boolean = false;
  showDialog: boolean = false;

  constructor(private router: Router) {}

  ngOnInit() {
    // Check if user is logged in
    this.isLoggedIn = !!localStorage.getItem('user');

    // Subscribe to router events to check the current route
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        // Show header and sidebar only on dashboard and support routes
        this.showHeaderAndSidebar =
          event.urlAfterRedirects.includes('/auth/dashboard') ||
          event.urlAfterRedirects.includes('/auth/support');
      });
  }

  toggleSidebar() {
    this.isSidebarCollapsed = !this.isSidebarCollapsed;
  }

  openDialog(): void {
    this.showDialog = true;
  }

  onDialogClose(result: any): void {
    this.showDialog = false;
    console.log('The dialog was closed', result);
  }

  logout(): void {
    console.log('Logging out...');
    localStorage.removeItem('user'); // Clear user from localStorage
    this.isLoggedIn = false;
    this.router.navigate(['/auth/login']);
  }
}
