import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TeacherSpaceService } from '../services/teacher-space.service';
import { TimetableDTO, AnnouncementDTOForStudents, AnnouncementDTOForTeachers } from '../services/student-space.service';

interface TimeSlot {
  start: string;
  end: string;
}

@Component({
  selector: 'app-teacher-space',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './teacher-space.component.html',
  styleUrls: ['./teacher-space.component.css']
})
export class TeacherSpaceComponent implements OnInit {
  // View control
  currentView: 'class' | 'teacher' = 'class';
  
  // Class timetable filters
  field = 'computer_science';
  classYear = 'first';
  classLetter = 'a';

  // Data
  timetable: TimetableDTO[] = [];
  teacherTimetable: TimetableDTO[] = [];
  announcements: AnnouncementDTOForStudents[] = [];
  
  // UI states
  isLoading = false;

  // Modal control
  showAnnouncementForm = false;
  selectedDay = '';
  selectedTimeStart = '';
  selectedTimeEnd = '';
  
  // Form model
  announcementForm: AnnouncementDTOForTeachers = {
    classLetter: 'a',
    classYear: 'first',
    field: 'computer_science',
    targetedDate: '',
    type: 'absence',
    studentComment: '',
    administratorComment: ''
  };

  daysOfWeek: Array<'monday'|'tuesday'|'wednesday'|'thursday'|'friday'|'saturday'> = [
    'monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday'
  ];

  timeSlots: TimeSlot[] = [
    { start: '08:30', end: '10:00' },
    { start: '10:10', end: '11:40' },
    { start: '11:40', end: '12:30' },
    { start: '12:30', end: '14:00' },
    { start: '14:10', end: '15:40' },
    { start: '15:40', end: '17:20' },
  ];

  announcementsMap: { [day: string]: { [start: string]: AnnouncementDTOForStudents[] } } = {};

  constructor(private teacherService: TeacherSpaceService) {}

  ngOnInit() {
    // Load teacher's own timetable
    this.loadTeacherTimetable();
  }

  setView(view: 'class' | 'teacher') {
    this.currentView = view;
    
    if (view === 'class' && this.timetable.length > 0) {
      // Refresh announcements for current class
      this.loadAnnouncements();
    } else if (view === 'teacher' && this.teacherTimetable.length === 0) {
      // Load teacher's timetable if not already loaded
      this.loadTeacherTimetable();
    }
  }

  onClickHandler() {
    this.isLoading = true;
    
    // Load class timetable
    this.teacherService
      .getTimeTable(this.field, this.classYear, this.classLetter)
      .subscribe({
        next: (data) => {
          this.timetable = data;
          // Update form with current selection
          this.announcementForm.field = this.field;
          this.announcementForm.classYear = this.classYear;
          this.announcementForm.classLetter = this.classLetter;
          // Load announcements
          this.loadAnnouncements();
        },
        error: (err) => {
          console.error('Error loading timetable:', err);
          alert('Failed to load timetable. Please try again.');
          this.isLoading = false;
        }
      });
  }

  loadAnnouncements() {
    this.teacherService
      .getAnnouncements(this.field, this.classYear, this.classLetter)
      .subscribe({
        next: (data) => {
          this.announcements = data;
          this.buildAnnouncementsMap();
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading announcements:', err);
          this.isLoading = false;
        }
      });
  }

  loadTeacherTimetable() {
    this.isLoading = true;
    
    this.teacherService
      .getTeacherTimetable()
      .subscribe({
        next: (data) => {
          this.teacherTimetable = data;
          console.log('Teacher timetable loaded:', data);
          this.isLoading = false;
        },
        error: (err) => {
          console.error('Error loading teacher timetable:', err);
          alert('Failed to load your teaching schedule. Please try again.');
          this.isLoading = false;
        }
      });
  }

  /**
   * Find the one timetable entry matching a day + startingTime
   */
  getEntry(day: string, start: string): TimetableDTO | undefined {
    return this.timetable.find(
      (t) => t.dayOfWeek === day && t.startingTime.startsWith(start)
    );
  }

  /**
   * Find teacher's timetable entry matching a day + startingTime
   */
  getTeacherEntry(day: string, start: string): TimetableDTO | undefined {
    return this.teacherTimetable.find(
      (t) => t.dayOfWeek === day && t.startingTime.startsWith(start)
    );
  }

  private buildAnnouncementsMap() {
    this.announcementsMap = {};
    for (let ann of this.announcements) {
      // assume targetedDate is an ISO string e.g. "2025-05-02T10:10:00"
      const dt = new Date(ann.targetedDate);
      const day: string = ann.weekday; // e.g. "monday"
      const hhmm: string = dt.toTimeString().slice(0, 5); // "10:10"
      
      this.announcementsMap[day] ??= {};
      this.announcementsMap[day][hhmm] ??= [];
      this.announcementsMap[day][hhmm].push(ann);
    }
  }

  /** returns all announcements for this cell (or empty array) */
  getAnnouncementsFor(day: string, time: string) {
    return this.announcementsMap[day]?.[time] || [];
  }

  getCellState(day: string, start: string): 'normal'|'absence'|'catchup'|'both' {
    const anns = this.getAnnouncementsFor(day, start);
    const hasA = anns.some(a => a.type === 'absence');
    const hasC = anns.some(a => a.type === 'catchup');
    
    if (hasA && hasC) return 'both';
    if (hasA) return 'absence';
    if (hasC) return 'catchup';
    
    return 'normal';
  }

  openAnnouncementForm(day: string, timeStart: string, timeEnd: string) {
    this.selectedDay = day;
    this.selectedTimeStart = timeStart;
    this.selectedTimeEnd = timeEnd;
    
    // Pre-populate the form
    const today = new Date();
    this.announcementForm.targetedDate = today.toISOString().split('T')[0]; // YYYY-MM-DD
    
    this.showAnnouncementForm = true;
  }

  closeAnnouncementForm() {
    this.showAnnouncementForm = false;
  }

  submitAnnouncement() {
    // Form validation
    if (!this.announcementForm.targetedDate) {
      alert('Please select a date for the announcement');
      return;
    }
    
    if (!this.announcementForm.studentComment) {
      alert('Please add a comment for students');
      return;
    }
    
    // Convert form date to ISO format with selected time
    const datePart = this.announcementForm.targetedDate;
    const timePart = this.selectedTimeStart + ':00';
    const targetedDate = `${datePart}T${timePart}`;
    
    // Create announcement object
    const announcement: AnnouncementDTOForTeachers = {
      ...this.announcementForm,
      targetedDate
    };
    
    // Submit announcement
    this.teacherService.sendAnnouncement(announcement).subscribe({
      next: (response) => {
        console.log('Announcement submitted:', response);
        alert('Announcement submitted successfully!');
        this.closeAnnouncementForm();
        
        // Refresh announcements
        this.loadAnnouncements();
        
        // If we're in teacher view, also refresh teacher timetable to show updates
        if (this.currentView === 'teacher') {
          this.loadTeacherTimetable();
        }
      },
      error: (error) => {
        console.error('Error submitting announcement:', error);
        alert('Failed to submit announcement. Please try again.');
      }
    });
  }
}