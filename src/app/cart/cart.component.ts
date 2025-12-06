import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartItem } from '../models/cart-item.model';
import { CartService } from '../services/cart.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-cart',
  standalone: true,
  imports: [CurrencyPipe],
  templateUrl: './cart.component.html',
  styleUrl: './cart.component.css',
})
export class CartComponent implements OnInit {
  cartItems: CartItem[] = [];
  total: number = 0;
  isProcessing: boolean = false;
  purchaseSuccess = false;

  constructor(
    private readonly cartService: CartService,
    private router: Router
  ) {}

  ngOnInit() {
    this.cartService.cartItems$.subscribe((items: CartItem[]) => {
      this.cartItems = items;
      this.total = this.cartService.getTotal();
    });
  }

  removeItem(productId: number) {
    this.cartService.removeFromCart(productId);
  }

  clear() {
    this.cartService.clearCart();
  }

  updateQuantity(productId: number, quantity: number) {
    this.cartService.updateQuantity(productId, quantity);
  }

  onBuy() {
    if (!this.cartItems.length || this.isProcessing) {
      return;
    }

    this.isProcessing = true;

    setTimeout(() => {
      this.isProcessing = false;
      this.cartService.clearCart();
      this.purchaseSuccess = true;

      setTimeout(() => {
        this.router.navigate(['']);
      }, 2000);
    }, 1500);
  }
}
