import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ApiService } from '../service/api.service';

@Component({
  selector: 'app-add-edit-client',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './add-edit-client.component.html',
  styleUrl: './add-edit-client.component.css',
})
export class AddEditClientComponent implements OnInit {
  message: string = '';
  isEditing: boolean = false;
  clientId: string | null = null;

  formData: any = {
    name: '',
    email: '',
    phoneNumber: '',
  };

  constructor(
    private apiService: ApiService,
    private router: Router,
    private route: ActivatedRoute
  ) {}

  ngOnInit(): void {
    this.clientId = this.route.snapshot.paramMap.get('clientId');
    if (this.clientId) {
      this.isEditing = true;
      this.fetchClient();
    }
  }

  fetchClient(): void {
    this.apiService.getClientById(this.clientId!).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.formData = res.client;
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
            error?.message ||
            'Unable to fetch client' + error
        );
      },
    });
  }

  handleSubmit(): void {
    if (!this.formData.name) {
      this.showMessage('Name is required');
      return;
    }

    if (this.isEditing) {
      this.apiService.updateClient(this.clientId!, this.formData).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('Client updated successfully');
            this.router.navigate(['/clients']);
          }
        },
        error: (error) => {
          this.showMessage(
            error?.error?.message ||
              error?.message ||
              'Failed to update client' + error
          );
        },
      });
    } else {
      this.apiService.addClient(this.formData).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('Client added successfully');
            this.router.navigate(['/clients']);
          }
        },
        error: (error) => {
          this.showMessage(
            error?.error?.message ||
              error?.message ||
              'Failed to add client' + error
          );
        },
      });
    }
  }

  showMessage(msg: string): void {
    this.message = msg;
    setTimeout(() => (this.message = ''), 4000);
  }
}
