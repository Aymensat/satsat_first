// student-schedule.component.ts
import { Component, OnInit } from '@angular/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


@Component({
  selector: 'app-student-schedule',
  templateUrl: './student-schedule.component.html',

imports: [
  CommonModule,
  FormsModule   ],



  styleUrls: ['./student-schedule.component.css']
})
export class StudentScheduleComponent implements OnInit {
  // Current week data
  currentDate: Date = new Date();
  weekDays: string[] = ['Lundi', 'Mardi', 'Mercredi', 'Jeudi', 'Vendredi', 'Samedi'];
  timeSlots: string[] = ['08h30', '09h30', '10h30', '11h40', '12h30', '13h30', '14h00', '15h00', '16h00', '17h00'];
  
  // Filters
  selectedField: string = 'INFORMATIQUE';
  selectedYear: string = '2 eme';
  selectedClass: string = 'C';
  
  // Mock data for classes
  classes = [
    {
      id: 1,
      day: 'Lundi',
      startTime: '08h30',
      endTime: '10h30',
      subject: 'Syst. embarqués',
      professor: 'Prof. Benhamadi',
      room: 'S34',
      type: 'normal' // normal, makeup, canceled
    },
    {
      id: 2,
      day: 'Lundi',
      startTime: '14h00',
      endTime: '16h00',
      subject: 'Intell. Artificielle',
      professor: 'Mme. Zaghib',
      room: 'S30',
      type: 'normal'
    },
    {
      id: 3,
      day: 'Mardi',
      startTime: '08h30',
      endTime: '10h30',
      subject: 'Comm. en Entreprise',
      professor: 'Mme. Souafi',
      room: 'S24',
      type: 'normal'
    },
    {
      id: 4,
      day: 'Mercredi',
      startTime: '08h30',
      endTime: '10h30',
      subject: 'Développement Mobile',
      professor: 'Mme. Lamouret',
      room: 'S22',
      type: 'canceled'
    },
    {
      id: 5,
      day: 'Vendredi',
      startTime: '11h40',
      endTime: '13h30',
      subject: 'Analyse des Données',
      professor: 'Prof. Bellanger',
      room: 'S32',
      type: 'makeup',
      comment: 'Révision pour l\'examen final'
    }
  ];
  
  // Notifications
  notifications = [
    {
      id: 1,
      title: 'Séance de rattrapage',
      message: 'Le cours de Développement Mobile du mercredi sera rattrapé vendredi à 11h40',
      date: new Date(),
      read: false
    },
    {
      id: 2,
      title: 'Correction TD',
      message: 'Nous allons corriger le TD Algorithmique avancée samedi à 10h00',
      date: new Date(Date.now() - 86400000),
      read: true
    }
  ];

  constructor() { }

  ngOnInit(): void {
  }

  // Get classes for specific day and time
  getClassForSlot(day: string, time: string): any {
    return this.classes.find(c => 
      c.day === day && 
      c.startTime === time
    );
  }

  // Check if a class spans multiple time slots
  doesClassSpan(day: string, time: string, nextTime: string): boolean {
    const currentClass = this.getClassForSlot(day, time);
    const nextTimeIndex = this.timeSlots.indexOf(nextTime);
    
    if (!currentClass || nextTimeIndex === -1) return false;
    
    const startTimeIndex = this.timeSlots.indexOf(currentClass.startTime);
    const endTimeIndex = this.timeSlots.indexOf(currentClass.endTime);
    
    return nextTimeIndex > startTimeIndex && nextTimeIndex < endTimeIndex;
  }

  // Filter classes based on selected field, year, and class
  applyFilters(): void {
    // This would normally make an API call with the selected filters
    console.log('Filters applied:', this.selectedField, this.selectedYear, this.selectedClass);
    // For now we're using mock data, so we don't need to do anything
  }

  // Navigate to previous week
  previousWeek(): void {
    const date = new Date(this.currentDate);
    date.setDate(date.getDate() - 7);
    this.currentDate = date;
    // Would normally fetch new data for this week
  }

  // Navigate to next week
  nextWeek(): void {
    const date = new Date(this.currentDate);
    date.setDate(date.getDate() + 7);
    this.currentDate = date;
    // Would normally fetch new data for this week
  }

  // Go to today
  goToToday(): void {
    this.currentDate = new Date();
    // Would normally fetch data for current week
  }

  // Mark notification as read
  markNotificationAsRead(id: number): void {
    const notification = this.notifications.find(n => n.id === id);
    if (notification) {
      notification.read = true;
    }
  }

    // Add these methods to your component class
  getUnreadNotificationsCount(): number {
    return this.notifications.filter(n => !n.read).length;
  }

  hasUnreadNotifications(): boolean {
    return this.getUnreadNotificationsCount() > 0;
  }


}