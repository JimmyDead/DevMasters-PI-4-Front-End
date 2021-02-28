import { environment } from './../../environments/environment';
import { Produtos } from './../model/produtos-data.model';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { HttpClient } from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class ProductService {

  constructor(private http: HttpClient) { }

  private SERVER_URL = environment.serverURL

  getAllProducts(): Observable<Produtos[]> {
    return this.http.get<Produtos[]>(this.SERVER_URL);
  }

  getProduct(id: number): Observable<Produtos> {
    const url = `${this.SERVER_URL}/${id}`;
    return this.http.get<Produtos>(url)
  }
}
