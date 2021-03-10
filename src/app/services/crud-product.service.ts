import { Observable } from 'rxjs';
import { Produtos } from './../model/produtos-data.model';
import { HttpClient, HttpRequest, HttpEvent } from '@angular/common/http';
import { environment } from './../../environments/environment';
import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root'
})
export class CrudProductService {

  URL_PRODUCT = environment.serviceProduct

  URL_FILE = environment.serviceImage

  constructor(private httpClient: HttpClient) { }

  createProduct(product: Produtos): Observable<Produtos> {
    return this.httpClient.post<Produtos>(`${this.URL_PRODUCT}/create`, product)
    // return this.httpClient.post<Produtos>(`${this.SERVER_URL}produtos`, product)
  }

  readProducts(): Observable<Produtos[]> {
    return this.httpClient.get<Produtos[]>(`${this.URL_PRODUCT}/list-all`)
    //return this.httpClient.get<Produtos[]>(`${this.SERVER_URL}produtos`)
  }

  readProduct(id: string): Observable<Produtos> {
    const url = `${this.URL_PRODUCT}/list?id=${id}`;
    //const url = `${this.SERVER_URL}produtos/${id}`;
    return this.httpClient.get<Produtos>(url)
  }

  updateProduct(product: Produtos): Observable<Produtos> {
    //const url = `${this.SERVER_URL}update${product.id}`;
    //const url = `${this.SERVER_URL}produtos/${product.id}`;
    return this.httpClient.put<Produtos>(`${this.URL_PRODUCT}/update`, product)
  }

  deleteProduct(id: number): Observable<Produtos> {
    const url = `${this.URL_PRODUCT}/delete?id=${id}`;
    //const url = `${this.SERVER_URL}produtos/${id}`;
    return this.httpClient.delete<Produtos>(url)
  }

  upload(file: File): Observable<HttpEvent<any>> {
    const formData: FormData = new FormData();

    formData.append('file', file);

    const req = new HttpRequest('POST', `${this.URL_FILE}/upload`, formData, {
      reportProgress: true,
      responseType: 'json'
    });
    return this.httpClient.request(req);
  }

 /* getFiles(): Observable<any> {
    return this.httpClient.get(`${this.SERVER_URL}/files`);
  }*/

}
