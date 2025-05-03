import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, of, catchError } from 'rxjs';
import { 
  TimetableDTO, 
  AnnouncementDTOForStudents, 
  AnnouncementDTOForTeachers 
} from './student-space.service';

@Injectable({
  providedIn: 'root'
})
export class TeacherSpaceService {
  private apiURL = 'http://localhost:8080';
  
  constructor(private http: HttpClient) { }
  
  getTimeTable(field: string, year: string, letter: string): Observable<TimetableDTO[]> {
    return this.http.get<TimetableDTO[]>(`${this.apiURL}/timetable`, 
      { params: { 'field': field, 'class-letter': letter, 'class-year': year } }
    ).pipe(
      catchError(error => {
        console.error('Error fetching timetable:', error);
        return of([]);
      })
    );
  }
  
  getAnnouncements(field: string, year: string, letter: string): Observable<AnnouncementDTOForStudents[]> {
    return this.getTimeTable(field, year, letter).pipe(
      switchMap((timetable: TimetableDTO[]) => {
        const classId = timetable[0]?.StudentGroupId;
        if (!classId) {
          console.error("Class ID not found in timetable");
          return of([]);
        }
        return this.http.get<AnnouncementDTOForStudents[]>(`${this.apiURL}/annoncement/${classId}`);
      }),
      catchError(error => {
        console.error('Error fetching announcements:', error);
        return of([]);
      })
    );
  }
  
  // Get timetable for specific teacher (across all classes)
  getTeacherTimetable(): Observable<TimetableDTO[]> {
    return this.http.get<TimetableDTO[]>(`${this.apiURL}/timetable/teacher`).pipe(
      catchError(error => {
        console.error('Error fetching teacher timetable:', error);
        return of([]);
      })
    );
  }
  
  // Send announcement
  sendAnnouncement(announcement: AnnouncementDTOForTeachers): Observable<any> {
    return this.http.post(`${this.apiURL}/teacher`, announcement).pipe(
      catchError(error => {
        console.error('Error sending announcement:', error);
        throw error; // Re-throw to handle in component
      })
    );
  }
}