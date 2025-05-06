import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-register',
  template: `
    <div class="register-container">
      <h2>Create Account</h2>
      <p class="register-subtext">Join ContentFlow to publish your videos everywhere</p>
      
      <div *ngIf="error" class="alert alert-error mb-3">
        {{ error }}
      </div>
      
      <form [formGroup]="registerForm" (ngSubmit)="onSubmit()">
        <div class="form-group">
          <label for="name" class="form-label">Full Name</label>
          <input 
            type="text" 
            id="name" 
            formControlName="name" 
            class="form-control" 
            placeholder="Enter your name"
          >
          <small *ngIf="registerForm.get('name')?.invalid && registerForm.get('name')?.touched" class="text-error">
            Name is required
          </small>
        </div>
        
        <div class="form-group">
          <label for="email" class="form-label">Email</label>
          <input 
            type="email" 
            id="email" 
            formControlName="email" 
            class="form-control" 
            placeholder="Enter your email"
          >
          <small *ngIf="registerForm.get('email')?.invalid && registerForm.get('email')?.touched" class="text-error">
            Please enter a valid email
          </small>
        </div>
        
        <div class="form-group">
          <label for="password" class="form-label">Password</label>
          <input 
            type="password" 
            id="password" 
            formControlName="password" 
            class="form-control" 
            placeholder="Choose a password (min. 8 characters)"
          >
          <small *ngIf="registerForm.get('password')?.invalid && registerForm.get('password')?.touched" class="text-error">
            Password must be at least 8 characters
          </small>
        </div>
        
        <div class="form-group">
          <div class="checkbox-control">
            <input type="checkbox" id="terms" formControlName="terms">
            <label for="terms">
              I agree to the <a href="#">Terms of Service</a> and <a href="#">Privacy Policy</a>
            </label>
          </div>
          <small *ngIf="registerForm.get('terms')?.invalid && registerForm.get('terms')?.touched" class="text-error">
            You must agree to the terms and conditions
          </small>
        </div>
        
        <button 
          type="submit" 
          class="btn btn-primary btn-block" 
          [disabled]="registerForm.invalid || isLoading"
        >
          <span *ngIf="isLoading">
            <i class="material-icons spinning">refresh</i> Creating account...
          </span>
          <span *ngIf="!isLoading">Create Account</span>
        </button>
      </form>
      
      <div class="register-footer">
        <p>Already have an account? <a [routerLink]="['/auth/login']">Sign In</a></p>
      </div>
    </div>
  `,
  styles: [`
    .register-container {
      width: 100%;
    }
    
    h2 {
      margin-bottom: var(--space-2);
    }
    
    .register-subtext {
      color: var(--text-secondary);
      margin-bottom: var(--space-4);
    }
    
    .checkbox-control {
      display: flex;
      align-items: flex-start;
      gap: var(--space-2);
    }
    
    .checkbox-control input {
      margin-top: 4px;
    }
    
    .btn-block {
      width: 100%;
      margin-top: var(--space-4);
    }
    
    .register-footer {
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
export class RegisterComponent {
  registerForm: FormGroup;
  isLoading = false;
  error: string | null = null;
  
  constructor(
    private fb: FormBuilder,
    private authService: AuthService,
    private router: Router
  ) {
    this.registerForm = this.fb.group({
      name: ['', Validators.required],
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(8)]],
      terms: [false, Validators.requiredTrue]
    });
  }
  
  onSubmit(): void {
    if (this.registerForm.invalid || this.isLoading) {
      return;
    }
    
    this.isLoading = true;
    this.error = null;
    
    const { name, email, password } = this.registerForm.value;
    
    this.authService.register(email, password, name)
      .then(() => {
        this.router.navigate(['/dashboard']);
      })
      .catch(error => {
        console.error('Registration error:', error);
        
        // Display user-friendly error message
        if (error.code === 'auth/email-already-in-use') {
          this.error = 'This email is already in use. Please try a different email or sign in.';
        } else if (error.code === 'auth/weak-password') {
          this.error = 'The password is too weak. Please choose a stronger password.';
        } else {
          this.error = 'An error occurred during registration. Please try again.';
        }
      })
      .finally(() => {
        this.isLoading = false;
      });
  }
}