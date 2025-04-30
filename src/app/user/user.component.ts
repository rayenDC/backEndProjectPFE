import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../service/api.service';
import { Router } from '@angular/router';

@Component({
  selector: 'app-user',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './user.component.html',
  styleUrl: './user.component.css',
})
export class UserComponent implements OnInit {
  users: any[] = [];
  message: string = '';
  userName: string = '';
  userEmail: string = '';
  userPhoneNumber: string = '';
  userPassword: string = '';
  userRole: string = 'USER'; // default role
  isEditing: boolean = false;
  editingUserId: string | null = null;
  showEditPopup: boolean = false;

  constructor(private apiService: ApiService, private router: Router) {}

  ngOnInit(): void {
    this.fetchUsers();
  }

  fetchUsers(): void {
    this.apiService.getAllUsers().subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.users = res.users || [];
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message || error?.message || 'Unable to fetch users.'
        );
      },
    });
  }

  addUser(): void {
    if (
      !this.userName ||
      !this.userEmail ||
      !this.userPhoneNumber ||
      !this.userPassword
    ) {
      this.showMessage('All fields are required');
      return;
    }
    const newUser = {
      name: this.userName,
      email: this.userEmail,
      phoneNumber: this.userPhoneNumber,
      password: this.userPassword,
      role: this.userRole,
    };
    this.apiService.createUser(newUser).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.showMessage('User added successfully');
          this.resetForm();
          this.fetchUsers();
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message || error?.message || 'Unable to add user.'
        );
      },
    });
  }

  editUser(): void {
    if (
      !this.editingUserId ||
      !this.userName ||
      !this.userEmail ||
      !this.userPhoneNumber
    ) {
      this.showMessage('All fields are required');
      return;
    }
    const updatedUser = {
      name: this.userName,
      email: this.userEmail,
      phoneNumber: this.userPhoneNumber,
      password: this.userPassword ? this.userPassword : undefined,
      role: this.userRole,
    };
    this.apiService.updateUser(this.editingUserId, updatedUser).subscribe({
      next: (res: any) => {
        if (res.status === 200) {
          this.showMessage('User updated successfully');
          this.resetForm();
          this.fetchUsers();
          this.showEditPopup = false;
        }
      },
      error: (error) => {
        this.showMessage(
          error?.error?.message || error?.message || 'Unable to update user.'
        );
      },
    });
  }

  handleEditUser(user: any): void {
    this.isEditing = true;
    this.editingUserId = user.id;
    this.userName = user.name;
    this.userEmail = user.email;
    this.userPhoneNumber = user.phoneNumber;
    this.userRole = user.role;
    this.userPassword = '';
    this.showEditPopup = true;
  }

  handleDeleteUser(userId: string): void {
    if (window.confirm('Are you sure you want to delete this user?')) {
      this.apiService.deleteUser(userId).subscribe({
        next: (res: any) => {
          if (res.status === 200) {
            this.showMessage('User deleted successfully');
            this.fetchUsers();
          }
        },
        error: (error) => {
          this.showMessage(
            error?.error?.message || error?.message || 'Unable to delete user.'
          );
        },
      });
    }
  }

  closePopup(): void {
    this.showEditPopup = false;
    this.resetForm();
  }

  resetForm(): void {
    this.isEditing = false;
    this.editingUserId = null;
    this.userName = '';
    this.userEmail = '';
    this.userPhoneNumber = '';
    this.userPassword = '';
    this.userRole = 'USER';
  }

  showMessage(message: string): void {
    this.message = message;
    setTimeout(() => {
      this.message = '';
    }, 4000);
  }
}
