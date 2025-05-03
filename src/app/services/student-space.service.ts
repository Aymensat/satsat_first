import { Injectable } from '@angular/core';
import { HttpClient , HttpHeaders } from '@angular/common/http';
import { Observable, switchMap  } from 'rxjs';



export interface TimetableDTO {
  id: number;
  StudentGroupId: number;
  classYear: 'first' | 'second' | 'third';
  field: 'gsil' | 'mechatronics' | 'computer_science' | 'infotronics';
  classLetter: 'a' | 'b' | 'c' | 'd';
  teacherId: number;
  teacherName: string;
  subject: string;
  startingTime: string; // Format: "HH:MM:SS"
  dayOfWeek: 'monday' | 'tuesday' | 'wednesday' | 'thursday' | 'friday' | 'saturday' | 'sunday';
  room: number;
}

export interface AnnouncementDTOForStudents {
  teacherFullName: string;
  teacherEmail: string;
  type: 'absence' | 'catchup';
  targetedDate: string; 
  weekday : string
  studentComment: string;
}

export interface AnnouncementDTOForTeachers {
  field: string;
  classYear: string;
  classLetter: string;
  targetedDate: string; // ISO string with time, e.g., "2025-05-03T08:30:00"
  type: 'absence' | 'catchup';
  studentComment: string;
  administratorComment: string;
}



@Injectable({
  providedIn: 'root'
})
export class StudentSpaceService {

  private apiURL = 'http://localhost:8080' ;

  constructor(private http : HttpClient) { }

  getTimeTable( field : string , year  : string , letter : string ) : Observable<TimetableDTO[]>{

    return this.http.get<TimetableDTO[]> (`${this.apiURL}/timetable` , 

      { params : { 'field' : field , 'class-letter': letter , 'class-year':  year  }
  } ) ;
}


getAnnouncements(field : string , year  : string , letter : string) : Observable<AnnouncementDTOForStudents[]> {
  
  
  return this.getTimeTable(field , year , letter ).pipe(
    switchMap((timetable: TimetableDTO[]) => {const classId = timetable[0]?.StudentGroupId;
      if (!classId) {
        throw new Error("Class ID not found in timetable");
      }
      return this.http.get<AnnouncementDTOForStudents[]>(`${this.apiURL}/annoncement/${classId}`);
    })
  );
}
   
}



  

