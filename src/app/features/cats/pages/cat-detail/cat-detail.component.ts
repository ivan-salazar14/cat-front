import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CarouselComponent, TableComponent } from '../../../../shared';
import { ReactiveFormsModule } from '@angular/forms';
import { BehaviorSubject } from 'rxjs';
import { Breed, BreedImage } from '../../../../core/models';
import { CatService } from '../../../../core/services/cat.service';
import { CarouselItem } from '../../../../shared/components/carousel/carousel.component';



@Component({
  selector: 'app-cat-detail',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule,  CarouselComponent, TableComponent],
  templateUrl: './cat-detail.component.html',
  styleUrl: './cat-detail.component.scss'
})
export class CatDetailComponent implements OnInit {
 private catService = inject(CatService);
  breeds$ = this.catService.getBreeds();
  selectedImages$ = new BehaviorSubject<any[]>([]);
  dataSource$ = new BehaviorSubject<Breed[]>([]);

  ngOnInit() {
    this.breeds$.subscribe(data => this.dataSource$.next(data));
  }

  onBreedSelect(event: any) {
    const id = event.target.value;
    if (id) {
      this.catService.getImages(id).subscribe(imgs => {
        const carouselItems: CarouselItem[] = imgs.map((img: BreedImage) => ({
          id: img.id,
          imageUrl: img.url
        }));
        this.selectedImages$.next(carouselItems);
      });
    }
  }

  search(query: string) {
    this.catService.search(query).subscribe(data => this.dataSource$.next(data));
  }
}