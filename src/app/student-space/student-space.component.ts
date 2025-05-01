import { Component } from '@angular/core';
import { StudentSpaceService, TimetableDTO } from '../services/student-space.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

interface TimeSlot {
  start: string;
  end: string;
}

@Component({
  selector: 'app-student-space',
  standalone: true,
  imports: [FormsModule, CommonModule],
  templateUrl: './student-space.component.html',
  styleUrls: ['./student-space.component.css']
})
export class StudentSpaceComponent {
  field = 'computer_science';
  classYear = 'first';
  classLetter = 'a';

  timetable: TimetableDTO[] = [];

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

  constructor(private studentService: StudentSpaceService) {}

  onClickHandler() {
    this.studentService
      .getTimeTable(this.field, this.classYear, this.classLetter)
      .subscribe((data) => (this.timetable = data));
  }

  /**
   * Find the one timetable entry matching a day + startingTime
   */
  getEntry(day: string, start: string): TimetableDTO | undefined {
    return this.timetable.find(
      (t) => t.dayOfWeek === day && t.startingTime.startsWith(start)
    );
  }
}
