import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { HttpErrorResponse } from '@angular/common/http';

import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { CartService } from '../services/cart.service';
import { ProductTableComponent } from '../product-table/product-table.component';

@Component({
  selector: 'app-product-list',
  standalone: true,
  imports: [ProductTableComponent],
  templateUrl: './product-list.component.html',
  styleUrl: './product-list.component.css',
})
export class ProductListComponent implements OnInit {
  products: Product[] = [];
  loading: boolean = false;
  errorMessage = '';

  constructor(
    private readonly productService: ProductService,
    private readonly router: Router,
    private readonly cartService: CartService
  ) {}

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
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar produtos:', error);
        this.errorMessage = 'Erro ao carregar produtos.';
        this.loading = false;
      },
    });
  }

  onNew() {
    this.router.navigate(['/products/new']);
  }

  onEdit(product: Product) {
    if (!product.id) return;
    this.router.navigate(['/products/edit', product.id]);
  }

  onDelete(product: Product) {
    if (!product.id) return;

    const confirmar = confirm(
      `Tem certeza que deseja excluir o produto "${product.name}"?`
    );
    if (!confirmar) return;

    this.productService.deleteProduct(product.id).subscribe({
      next: () => {
        this.products = this.products.filter((p) => p.id !== product.id);
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao excluir produto:', error);
        alert('Erro ao excluir produto.');
      },
    });
  }

  onAddToCart(product: Product) {
    this.cartService.addToCart(product);
  }
}
