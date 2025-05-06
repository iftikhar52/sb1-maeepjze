import { Component } from '@angular/core';

@Component({
  selector: 'app-auth',
  template: `
    <div class="auth-container">
      <div class="auth-content">
        <div class="auth-header fade-in">
          <div class="logo">
            <span class="logo-icon">CF</span>
            <span class="logo-text">ContentFlow</span>
          </div>
          <h1>Your Content, Everywhere</h1>
          <p class="subtitle">Upload once, publish to TikTok, YouTube Shorts, Instagram Reels, and Facebook Reels</p>
        </div>
        
        <div class="auth-card slide-up">
          <router-outlet></router-outlet>
        </div>
      </div>
      
      <div class="auth-features">
        <div class="auth-features-inner">
          <h2>Why ContentFlow?</h2>
          
          <div class="feature-list">
            <div class="feature-item fade-in">
              <div class="feature-icon">📱</div>
              <div class="feature-details">
                <h3>Multi-Platform Publishing</h3>
                <p>Publish your content to all major short-video platforms with a single upload</p>
              </div>
            </div>
            
            <div class="feature-item fade-in">
              <div class="feature-icon">⏱️</div>
              <div class="feature-details">
                <h3>Smart Scheduling</h3>
                <p>Schedule your content to post at the optimal time for each platform</p>
              </div>
            </div>
            
            <div class="feature-item fade-in">
              <div class="feature-icon">📊</div>
              <div class="feature-details">
                <h3>Performance Analytics</h3>
                <p>Track views, engagement, and growth across all platforms in one dashboard</p>
              </div>
            </div>
            
            <div class="feature-item fade-in">
              <div class="feature-icon">🔄</div>
              <div class="feature-details">
                <h3>Automatic Formatting</h3>
                <p>Content is automatically formatted to meet the requirements of each platform</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  `,
  styles: [`
    .auth-container {
      display: flex;
      min-height: 100vh;
      background-color: var(--background);
    }
    
    .auth-content {
      width: 50%;
      padding: var(--space-6);
      display: flex;
      flex-direction: column;
      justify-content: center;
    }
    
    .auth-header {
      margin-bottom: var(--space-5);
    }
    
    .logo {
      display: flex;
      align-items: center;
      margin-bottom: var(--space-4);
    }
    
    .logo-icon {
      background-color: var(--primary);
      color: white;
      width: 40px;
      height: 40px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
      font-weight: 700;
      margin-right: var(--space-2);
    }
    
    .logo-text {
      font-size: 1.5rem;
      font-weight: 700;
      color: var(--primary);
    }
    
    h1 {
      margin-bottom: var(--space-2);
      font-size: 2.5rem;
      font-weight: 700;
      line-height: 1.2;
    }
    
    .subtitle {
      font-size: 1.125rem;
      color: var(--text-secondary);
      margin-bottom: var(--space-4);
    }
    
    .auth-card {
      background-color: var(--surface);
      border-radius: 8px;
      box-shadow: 0 4px 6px rgba(0, 0, 0, 0.1);
      padding: var(--space-5);
      max-width: 480px;
    }
    
    .auth-features {
      width: 50%;
      background: linear-gradient(to right, var(--primary-dark), var(--primary));
      color: white;
      display: flex;
      align-items: center;
      justify-content: center;
      padding: var(--space-6);
    }
    
    .auth-features-inner {
      max-width: 500px;
    }
    
    .auth-features h2 {
      margin-bottom: var(--space-5);
      font-size: 2rem;
      color: white;
    }
    
    .feature-list {
      display: flex;
      flex-direction: column;
      gap: var(--space-4);
    }
    
    .feature-item {
      display: flex;
      align-items: flex-start;
      gap: var(--space-3);
    }
    
    .feature-icon {
      font-size: 2rem;
      background-color: rgba(255, 255, 255, 0.2);
      width: 50px;
      height: 50px;
      border-radius: 8px;
      display: flex;
      align-items: center;
      justify-content: center;
    }
    
    .feature-details h3 {
      margin-bottom: var(--space-1);
      color: white;
    }
    
    .feature-details p {
      color: rgba(255, 255, 255, 0.8);
      line-height: 1.5;
    }
    
    @media (max-width: 992px) {
      .auth-container {
        flex-direction: column;
      }
      
      .auth-content,
      .auth-features {
        width: 100%;
      }
      
      .auth-content {
        padding: var(--space-4);
      }
      
      .auth-card {
        max-width: 100%;
      }
      
      .auth-features {
        padding: var(--space-4);
      }
    }
  `]
})
export class AuthComponent {}