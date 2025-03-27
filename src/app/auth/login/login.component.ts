import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { trigger, transition, style, animate } from '@angular/animations';
import { CheckboxChangeEvent } from 'primeng/checkbox';


@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.scss'],
  standalone:false,
  animations: [
    trigger('fadeIn', [
      transition(':enter', [
        style({ opacity: 0.5, transform: 'translateY(20px)' }),
        animate('0.2s ease-in', style({ opacity: 1, transform: 'translateY(0)' })),
      ]),
    ]),
  ],
})
export class LoginComponent implements OnInit {
  loginForm: FormGroup;
  submittedLogin: boolean = false;
  isLoading: boolean = false;
  errorMessage: string | null = null;
  isFormVisible: boolean = true;

  constructor(private fb: FormBuilder, private router: Router) {
    // Initialize the login form
    this.loginForm = this.fb.group({
      username: ['', [Validators.required, Validators.email]], // Ensure non-empty and valid email
      password: ['', [Validators.required, Validators.minLength(1)]], // Ensure non-empty
      rememberMe: [false],
    });
  }

  ngOnInit(): void {
    this.checkRememberMe();
  }

  // Getter for easy access to form controls in the template
  get f() {
    return this.loginForm.controls;
  }

  // Handle the "remember me" checkbox
  onRememberMeChange(event: CheckboxChangeEvent): void {
    if (!event.checked) {
      localStorage.removeItem('rememberedUser');
    }
    console.log('Remember me updated:', event.checked);
  }

  // Pre-fill the form if "remember me" is checked
  private checkRememberMe(): void {
    const rememberedUser = localStorage.getItem('rememberedUser');
    if (rememberedUser) {
      const userData = JSON.parse(rememberedUser);
      this.loginForm.patchValue({
        username: userData.username,
        rememberMe: true,
      });
    }
  }

  // Handle form submission
  onLoginSubmit(): void {
    this.submittedLogin = true;
    this.errorMessage = null;

    if (this.loginForm.invalid) {
      this.errorMessage = 'Please fill in all fields with valid data.';
      return;
    }

    this.isLoading = true;
    const { username, password, rememberMe } = this.loginForm.value;

    // Simulate a delay for loading and handle "remember me" functionality
    setTimeout(() => {
      this.isLoading = false;
      if (rememberMe) {
        localStorage.setItem('rememberedUser', JSON.stringify({ username }));
      } else {
        localStorage.removeItem('rememberedUser');
      }
      console.log('Login with credentials:', { username, password });
      this.onLoginSuccess();
    }, 1000); // 1-second delay
  }

  // Navigate to the signup page
  switchToSignUp(event: MouseEvent): void {
    event.preventDefault();
    this.goToSignup();
  }

  // Navigate to the forgot-password page
  switchToForgotPassword(event: MouseEvent): void {
    event.preventDefault();
    this.goToForgotPassword();
  }

  // Reset the form
  resetForm(): void {
    this.loginForm.reset();
    this.submittedLogin = false;
    this.errorMessage = null;
  }

  onLoginSuccess() {
    this.router.navigate(['/auth/dashboard']);
  }

  goToForgotPassword() {
    this.router.navigate(['/auth/forgotpassword']);
  }

  goToSignup() {
    this.router.navigate(['/auth/signup']);
  }



goToSupport(){
  this.router.navigate([['/auth/support/dashboard']]);
}
}
