import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { Product } from '../models/product.model';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductService {
  //endpoint da API
  private apiUrl = `${environment.apiUrl}`;

  constructor(private http: HttpClient) {}

  //get all products
  getAllProducts(): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/`); // GET /v1/products/
  }
  //get product by id
  getProductById(id: number): Observable<Product> {
    return this.http.get<Product>(`${this.apiUrl}/${id}`); // GET /v1/products/{id}
  }
  //create product
  createProduct(product: Product): Observable<Product> {
    return this.http.post<Product>(`${this.apiUrl}/product`, product); // POST /v1/products/product
  }
  //update product
  updateProduct(product: Product): Observable<Product> {
    // return this.http.put<Product>(`${this.apiUrl}/update/${id}`, product); // PUT /v1/products/update
    return this.http.put<Product>(`${this.apiUrl}/update`, product); // PUT /v1/products/{id}
  }
  //delete product
  deleteProduct(id: number): Observable<void> {
    return this.http.delete<void>(`${this.apiUrl}/${id}`); // DELETE /v1/products/{id}
  }
}
