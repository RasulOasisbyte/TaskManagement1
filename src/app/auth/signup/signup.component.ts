import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';


@Component({
  selector: 'app-sign-up',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.scss'],
  standalone: false
})
export class SignUpComponent implements OnInit {
  signUpForm: FormGroup;
  submittedSignUp = false;
  isLoading = false;
  errorMessage: string | null = null;

  constructor(private fb: FormBuilder, private router: Router) {
    // Define the form with validation
    this.signUpForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [Validators.required, Validators.minLength(6)]],
      confirmPassword: ['', [Validators.required]]
    }, { validator: this.passwordsMatchValidator });
  }

  ngOnInit(): void {
    console.log('Password is created , you can proceed with sign-in');
  }


  // Custom validator to check if passwords match
  private passwordsMatchValidator(form: FormGroup): any {
    const password = form.get('password')?.value;
    const confirmPassword = form.get('confirmPassword')?.value;
    return password === confirmPassword ? null : { mismatch: true };
  }

  // Form submission logic
  onSubmit(): void {
    this.submittedSignUp = true;

    // Check for form errors
    if (this.signUpForm.invalid) {
      this.errorMessage = 'Please fill in all fields correctly.';
      return;
    }

    this.isLoading = true;
    setTimeout(() => {
      this.isLoading = false;
      console.log('Sign Up successful with data:', this.signUpForm.value);

      // Redirect to the login page after signup
      this.router.navigate(['/auth/login']);
    }, 1000);
  }

  // Navigate to forgot password page
  switchToForgotPassword(): void {
    this.router.navigate(['/auth/forgot-password']);
  }
}
