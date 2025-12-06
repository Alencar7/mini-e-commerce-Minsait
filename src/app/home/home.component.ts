import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';

import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';

type ProductCard = Product & { imageUrl: string };

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css'],
})
export class HomeComponent implements OnInit {
  productCards: ProductCard[] = [];

  private productImages: string[] = [
    'sgalaxy.webp',
    'notedell.webp',
    'lgwide.webp',
    'mouse.webp',
  ];

  constructor(private productService: ProductService, private router: Router) {}

  ngOnInit(): void {
    this.productService.getAllProducts().subscribe((products) => {
      this.productCards = products.slice(0, 4).map((p, index) => ({
        ...p,
        imageUrl: this.productImages[index] ?? 'assets/produto-default.webp',
      }));
    });
  }

  goToProducts() {
    this.router.navigate(['/products']);
  }

  onNewProduct() {
    this.router.navigate(['/products/new']);
  }
}
