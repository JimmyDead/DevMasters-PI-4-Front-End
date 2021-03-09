import { Observable } from 'rxjs';
import { Produtos } from './../model/produtos-data.model';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrudProductService {

  SERVER_URL = environment.serverURL

  constructor(private httpClient: HttpClient) { }

  createProduct(product: Produtos): Observable<Produtos> {
    let url = `http://localhost:8080/file/upload/product?title=${product.title}&price=${product.price}&description=${product.description}&category=${product.category}&quantity=${product.quantity}`
    console.log(url)
    return this.httpClient.put<Produtos>(url, product)
    //return this.httpClient.post<Produtos>(`${this.SERVER_URL}produtos`, product)
  }

  readProducts(): Observable<Produtos[]> {
    return this.httpClient.get<Produtos[]>(`${this.SERVER_URL}produtos`)
  }

  readProduct(id: string): Observable<Produtos> {
    const url = `${this.SERVER_URL}produtos/${id}`;
    return this.httpClient.get<Produtos>(url)
  }

  updateProduct(product: Produtos): Observable<Produtos> {
    const url = `${this.SERVER_URL}produtos/${product.id}`;
    return this.httpClient.put<Produtos>(url, product)
  }

  deleteProduct(id: number): Observable<Produtos> {
    const url = `${this.SERVER_URL}produtos/${id}`;
    return this.httpClient.delete<Produtos>(url)
  }



  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', 'http://localhost:8080/file/upload', formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.httpClient.request(req);
  }

  getFiles(): Observable<any> {
    return this.httpClient.get(`${this.SERVER_URL}/files`);
  }

}
