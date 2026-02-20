import { Component, Input, Output, EventEmitter, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';

export interface CarouselItem {
  id: string;
  imageUrl: string;
  title?: string;
  description?: string;
}

@Component({
  selector: 'app-carousel',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './carousel.component.html',
  styleUrl: './carousel.component.scss'
})
export class CarouselComponent {
  @Input() items: CarouselItem[] = [];
  @Input() autoPlay = true;
  @Input() interval = 5000;
  @Input() showIndicators = true;
  @Input() showArrows = true;

  @Output() itemClick = new EventEmitter<CarouselItem>();
  @Output() slideChange = new EventEmitter<number>();

  private currentIndexSignal = signal<number>(0);
  private autoPlayIntervalId: ReturnType<typeof setInterval> | null = null;

  readonly currentIndex = this.currentIndexSignal.asReadonly();
  readonly hasNext = computed(() => this.currentIndexSignal() < this.items.length - 1);
  readonly hasPrevious = computed(() => this.currentIndexSignal() > 0);

  ngOnInit(): void {
    if (this.autoPlay && this.items.length > 1) {
      this.startAutoPlay();
    }
  }

  ngOnDestroy(): void {
    this.stopAutoPlay();
  }

  next(): void {
    if (this.hasNext()) {
      this.currentIndexSignal.update(v => v + 1);
    } else {
      this.currentIndexSignal.set(0);
    }
    this.emitSlideChange();
  }

  previous(): void {
    if (this.hasPrevious()) {
      this.currentIndexSignal.update(v => v - 1);
    } else {
      this.currentIndexSignal.set(this.items.length - 1);
    }
    this.emitSlideChange();
  }

  goTo(index: number): void {
    if (index >= 0 && index < this.items.length) {
      this.currentIndexSignal.set(index);
      this.emitSlideChange();
    }
  }

  onItemClick(item: CarouselItem): void {
    this.itemClick.emit(item);
  }

  private startAutoPlay(): void {
    this.autoPlayIntervalId = setInterval(() => {
      this.next();
    }, this.interval);
  }

  private stopAutoPlay(): void {
    if (this.autoPlayIntervalId) {
      clearInterval(this.autoPlayIntervalId);
      this.autoPlayIntervalId = null;
    }
  }

  private emitSlideChange(): void {
    this.slideChange.emit(this.currentIndexSignal());
  }
}