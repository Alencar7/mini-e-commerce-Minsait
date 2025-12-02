import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe } from '@angular/common';
import { Observable } from 'rxjs';
import { CartService } from '../cart.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [RouterLink, RouterLinkActive, AsyncPipe],
  templateUrl: './header.component.html',
  styleUrl: './header.component.css',
})
export class HeaderComponent {
  //obsevable para monitorar a quantidade de itens no carrinho
  cartCount$: Observable<number>;

  constructor(private readonly cartService: CartService) {
    this.cartCount$ = this.cartService.cartCount$; //resgatei a fucao do service
  }
}
