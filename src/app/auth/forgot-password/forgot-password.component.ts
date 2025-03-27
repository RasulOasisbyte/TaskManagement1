import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Router } from '@angular/router';

@Component({
  selector: 'app-forgot-password',
  templateUrl: './forgot-password.component.html',
  styleUrls: ['./forgot-password.component.scss'],
  standalone: false,
})
export class ForgotPasswordComponent implements OnInit {
  forgotPasswordForm!: FormGroup;
  submittedForgotPassword = false;
  isLoading = false;

  constructor(
    private fb: FormBuilder,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.forgotPasswordForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
    });
  }

  // Getter for form controls
  get fp() {
    return this.forgotPasswordForm.controls;
  }

  onForgotPasswordSubmit(): void {
    this.submittedForgotPassword = true;

    if (this.forgotPasswordForm.invalid) {
      return;
    }

    this.isLoading = true;
    // Simulate sending a reset link (replace with actual API call)
    setTimeout(() => {
      this.isLoading = false;
      console.log('Reset link sent to', this.forgotPasswordForm.value.email);
      this.router.navigate(['/auth/login']);
    }, 1000);
  }
}
