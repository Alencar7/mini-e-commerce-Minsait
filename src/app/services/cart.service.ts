import { Injectable } from '@angular/core';

import { CartItem } from '../models/cart-item.model';
import { Product } from '../models/product.model';

import { BehaviorSubject, Observable } from 'rxjs';
import { map } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class CartService {
  private readonly storageKey: string = 'cart';

  private readonly cartItemsSubject: BehaviorSubject<CartItem[]> =
    new BehaviorSubject<CartItem[]>(this.loadFromStorage());

  //lista de itens do carrinho como Observable
  readonly cartItems$: Observable<CartItem[]> =
    this.cartItemsSubject.asObservable();

  // quantidade total de itens no carrinho como Observable => legal para exibir no icone do carrinho
  readonly cartCount$: Observable<number> = this.cartItems$.pipe(
    map((items: CartItem[]) =>
      items.reduce((sum, item) => sum + item.quantity, 0)
    )
  );

  //extra
  //valor total do carrinho como Observable => legal para exibir o total dinamicamente
  readonly cartTotal$: Observable<number> = this.cartItems$.pipe(
    map((items: CartItem[]) =>
      items.reduce((sum, item) => sum + item.product.price * item.quantity, 0)
    )
  );

  constructor() {}

  //adiciona um produto ao carrinho + validacao + evita duplicatas
  addToCart(product: Product): void {
    // condicoes importantes
    if (!product.id) {
      console.error(
        'Produto inválido, sem ID, não pode ser adicionado ao carrinho.'
      );
      return;
    }
    if (product.price <= 0) {
      console.error(
        'Produto com preço inválido não pode ser adicionado ao carrinho.'
      );
      return;
    }

    const currentItems = [...this.cartItemsSubject.value];
    const existingItem = currentItems.find(
      (item) => item.product.id === product.id
    );

    if (existingItem) {
      existingItem.quantity++;
    } else {
      currentItems.push({ product, quantity: 1 });
    }

    //atualiza o estado do carrinho
    this.updateState(currentItems);
  }

  //remove um produto do carrinho pelo Id
  removeFromCart(productId: number): void {
    const currentItems = this.cartItemsSubject.value.filter(
      (item) => item.product.id !== productId
    );

    this.updateState(currentItems);
  }

  //extra
  // atualiza a quantidade de um produto no carrinho
  updateQuantity(productId: number, quantity: number): void {
    if (quantity <= 0) {
      this.removeFromCart(productId);
      return;
    }

    const currentItems = [...this.cartItemsSubject.value];
    const item = currentItems.find((i) => i.product.id === productId);

    if (item) {
      item.quantity = quantity;
      console.log(
        `Quantidade do produto com ID ${productId} atualizada para ${quantity}.`
      );
      this.updateState(currentItems);
    } else {
      console.warn(`Produto com ID ${productId} não encontrado no carrinho.`);
    }
  }
  // limpa o carrinho
  clearCart() {
    console.log('Carrinho limpo.');
    this.updateState([]);
  }

  // retornar o valor total do carrinho -> usar cartoTotal$ como Observable
  getTotal(): number {
    return this.cartItemsSubject.value.reduce(
      (sum, item) => sum + item.product.price * item.quantity,
      0
    );
  }

  //extra
  //verifica se o produto está no carrinho
  isInCart(productId: number): boolean {
    return this.cartItemsSubject.value.some(
      (item) => item.product.id === productId
    );
  }

  //extra
  //retorna a quantidade de um produto no carrinho
  getProductQuantity(productId: number): number {
    const item = this.cartItemsSubject.value.find(
      (i) => i.product.id === productId
    );
    return item ? item.quantity : 0;
  }

  //atualiza o estado do carrinho e salva => localStorage
  private updateState(items: CartItem[]): void {
    this.cartItemsSubject.next(items);
    this.saveToStorage(items);
  }

  //salva o estado do carrinho no localStorage
  private saveToStorage(items: CartItem[]): void {
    try {
      localStorage.setItem(this.storageKey, JSON.stringify(items));
    } catch (error) {
      console.error('Erro ao salvar o carrinho no localStorage:', error);
    }
  }

  //carrega o estado do carrinho do localStorage
  //extra: com validações para evitar dados corrompidos
  private loadFromStorage(): CartItem[] {
    try {
      const data = localStorage.getItem(this.storageKey);

      // Se não há dados, retorna array vazio
      if (!data) {
        console.log('Nenhum carrinho salvo encontrado');
        return [];
      }

      // Tenta fazer parse do JSON
      const items = JSON.parse(data) as CartItem[];

      // VALIDAÇÃO: Filtra apenas itens válidos
      const validItems = items.filter((item) => {
        const isValid =
          item.product.id != null &&
          item.product.price > 0 &&
          item.quantity > 0 &&
          item.product.name &&
          item.product.barcode;

        if (!isValid) {
          console.warn('Item inválido removido do carrinho:', item);
        }

        return isValid;
      });

      console.log(`${validItems.length} item(s) carregado(s) do localStorage`);
      return validItems;
    } catch (error) {
      console.error('Erro ao carregar carrinho do localStorage:', error);

      // Remove dados corrompidos
      localStorage.removeItem(this.storageKey);
      console.log('Dados corrompidos removidos do localStorage');

      return [];
    }
  }
}
