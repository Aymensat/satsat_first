import { Component , OnInit} from '@angular/core';
import { StudentSpaceService } from '../services/student-space.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { TimetableDTO , AnnouncementDTOForStudents } from '../models/dtos';

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
  Announcements : AnnouncementDTOForStudents[] = []

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

  constructor(private studentService: StudentSpaceService) {}


  ngOnInit() {}
  onClickHandler() {
    // load timetable…
    this.studentService
      .getTimeTable(this.field, this.classYear, this.classLetter)
      .subscribe(data => (this.timetable = data));

    // load announcements and build map
    this.studentService
      .getAnnouncements(this.field, this.classYear, this.classLetter)
      .subscribe(data => {
        this.Announcements = data;
        this.buildAnnouncementsMap();
        console.log(this.announcementsMap); 
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

  
  private buildAnnouncementsMap() {
    this.announcementsMap = {};
    for (let ann of this.Announcements) {
      // assume targetedDate is an ISO string e.g. "2025-05-02T10:10:00"
      const dt = new Date(ann.targetedDate);
      const day :string= ann.weekday; // e.g. "monday"
      const hhmm : string = dt.toTimeString().slice(0,5); // "10:10"
      //console.log("hi " +day); 
      this.announcementsMap[day] ??= {};
      this.announcementsMap[day][hhmm] ??= [];
      this.announcementsMap[day][hhmm].push(ann);
    }
    

  }

  /** returns all announcements for this cell (or empty array) */
  getAnnouncementsFor(day: string, time: string) {
    //console.log('Checking for:', day, time);
    //console.log(this.announcementsMap[day]?.[time]);
    return this.announcementsMap[day]?.[time] || [];
  }

  getCellState(day: string, start: string): 'normal'|'absence'|'catchup'|'both' {
    const anns = this.getAnnouncementsFor(day, start);
    const hasA = anns.some(a => a.type === 'absence');
    const hasC = anns.some(a => a.type === 'catchup');
    if (day == "friday" ) console.log( day , start , hasA , hasC )
    if (hasA && hasC) return 'both';
    if (hasA) return 'absence';
    if (hasC) { console.log("wiw") ; return 'catchup' ;}
    
    return 'normal';
  }



}
