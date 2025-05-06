import { Component } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  template: `
    <nav class="navbar">
      <div class="navbar-start">
        <div class="search-container">
          <i class="material-icons">search</i>
          <input type="text" placeholder="Search content..." class="search-input">
        </div>
      </div>
      
      <div class="navbar-end">
        <div class="notification-icon">
          <i class="material-icons">notifications_none</i>
          <span class="notification-badge">2</span>
        </div>
        
        <div class="user-dropdown" (clickOutside)="isDropdownOpen = false">
          <div class="user-info" (click)="toggleDropdown($event)">
            <div class="user-avatar">
              <span *ngIf="!currentUser?.photoURL">{{ userInitials }}</span>
              <img *ngIf="currentUser?.photoURL" [src]="currentUser.photoURL" alt="User avatar">
            </div>
            <span class="user-name">{{ currentUser?.displayName }}</span>
            <i class="material-icons">arrow_drop_down</i>
          </div>
          
          <div class="dropdown-menu" *ngIf="isDropdownOpen">
            <a class="dropdown-item" routerLink="/profile">
              <i class="material-icons">person</i> My Profile
            </a>
            <a class="dropdown-item" routerLink="/platforms">
              <i class="material-icons">device_hub</i> Platforms
            </a>
            <div class="dropdown-divider"></div>
            <a class="dropdown-item" (click)="logout()">
              <i class="material-icons">exit_to_app</i> Sign Out
            </a>
          </div>
        </div>
      </div>
    </nav>
  `,
  styles: [`
    .navbar {
      display: flex;
      align-items: center;
      justify-content: space-between;
      padding: var(--space-3) var(--space-4);
      background-color: var(--surface);
      border-bottom: 1px solid var(--divider);
    }
    
    .navbar-start, .navbar-end {
      display: flex;
      align-items: center;
    }
    
    .search-container {
      position: relative;
      width: 300px;
    }
    
    .search-container i {
      position: absolute;
      left: var(--space-2);
      top: 50%;
      transform: translateY(-50%);
      color: var(--text-hint);
    }
    
    .search-input {
      width: 100%;
      padding: var(--space-2) var(--space-2) var(--space-2) var(--space-5);
      border: 1px solid var(--divider);
      border-radius: 4px;
      background-color: var(--background);
      font-size: 0.875rem;
    }
    
    .notification-icon {
      margin-right: var(--space-4);
      position: relative;
      cursor: pointer;
    }
    
    .notification-icon i {
      font-size: 24px;
      color: var(--text-secondary);
    }
    
    .notification-badge {
      position: absolute;
      top: -5px;
      right: -5px;
      background-color: var(--error);
      color: white;
      font-size: 10px;
      width: 16px;
      height: 16px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .user-dropdown {
      position: relative;
    }
    
    .user-info {
      display: flex;
      align-items: center;
      cursor: pointer;
      padding: var(--space-1) var(--space-2);
      border-radius: 4px;
      transition: background-color 0.2s ease;
    }
    
    .user-info:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .user-avatar {
      width: 32px;
      height: 32px;
      border-radius: 50%;
      background-color: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      margin-right: var(--space-2);
      font-size: 0.875rem;
      font-weight: 500;
      overflow: hidden;
    }
    
    .user-avatar img {
      width: 100%;
      height: 100%;
      object-fit: cover;
    }
    
    .user-name {
      margin-right: var(--space-1);
      font-weight: 500;
    }
    
    .dropdown-menu {
      position: absolute;
      top: 100%;
      right: 0;
      background-color: var(--surface);
      border-radius: 4px;
      box-shadow: 0 2px 10px rgba(0, 0, 0, 0.1);
      min-width: 200px;
      margin-top: var(--space-1);
      z-index: 1000;
    }
    
    .dropdown-item {
      display: flex;
      align-items: center;
      padding: var(--space-2) var(--space-3);
      color: var(--text-primary);
      transition: background-color 0.2s ease;
      cursor: pointer;
    }
    
    .dropdown-item i {
      margin-right: var(--space-2);
      font-size: 18px;
      color: var(--text-secondary);
    }
    
    .dropdown-item:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .dropdown-divider {
      height: 1px;
      background-color: var(--divider);
      margin: var(--space-1) 0;
    }
  `]
})
export class NavbarComponent {
  isDropdownOpen = false;
  currentUser: any = null;
  
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
    this.authService.user$.subscribe(user => {
      this.currentUser = user;
    });
  }
  
  get userInitials(): string {
    const displayName = this.currentUser?.displayName || '';
    if (!displayName) return '?';
    
    const nameParts = displayName.split(' ');
    if (nameParts.length > 1) {
      return (nameParts[0][0] + nameParts[1][0]).toUpperCase();
    }
    
    return displayName[0].toUpperCase();
  }
  
  toggleDropdown(event: Event): void {
    event.stopPropagation();
    this.isDropdownOpen = !this.isDropdownOpen;
  }
  
  logout(): void {
    this.authService.logout()
      .then(() => {
        this.router.navigate(['/auth/login']);
      })
      .catch(error => {
        console.error('Logout error:', error);
      });
  }
}