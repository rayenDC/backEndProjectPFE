import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-client',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './client.component.html',
  styleUrl: './client.component.css',
})
export class ClientComponent implements OnInit {
  constructor(private apiService: ApiService, private router: Router) {}
  clients: any[] = [];
  message: string = '';

  ngOnInit(): void {
    this.getClients();
  }

  getClients(): void {
    this.apiService.getAllClients().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.clients = res.clients;
        } else {
          this.showMessage(res.message);
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message ||
            error?.message ||
            'Unable to get clients' + error
        );
      },
    });
  }

  navigateToAddClientPage(): void {
    this.router.navigate(['/add-client']);
  }

  navigateToEditClientPage(clientId: string): void {
    this.router.navigate([`/edit-client/${clientId}`]);
  }

  handleDeleteClient(clientId: string): void {
    if (window.confirm('Are you sure you want to delete this client?')) {
      this.apiService.deleteClient(clientId).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('Client deleted successfully');
            this.getClients();
          }
        },
        error: (error) => {
          this.showMessage(
            error?.error?.message ||
              error?.message ||
              'Unable to delete client' + error
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
