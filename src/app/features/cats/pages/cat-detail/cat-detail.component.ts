import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { CatService } from '../../../core/services/cat.service';
import { Cat } from '../../../core/models';

@Component({
  selector: 'app-cat-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cat-detail.component.html',
  styleUrl: './cat-detail.component.scss'
})
export class CatDetailComponent implements OnInit {
  private catService = inject(CatService);
  private route = inject(ActivatedRoute);
  private router = inject(Router);

  private catSignal = signal<Cat | null>(null);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly cat = this.catSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  ngOnInit(): void {
    const catId = this.route.snapshot.paramMap.get('id');
    if (catId) {
      this.loadCat(catId);
    } else {
      this.router.navigate(['/cats']);
    }
  }

  loadCat(id: string): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.catService.getById(id).subscribe({
      next: (cat) => {
        this.catSignal.set(cat);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to load cat');
        this.loadingSignal.set(false);
      }
    });
  }

  goBack(): void {
    this.router.navigate(['/cats']);
  }

  editCat(): void {
    const cat = this.catSignal();
    if (cat) {
      this.router.navigate(['/cats', cat.id, 'edit']);
    }
  }

  deleteCat(): void {
    const cat = this.catSignal();
    if (!cat) return;

    if (confirm(`Are you sure you want to delete ${cat.name}?`)) {
      this.catService.delete(cat.id).subscribe({
        next: () => {
          this.router.navigate(['/cats']);
        },
        error: (error) => {
          this.errorSignal.set(error.error?.message || 'Failed to delete cat');
        }
      });
    }
  }
}