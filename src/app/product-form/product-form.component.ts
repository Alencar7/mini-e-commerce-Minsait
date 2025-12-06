import { Component, OnInit } from '@angular/core';
import {
  FormBuilder,
  FormGroup,
  Validators,
  ReactiveFormsModule,
} from '@angular/forms';
import { Router, ActivatedRoute } from '@angular/router';
import { ProductService } from '../services/product.service';
import { Product } from '../models/product.model';
import { HttpErrorResponse } from '@angular/common/http';

@Component({
  selector: 'app-product-form',
  standalone: true,
  imports: [ReactiveFormsModule],
  templateUrl: './product-form.component.html',
  styleUrl: './product-form.component.css',
})
export class ProductFormComponent implements OnInit {
  form: FormGroup;
  isEditMode: boolean = false;
  productId?: number;

  constructor(
    private readonly fb: FormBuilder,
    private readonly productService: ProductService,
    private readonly router: Router,
    private readonly route: ActivatedRoute
  ) {
    this.form = this.fb.group({
      name: ['', Validators.required],
      price: [0, [Validators.required, Validators.min(0)]],
      barcode: ['', Validators.required],
    });
  }

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (id) {
      this.isEditMode = true;
      this.productId = Number(id);
      this.loadProduct();
    }
  }

  loadProduct() {
    if (!this.productId) return;

    this.productService.getProductById(this.productId).subscribe({
      next: (product) => {
        console.log('Produto carregado:', product);

        this.form.patchValue({
          name: product.name,
          price: product.price,
          barcode: product.barcode,
        });
      },
      error: (error: HttpErrorResponse) => {
        console.error('Erro ao carregar produto:', error);
        alert('Erro ao carregar produto.');
        this.router.navigate(['/products']);
      },
    });
  }

  onSubmit() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const productBase: Product = {
      id: this.productId,
      name: this.form.value.name,
      price: this.form.value.price,
      barcode: this.form.value.barcode,
    };

    if (this.isEditMode && this.productId != null) {
      const productToUpdate: Product = {
        ...productBase,
        id: this.productId,
      };

      this.productService.updateProduct(productToUpdate).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao atualizar produto:', error);
          alert('Erro ao atualizar produto.');
        },
      });
    } else {
      const productToCreate: Product = {
        name: productBase.name,
        price: productBase.price,
        barcode: productBase.barcode,
      };

      this.productService.createProduct(productToCreate).subscribe({
        next: () => {
          this.router.navigate(['/products']);
        },
        error: (error: HttpErrorResponse) => {
          console.error('Erro ao criar produto:', error);
          alert('Erro ao criar produto.');
        },
      });
    }
  }

  onCancel() {
    console.log('Operação cancelada pelo usuário.');
    this.router.navigate(['/products']);
  }

  get name() {
    return this.form.get('name');
  }
  get price() {
    return this.form.get('price');
  }
  get barcode() {
    return this.form.get('barcode');
  }
}
