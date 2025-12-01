import { Component, OnInit } from '@angular/core';
import { CurrencyPipe } from '@angular/common';
import { ProductService } from '../product.service';
import { Product } from '../models/product.model';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = false; //ajustar
  errorMessage = '';

  constructor(private productService: ProductService) {}

  ngOnInit(): void {
    this.loadProducts();
  }

  loadProducts() {
    this.loading = true;
    this.errorMessage = '';

    this.productService.getAllProducts().subscribe({
      next: (data) => {
        this.products = data;
        this.loading = false;
        console.log('Produtos carregados:', data);
      },
      error: (error) => {
        console.error('Erro ao carregar produtos:', error);
        this.errorMessage = 'Erro ao carregar produtos.';
        this.loading = false;
      },
    });
  }
}
