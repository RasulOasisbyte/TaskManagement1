import { Component, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-header',
  standalone: false,

  templateUrl: './header.component.html',
  styleUrl: './header.component.scss'
})
export class HeaderComponent {
openDialog() {
throw new Error('Method not implemented.');
}
  @Output() toggleSidebarEvent = new EventEmitter<void>();
  @Output() openDialogEvent = new EventEmitter<void>();

  toggleSidebar(): void {
    this.toggleSidebarEvent.emit();
  }

  openAddTaskDialog(): void {
    this.openDialogEvent.emit();
  }

  logout(): void {
    // Add logout logic here
    localStorage.removeItem('authToken');
    // Navigate to login page
  }
}
