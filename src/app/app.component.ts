import { Component, OnInit } from '@angular/core';
import { Router, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { AuthService } from './services/auth.service';

@Component({
  selector: 'app-root',
  template: `
  <h1>hi</h1>
    <ng-container *ngIf="isAuthPage; else mainLayout">
      <router-outlet></router-outlet>
    </ng-container>
    
    <ng-template #mainLayout>
      <div class="app-container">
        <app-sidebar *ngIf="isAuthenticated"></app-sidebar>
        <div class="content-container">
          <app-navbar *ngIf="isAuthenticated"></app-navbar>
          <main class="main-content">
            <router-outlet></router-outlet>
          </main>
        </div>
      </div>
    </ng-template>
  `,
  styles: [
    `
    .app-container {
      display: flex;
      height: 100vh;
      overflow: hidden;
    }
    
    .content-container {
      flex: 1;
      display: flex;
      flex-direction: column;
      overflow: hidden;
    }
    
    .main-content {
      flex: 1;
      padding: var(--space-4);
      overflow: auto;
    }
    
    @media (max-width: 768px) {
      .app-container {
        flex-direction: column;
      }
      
      .main-content {
        padding: var(--space-2);
      }
    }
  `,
  ],
})
export class AppComponent implements OnInit {
  isAuthPage = false;
  isAuthenticated = false;

  constructor(private router: Router, private authService: AuthService) {}

  ngOnInit(): void {
    // Track navigation to adjust layout for auth pages
    this.router.events
      .pipe(filter((event) => event instanceof NavigationEnd))
      .subscribe((event: any) => {
        this.isAuthPage = event.url.includes('/auth');
      });

    // Track authentication state
    this.authService.user$.subscribe((user) => {
      this.isAuthenticated = !!user;
    });
  }
}
