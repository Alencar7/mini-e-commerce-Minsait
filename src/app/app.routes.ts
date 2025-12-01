import { Routes } from '@angular/router';
import { HomeComponent } from './home/home.component';
import { ProductListComponent } from './product-list/product-list.component';
import { ProductFormComponent } from './product-form/product-form.component';
import { CartComponent } from './cart/cart.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'products', component: ProductListComponent },
  { path: 'products/new', component: ProductFormComponent }, // rota para criar um novo produto
  { path: 'products/edit/:id', component: ProductFormComponent }, // rota para editar um produto existente
  { path: 'cart', component: CartComponent },
  { path: '**', redirectTo: '' }, //rota padrão para redirecionar para a página inicial
];
