import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-add-edit-supplier',
  standalone: true,
  imports: [FormsModule, CommonModule,RouterLink],
  templateUrl: './add-edit-supplier.component.html',
  styleUrl: './add-edit-supplier.component.css',
})
export class AddEditSupplierComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}
  message: string = '';
  isEditing: boolean = false;
  supplierId: string | null = null;

  formData: any = {
    name: '',
    address: '',
  };

  ngOnInit(): void {
    this.supplierId = this.router.url.split('/')[2]; //extracting supplier id from url
    if (this.supplierId) {
      this.isEditing = true;
      this.fetchSupplier();
    }
  }

  fetchSupplier(): void {
    this.apiService.getSupplierById(this.supplierId!).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.formData = {
            name: res.supplier.name,
            address: res.supplier.address,
          };
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
            error?.message ||
            'Unable to get supplier by id' + error
        );
      },
    });
  }

  // HANDLE FORM SUBMISSION
  handleSubmit() {
    if (!this.formData.name || !this.formData.address) {
      this.showMessage('All fields are nessary');
      return;
    }

    //prepare data for submission
    const supplierData = {
      name: this.formData.name,
      address: this.formData.address,
    };

    if (this.isEditing) {
      this.apiService.updateSupplier(this.supplierId!, supplierData).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('Supplier updated successfully');
            this.router.navigate(['/supplier']);
          }
        },
        error: (error) => {
          this.showMessage(
            error?.error?.message ||
              error?.message ||
              'Unable to edit supplier' + error
          );
        },
      });
    } else {
      // Check if supplier already exists before adding
      this.apiService.getAllSuppliers().subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            const existingSupplier = res.suppliers.find(
              (supplier: any) =>
                supplier.name.toLowerCase() === supplierData.name.toLowerCase()
            );

            if (existingSupplier) {
              this.showMessage(
                `Error: Supplier "${supplierData.name}" already exists.`
              );
              return;
            }

            // If no existing supplier found, proceed to add
            this.apiService.addSupplier(supplierData).subscribe({
              next: (res: any) => {
                if (res.status === 200) {
                  this.showMessage('Supplier added successfully');
                  this.router.navigate(['/supplier']);
                }
              },
              error: (error) => {
                this.showMessage(
                  error?.error?.message ||
                    error?.message ||
                    'Unable to add supplier' + error
                );
              },
            });
          }
        },
        error: (error) => {
          this.showMessage(
            error?.error?.message ||
              error?.message ||
              'Failed to verify existing suppliers' + error
          );
        },
      });
    }
  }

  showMessage(message: string) {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
