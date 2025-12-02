import { Component, OnInit } from '@angular/core';
import { CommonModule, CurrencyPipe } from '@angular/common';
import { CartItem } from '../models/cart-item.model';
import { CartService } from '../cart.service';

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

  constructor(private readonly cartService: CartService) {}

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

  onBuy(): void {
    if (!this.cartItems.length) {
      return;
    }
    alert('Compra realizada com sucesso!');
    this.cartService.clearCart();
  }
}
