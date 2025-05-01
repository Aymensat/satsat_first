import { Component } from '@angular/core';
import { AnnouncementDTOForStudents, StudentSpaceService } from '../services/student-space.service';
import { TimetableDTO } from '../services/student-space.service';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-student-space',
  imports: [FormsModule, CommonModule],
  templateUrl: './student-space.component.html',
  styleUrl: './student-space.component.css'
})
export class StudentSpaceComponent {

  field : string  = "";
  classYear : string = "" ;
  classLetter : string = "" ;
  timetable: TimetableDTO[]  = [];
  announcements : AnnouncementDTOForStudents[] = [] ;
  daysOfWeek = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
  timeSlots = ['08:00', '09:30', '11:00', '12:30', '14:00', '15:30'];



  constructor(private studentService: StudentSpaceService) {}


  onClickHandler()  {
    this.studentService.getTimeTable(this.field, this.classYear, this.classLetter).
    subscribe(data => {this.timetable = data ;    } ) 


    this.studentService.getAnnouncements(this.field, this.classYear, this.classLetter).
    subscribe(data => {this.announcements = data ;    } )

  }

}





