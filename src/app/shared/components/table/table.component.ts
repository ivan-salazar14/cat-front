import { Component, input, Output, EventEmitter, TemplateRef, ContentChild, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface TableColumn<T> {
  key: keyof T | string;
  header: string;
  sortable?: boolean;
  template?: TemplateRef<unknown>;
}

export interface TableSortEvent {
  key: string;
  direction: 'asc' | 'desc';
}

@Component({
  selector: 'app-table',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss'
})
export class TableComponent<T> {
  data = input<T[]>([]);
  columns = input<TableColumn<T>[]>([]);
  pageSize = input(10);
  showPagination = input(true);
  showSorting = input(true);
  emptyMessage = input('No data available');

  @Output() rowClick = new EventEmitter<T>();
  @Output() sortChange = new EventEmitter<TableSortEvent>();
  @Output() pageChange = new EventEmitter<number>();

  @ContentChild('rowTemplate') rowTemplate!: TemplateRef<unknown>;

  private currentPageSignal = signal<number>(1);
  private sortKeySignal = signal<string>('');
  private sortDirectionSignal = signal<'asc' | 'desc'>('asc');

  readonly currentPage = this.currentPageSignal.asReadonly();
  readonly sortKey = this.sortKeySignal.asReadonly();
  readonly sortDirection = this.sortDirectionSignal.asReadonly();

  readonly totalPages = computed(() => Math.ceil((this.data() || []).length / this.pageSize()));
  readonly paginatedData = computed(() => {
    const data = this.data() || [];
    const start = (this.currentPageSignal() - 1) * this.pageSize();
    const end = start + this.pageSize();
    return data.slice(start, end);
  });

  onRowClick(row: T): void {
    this.rowClick.emit(row);
  }

  onSort(key: string): void {
    if (!this.showSorting()) return;

    if (this.sortKeySignal() === key) {
      this.sortDirectionSignal.update(dir => dir === 'asc' ? 'desc' : 'asc');
    } else {
      this.sortKeySignal.set(key);
      this.sortDirectionSignal.set('asc');
    }

    this.sortChange.emit({
      key: this.sortKeySignal(),
      direction: this.sortDirectionSignal()
    });
  }

  onPageChange(page: number): void {
    if (page >= 1 && page <= this.totalPages()) {
      this.currentPageSignal.set(page);
      this.pageChange.emit(page);
    }
  }

  getSortIcon(key: string): string {
    if (this.sortKeySignal() !== key) return '↕';
    return this.sortDirectionSignal() === 'asc' ? '↑' : '↓';
  }

  getNestedValue(obj: T, path: string): unknown {
    return path.split('.').reduce((acc: unknown, part: string) => {
      if (acc && typeof acc === 'object' && part in acc) {
        return (acc as Record<string, unknown>)[part];
      }
      return undefined;
    }, obj);
  }

  get pages(): number[] {
    const total = this.totalPages();
    const current = this.currentPageSignal();
    const pages: number[] = [];
    const start = Math.max(1, current - 2);
    const end = Math.min(total, current + 2);
    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }
}