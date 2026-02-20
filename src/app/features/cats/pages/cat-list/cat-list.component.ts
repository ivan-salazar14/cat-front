import { Component, inject, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { CatService } from '../../../core/services/cat.service';
import { Cat } from '../../../core/models';

@Component({
  selector: 'app-cat-list',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cat-list.component.html',
  styleUrl: './cat-list.component.scss'
})
export class CatListComponent implements OnInit {
  private catService = inject(CatService);
  private router = inject(Router);

  private catsSignal = signal<Cat[]>([]);
  private loadingSignal = signal<boolean>(false);
  private errorSignal = signal<string | null>(null);

  readonly cats = this.catsSignal.asReadonly();
  readonly loading = this.loadingSignal.asReadonly();
  readonly error = this.errorSignal.asReadonly();

  ngOnInit(): void {
    this.loadCats();
  }

  loadCats(): void {
    this.loadingSignal.set(true);
    this.errorSignal.set(null);

    this.catService.getAll().subscribe({
      next: (cats) => {
        this.catsSignal.set(cats);
        this.loadingSignal.set(false);
      },
      error: (error) => {
        this.errorSignal.set(error.error?.message || 'Failed to load cats');
        this.loadingSignal.set(false);
      }
    });
  }

  viewCat(cat: Cat): void {
    this.router.navigate(['/cats', cat.id]);
  }

  editCat(cat: Cat): void {
    this.router.navigate(['/cats', cat.id, 'edit']);
  }

  deleteCat(cat: Cat): void {
    if (confirm(`Are you sure you want to delete ${cat.name}?`)) {
      this.catService.delete(cat.id).subscribe({
        next: () => {
          this.catsSignal.update(cats => cats.filter(c => c.id !== cat.id));
        },
        error: (error) => {
          this.errorSignal.set(error.error?.message || 'Failed to delete cat');
        }
      });
    }
  }
}