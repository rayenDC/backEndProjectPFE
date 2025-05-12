import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-sell',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './sell.component.html',
  styleUrl: './sell.component.css',
})
export class SellComponent implements OnInit {
  constructor(private apiService: ApiService) {}

  products: any[] = [];
  productId: string = '';
  description: string = '';
  quantity: string = '';
  message: string = '';
  clients: any[] = [];
  clientId: string = '';

  ngOnInit(): void {
    this.fetchProducts();
    this.fetchClients();
  }

  fetchProducts(): void {
    this.apiService.getAllProducts().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.products = res.products;
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message || error?.message || 'Unable to get Products'
        );
      },
    });
  }

  // Handle form submission for selling a product
  handleSubmit(): void {
    if (!this.productId || !this.clientId || !this.quantity) {
      this.showMessage('Please fill all fields');
      return;
    }

    const body = {
      productId: this.productId,
      clientId: this.clientId, // ✅ You add this line here
      quantity: parseInt(this.quantity, 10),
      description: this.description,
    };

    this.apiService.sellProduct(body).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.showMessage(res.message);
          this.resetForm();
        }
      },
      error: (error) => {
        let errorMessage =
          error?.error?.message || error?.message || 'Unable to sell product';

        if (errorMessage.includes('Could not commit JPA transaction')) {
          errorMessage = 'Quantity insufficient';
        }

        this.showMessage(errorMessage);
      },
    });
  }

  fetchClients(): void {
    this.apiService.getAllClients().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.clients = res.clients;
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message || error?.message || 'Unable to get clients'
        );
      },
    });
  }

  resetForm(): void {
    this.productId = '';
    this.description = '';
    this.clientId = '';
    this.quantity = '';
  }

  // Show message function
  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
