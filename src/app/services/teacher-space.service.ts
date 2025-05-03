import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, switchMap, of } from 'rxjs';
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
  
  // Assuming there's a way to get the currently logged-in teacher's ID
  private teacherId = 1; // This would be set from your auth system

  constructor(private http: HttpClient) { }

  getTimeTable(field: string, year: string, letter: string): Observable<TimetableDTO[]> {
    return this.http.get<TimetableDTO[]>(`${this.apiURL}/timetable`, 
      { params: { 'field': field, 'class-letter': letter, 'class-year': year } }
    );
  }

  getAnnouncements(field: string, year: string, letter: string): Observable<AnnouncementDTOForStudents[]> {
    return this.getTimeTable(field, year, letter).pipe(
      switchMap((timetable: TimetableDTO[]) => {
        const classId = timetable[0]?.StudentGroupId;
        if (!classId) {
          throw new Error("Class ID not found in timetable");
        }
        return this.http.get<AnnouncementDTOForStudents[]>(`${this.apiURL}/annoncement/${classId}`);
      })
    );
  }

  // Get timetable for specific teacher (across all classes)
  getTeacherTimetable(): Observable<TimetableDTO[]> {
    // This would ideally be an API endpoint that returns all classes for a teacher
    // For now, we'll simulate it by returning a filtered timetable
    // In a real implementation, you'd have a dedicated endpoint:
    // return this.http.get<TimetableDTO[]>(`${this.apiURL}/teacher-timetable/${this.teacherId}`);
    
    // Simulated data for demonstration
    // In a real scenario, you would replace this with an actual API call
    const mockTimetable: TimetableDTO[] = [
      {
        id: 101,
        StudentGroupId: 1,
        classYear: 'first',
        field: 'computer_science',
        classLetter: 'a',
        teacherId: this.teacherId,
        teacherName: 'Current Teacher',
        subject: 'Programming',
        startingTime: '08:30:00',
        dayOfWeek: 'monday',
        room: 101
      },
      {
        id: 102,
        StudentGroupId: 2,
        classYear: 'second',
        field: 'infotronics',
        classLetter: 'b',
        teacherId: this.teacherId,
        teacherName: 'Current Teacher',
        subject: 'Database Systems',
        startingTime: '10:10:00',
        dayOfWeek: 'monday',
        room: 102
      },
      {
        id: 103,
        StudentGroupId: 3,
        classYear: 'third',
        field: 'mechatronics',
        classLetter: 'c',
        teacherId: this.teacherId,
        teacherName: 'Current Teacher',
        subject: 'Advanced Systems',
        startingTime: '14:10:00',
        dayOfWeek: 'tuesday',
        room: 203
      }
    ];
    
    return of(mockTimetable);
  }

  // Send announcement
  sendAnnouncement(announcement: AnnouncementDTOForTeachers): Observable<any> {
    return this.http.post(`${this.apiURL}/teacher`, announcement);
  }
}