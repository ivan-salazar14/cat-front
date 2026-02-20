import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { CatService } from '../../../core/services/cat.service';
import { Cat } from '../../../core/models';

@Component({
  selector: 'app-cat-form',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './cat-form.component.html',
  styleUrl: './cat-form.component.scss'
})
export class CatFormComponent implements OnInit {
  private fb = inject(FormBuilder);
  private catService = inject(CatService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private catSignal = signal<Cat | null>(null);
  private isEditModeSignal = signal<boolean>(false);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly cat = this.catSignal.asReadonly();
  readonly isEditMode = this.isEditModeSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  catForm = this.fb.group({
    name: ['', [Validators.required, Validators.minLength(2)]],
    breed: ['', [Validators.required]],
    age: [0, [Validators.required, Validators.min(0), Validators.max(30)]],
    description: [''],
    imageUrl: ['', [Validators.required, Validators.pattern('https?://.*')]]
  });

  ngOnInit(): void {
    const catId = this.route.snapshot.paramMap.get('id');
    if (catId) {
      this.isEditModeSignal.set(true);
      this.loadCat(catId);
    }
  }

  loadCat(id: string): void {
    this.loadingSignal.set(true);

    this.catService.getById(id).subscribe({
      next: (cat) => {
        this.catSignal.set(cat);
        this.catForm.patchValue({
          name: cat.name,
          breed: cat.breed,
          age: cat.age,
          description: cat.description || '',
          imageUrl: cat.imageUrl
        });
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to load cat');
        this.loadingSignal.set(false);
      }
    });
  }

  onSubmit(): void {
    if (this.catForm.invalid) {
      this.markAllAsTouched();
      return;
    }

    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    const formValue = this.catForm.value;

    if (this.isEditMode()) {
      this.updateCat(formValue);
    } else {
      this.createCat(formValue);
    }
  }

  private createCat(formValue: typeof this.catForm.value): void {
    this.catService.create({
      name: formValue.name!,
      breed: formValue.breed!,
      age: formValue.age!,
      description: formValue.description || undefined,
      imageUrl: formValue.imageUrl!
    }).subscribe({
      next: () => {
        this.router.navigate(['/cats']);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to create cat');
        this.loadingSignal.set(false);
      }
    });
  }

  private updateCat(formValue: typeof this.catForm.value): void {
    const cat = this.catSignal();
    if (!cat) return;

    this.catService.update(cat.id, {
      name: formValue.name!,
      breed: formValue.breed!,
      age: formValue.age!,
      description: formValue.description || undefined,
      imageUrl: formValue.imageUrl!
    }).subscribe({
      next: () => {
        this.router.navigate(['/cats', cat.id]);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to update cat');
        this.loadingSignal.set(false);
      }
    });
  }

  private markAllAsTouched(): void {
    Object.values(this.catForm.controls).forEach(control => {
      control.markAsTouched();
    });
  }

  goBack(): void {
    this.router.navigate(['/cats']);
  }

  get name() { return this.catForm.get('name'); }
  get breed() { return this.catForm.get('breed'); }
  get age() { return this.catForm.get('age'); }
  get description() { return this.catForm.get('description'); }
  get imageUrl() { return this.catForm.get('imageUrl'); }
}