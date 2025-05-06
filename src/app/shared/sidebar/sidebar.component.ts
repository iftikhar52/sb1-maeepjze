import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-sidebar',
  template: `
    <div class="sidebar" [class.collapsed]="isCollapsed">
      <div class="sidebar-header">
        <div class="logo-container">
          <div class="logo-icon">CF</div>
          <div class="logo-text" *ngIf="!isCollapsed">ContentFlow</div>
        </div>
        <button class="collapse-btn" (click)="toggleCollapse()">
          <i class="material-icons">{{ isCollapsed ? 'chevron_right' : 'chevron_left' }}</i>
        </button>
      </div>
      
      <div class="sidebar-content">
        <ul class="sidebar-menu">
          <li class="sidebar-item" [class.active]="isActive('/dashboard')">
            <a routerLink="/dashboard">
              <i class="material-icons">dashboard</i>
              <span *ngIf="!isCollapsed">Dashboard</span>
            </a>
          </li>
          
          <li class="sidebar-item" [class.active]="isActive('/upload')">
            <a routerLink="/upload">
              <i class="material-icons">cloud_upload</i>
              <span *ngIf="!isCollapsed">Upload</span>
            </a>
          </li>
          
          <li class="sidebar-item" [class.active]="isActive('/content')">
            <a routerLink="/content">
              <i class="material-icons">video_library</i>
              <span *ngIf="!isCollapsed">Content</span>
            </a>
          </li>
        </ul>
      </div>
      
      <div class="sidebar-footer">
        <div class="sidebar-item">
          <a routerLink="/profile">
            <i class="material-icons">settings</i>
            <span *ngIf="!isCollapsed">Settings</span>
          </a>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .sidebar {
      width: 240px;
      height: 100%;
      background-color: var(--surface);
      border-right: 1px solid var(--divider);
      display: flex;
      flex-direction: column;
      transition: width 0.3s ease;
      overflow: hidden;
    }
    
    .sidebar.collapsed {
      width: 64px;
    }
    
    .sidebar-header {
      padding: var(--space-3);
      display: flex;
      align-items: center;
      justify-content: space-between;
      border-bottom: 1px solid var(--divider);
    }
    
    .logo-container {
      display: flex;
      align-items: center;
    }
    
    .logo-icon {
      width: 32px;
      height: 32px;
      background-color: var(--primary);
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      border-radius: 8px;
      font-weight: 700;
      font-size: 14px;
    }
    
    .logo-text {
      margin-left: var(--space-2);
      font-weight: 700;
      font-size: 1.25rem;
      color: var(--primary);
    }
    
    .collapse-btn {
      width: 24px;
      height: 24px;
      border-radius: 50%;
      display: flex;
      align-items: center;
      justify-content: center;
      background-color: transparent;
      border: none;
      cursor: pointer;
      color: var(--text-secondary);
      transition: background-color 0.2s ease;
    }
    
    .collapse-btn:hover {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .sidebar-content {
      flex: 1;
      overflow-y: auto;
    }
    
    .sidebar-menu {
      list-style: none;
      padding: var(--space-2) 0;
    }
    
    .sidebar-item {
      margin-bottom: var(--space-1);
    }
    
    .sidebar-item a {
      display: flex;
      align-items: center;
      padding: var(--space-2) var(--space-3);
      color: var(--text-primary);
      text-decoration: none;
      border-radius: 4px;
      margin: 0 var(--space-1);
      transition: background-color 0.2s ease;
    }
    
    .sidebar-item a i {
      margin-right: var(--space-2);
      font-size: 20px;
    }
    
    .sidebar-item:hover a {
      background-color: rgba(0, 0, 0, 0.05);
    }
    
    .sidebar-item.active a {
      background-color: rgba(98, 0, 234, 0.1);
      color: var(--primary);
    }
    
    .sidebar-footer {
      border-top: 1px solid var(--divider);
      padding: var(--space-2) 0;
    }
  `]
})
export class SidebarComponent implements OnInit {
  isCollapsed = false;
  currentRoute = '';
  
  constructor(private router: Router) {}
  
  ngOnInit(): void {
    // Track current route for active state
    this.router.events.pipe(
      filter(event => event instanceof NavigationEnd)
    ).subscribe((event: any) => {
      this.currentRoute = event.url;
    });
    
    // Initialize with current route
    this.currentRoute = this.router.url;
    
    // Check viewport size for initial collapse state
    this.checkViewportSize();
    
    // Listen for window resize events
    window.addEventListener('resize', this.checkViewportSize.bind(this));
  }
  
  checkViewportSize(): void {
    this.isCollapsed = window.innerWidth < 992;
  }
  
  toggleCollapse(): void {
    this.isCollapsed = !this.isCollapsed;
  }
  
  isActive(route: string): boolean {
    return this.currentRoute.startsWith(route);
  }
}