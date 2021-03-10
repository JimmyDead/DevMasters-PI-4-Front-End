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

  private URL_PRODUCT = environment.serviceProduct

  getAllProducts(): Observable<Produtos[]> {
    return this.http.get<Produtos[]>(`${this.URL_PRODUCT}/list-all`);
  }

  getProduct(id: number): Observable<Produtos> {
    const url = `${this.URL_PRODUCT}?id=${id}`;
    return this.http.get<Produtos>(url)
  }
}
