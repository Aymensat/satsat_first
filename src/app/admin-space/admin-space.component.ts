import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ReactiveFormsModule, FormsModule, FormBuilder, FormGroup } from '@angular/forms';
import { AdminService, AnnouncementDTOForAdmins } from '../services/admin.service';

@Component({
  selector: 'app-admin-space',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule, FormsModule],
  templateUrl: './admin-space.component.html',
  styleUrls: ['./admin-space.component.css']
})
export class AdminSpaceComponent implements OnInit {
  announcements: AnnouncementDTOForAdmins[] = [];
  filteredAnnouncements: AnnouncementDTOForAdmins[] = [];
  isLoading = false;
  showApprovalForm = false;
  currentAnnouncement: AnnouncementDTOForAdmins | null = null;
  approvalForm: FormGroup;
  
  // Filter options
  filters = {
    type: 'all',
    state: 'all',
    field: 'all',
    classYear: 'all'
  };
  
  constructor(
    private adminService: AdminService,
    private fb: FormBuilder
  ) {
    this.approvalForm = this.fb.group({
      state: ['approved'],
      administratorComment: ['']
    });
  }
  
  ngOnInit(): void {
    this.loadAnnouncements();
  }
  
  loadAnnouncements(): void {
    this.isLoading = true;
    this.adminService.getAllAnnouncements().subscribe({
      next: (data) => {
        this.announcements = data;
        this.applyFilters();
        this.isLoading = false;
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  
  applyFilters(): void {
    this.filteredAnnouncements = this.announcements.filter(ann => {
      let matches = true;
      
      if (this.filters.type !== 'all' && ann.type !== this.filters.type) {
        matches = false;
      }
      
      if (this.filters.state !== 'all' && ann.state !== this.filters.state) {
        matches = false;
      }
      
      if (this.filters.field !== 'all' && ann.field !== this.filters.field) {
        matches = false;
      }
      
      if (this.filters.classYear !== 'all' && ann.classYear !== this.filters.classYear) {
        matches = false;
      }
      
      return matches;
    });
  }
  
  openApprovalForm(announcement: AnnouncementDTOForAdmins): void {
    this.currentAnnouncement = announcement;
    this.showApprovalForm = true;
    
    // Set default state based on current state
    this.approvalForm.patchValue({
      state: announcement.state === 'pending' ? 'approved' : announcement.state,
      administratorComment: announcement.administratorComment || ''
    });
  }
  
  closeApprovalForm(): void {
    this.showApprovalForm = false;
    this.currentAnnouncement = null;
  }
  
  submitApproval(): void {
    if (!this.currentAnnouncement) return;
    
    const formValue = this.approvalForm.value;
    this.isLoading = true;
    
    this.adminService.updateAnnouncementStatus(
      this.currentAnnouncement.id, 
      formValue.state,
      formValue.administratorComment
    ).subscribe({
      next: () => {
        // Update the local announcement
        if (this.currentAnnouncement) {
          this.currentAnnouncement.state = formValue.state;
          this.currentAnnouncement.administratorComment = formValue.administratorComment;
        }
        
        this.isLoading = false;
        this.closeApprovalForm();
        this.loadAnnouncements(); // Refresh list
      },
      error: () => {
        this.isLoading = false;
      }
    });
  }
  
  getStateClass(state: string): string {
    switch (state) {
      case 'approved':
        return 'approved';
      case 'rejected':
        return 'rejected';
      default:
        return 'pending';
    }
  }
  
  getTypeClass(type: string): string {
    return type === 'absence' ? 'absence' : 'catchup';
  }
  
  formatDate(date: string): string {
    return new Date(date).toLocaleDateString();
  }
}