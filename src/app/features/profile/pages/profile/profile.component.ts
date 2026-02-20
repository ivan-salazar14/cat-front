import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AuthService } from '../../../core/services/auth.service';
import { UserService } from '../../../core/services/user.service';
import { User } from '../../../core/models';

@Component({
  selector: 'app-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './profile.component.html',
  styleUrl: './profile.component.scss'
})
export class ProfileComponent implements OnInit {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);
  private userService = inject(UserService);

  private userSignal = signal<User | null>(null);
  private loadingSignal = signal<boolean>(false);
  private savingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);
  private successSignal = signal<string | null>(null);

  readonly user = this.userSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly saving = this.savingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();
  readonly success = this.successSignal.asReadonly();

  profileForm = this.fb.group({
    email: ['', [Validators.required, Validators.email]],
    username: ['', [Validators.required, Validators.minLength(3)]],
    avatar: ['']
  });

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    this.loadingSignal.set(true);

    this.userService.getCurrentUser().subscribe({
      next: (user) => {
        this.userSignal.set(user);
        this.profileForm.patchValue({
          email: user.email,
          username: user.username,
          avatar: user.avatar || ''
        });
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to load profile');
        this.loadingSignal.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.profileForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.savingSignal.set(true);
    this.errorSignal.set(null);
    this.successSignal.set(null);

    const formValue = this.profileForm.value;
    const user = this.userSignal();

    if (!user) return;

    this.userService.update(user.id, {
      email: formValue.email!,
      username: formValue.username!,
      avatar: formValue.avatar || undefined
    }).subscribe({
      next: (updatedUser) => {
        this.userSignal.set(updatedUser);
        this.successSignal.set('Profile updated successfully!');
        this.savingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to update profile');
        this.savingSignal.set(false);
      }
    });
  }

  logout(): void {
    this.authService.logout();
  }

  private markAllAsTouched(): void {
    Object.values(this.profileForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  get email() { return this.profileForm.get('email'); }
  get username() { return this.profileForm.get('username'); }
  get avatar() { return this.profileForm.get('avatar'); }
}