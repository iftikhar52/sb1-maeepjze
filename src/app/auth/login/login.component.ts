import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-login',
  template: `
    <div class="login-container">
      <h2>Welcome Back</h2>
      <p class="login-subtext">Sign in to continue to your account</p>
      
      <div *ngIf="error" class="alert alert-error mb-3">
        {{ error }}
      </div>
      
      <form [formGroup]="loginForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input 
            type="email" 
            id="email" 
            formControlName="email" 
            class="form-control" 
            placeholder="Enter your email"
          >
          <small *ngIf="loginForm.get('email')?.invalid && loginForm.get('email')?.touched" class="text-error">
            Please enter a valid email
          </small>
        </div>
        
        <div class="form-group">
          <div class="password-header">
            <label for="password" class="form-label">Password</label>
            <a href="javascript:void(0)" (click)="onResetPassword()" class="forgot-password">
              Forgot Password?
            </a>
          </div>
          <input 
            type="password" 
            id="password" 
            formControlName="password" 
            class="form-control" 
            placeholder="Enter your password"
          >
          <small *ngIf="loginForm.get('password')?.invalid && loginForm.get('password')?.touched" class="text-error">
            Password is required
          </small>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary btn-block" 
          [disabled]="loginForm.invalid || isLoading"
        >
          <span *ngIf="isLoading">
            <i class="material-icons spinning">refresh</i> Signing in...
          </span>
          <span *ngIf="!isLoading">Sign In</span>
        </button>
      </form>
      
      <div class="login-footer">
        <p>Don't have an account? <a [routerLink]="['/auth/register']">Create Account</a></p>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      width: 100%;
    }
    
    h2 {
      margin-bottom: var(--space-2);
    }
    
    .login-subtext {
      color: var(--text-secondary);
      margin-bottom: var(--space-4);
    }
    
    .password-header {
      display: flex;
      justify-content: space-between;
      align-items: center;
    }
    
    .forgot-password {
      font-size: 0.85rem;
    }
    
    .btn-block {
      width: 100%;
      margin-top: var(--space-4);
    }
    
    .login-footer {
      margin-top: var(--space-4);
      text-align: center;
      color: var(--text-secondary);
    }
    
    .spinning {
      animation: spin 1s linear infinite;
    }
    
    .text-error {
      color: var(--error);
      font-size: 0.85rem;
      display: block;
      margin-top: var(--space-1);
    }
    
    .alert {
      padding: var(--space-2);
      border-radius: 4px;
      margin-bottom: var(--space-3);
    }
    
    .alert-error {
      background-color: rgba(244, 67, 54, 0.1);
      color: var(--error);
      border: 1px solid rgba(244, 67, 54, 0.2);
    }
    
    @keyframes spin {
      100% { transform: rotate(360deg); }
    }
  `]
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  returnUrl: string = '/dashboard';
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router,
    private route: ActivatedRoute
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }
  
  ngOnInit(): void {
    // Get the return URL from route parameters or default to '/dashboard'
    this.returnUrl = this.route.snapshot.queryParams['returnUrl'] || '/dashboard';
  }
  
  onSubmit(): void {
    if (this.loginForm.invalid || this.isLoading) {
      return;
    }
    
    this.isLoading = true;
    this.error = null;
    
    const { email, password } = this.loginForm.value;
    
    this.authService.login(email, password)
      .then(() => {
        this.router.navigateByUrl(this.returnUrl);
      })
      .catch(error => {
        console.error('Login error:', error);
        
        // Display user-friendly error message
        if (error.code === 'auth/user-not-found' || error.code === 'auth/wrong-password') {
          this.error = 'Invalid email or password. Please try again.';
        } else if (error.code === 'auth/too-many-requests') {
          this.error = 'Too many failed login attempts. Please try again later.';
        } else {
          this.error = 'An error occurred during sign in. Please try again.';
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
  
  onResetPassword(): void {
    const email = this.loginForm.get('email')?.value;
    
    if (!email) {
      this.error = 'Please enter your email address to reset your password.';
      return;
    }
    
    this.isLoading = true;
    this.error = null;
    
    this.authService.resetPassword(email)
      .then(() => {
        alert('Password reset email sent. Please check your inbox.');
      })
      .catch(error => {
        console.error('Password reset error:', error);
        this.error = 'Failed to send password reset email. Please try again.';
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}