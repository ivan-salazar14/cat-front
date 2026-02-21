import { Injectable, inject } from '@angular/core';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Breed, BreedImage } from '../models';

@Injectable({
  providedIn: 'root'
})
export class CatService {
  private http = inject(HttpClient);
  private readonly API_URL = '/api';

  getBreeds() { return this.http.get<Breed[]>(`${this.API_URL}/breeds`); }
  
  getImages(breedId: string) {
    return this.http.get<BreedImage[]>(`${this.API_URL}/imagesbybreedid?breed_id=${breedId}`);
  }

  search(query: string) {
    return this.http.get<Breed[]>(`${this.API_URL}/breeds/search?q=${query}`);
  }
}