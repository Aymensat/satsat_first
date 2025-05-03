import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { TimetableDTO, AnnouncementDTOForTeachers } from '../models/dtos';






@Injectable({ providedIn: 'root' })
export class TeacherSpaceService {
  private apiURL = 'http://localhost:8080';

  constructor(private http: HttpClient) {}

  /**
   * Fetches the timetable for the currently authenticated teacher.
   * Assumes backend derives teacher from auth context.
   */
  getMyTimetable(): Observable<TimetableDTO[]> {
    return this.http.get<TimetableDTO[]>(`${this.apiURL}/timetable/teacher`);
  }

  /**
   * Sends a new announcement (absence or catchup) for a class.
   */
  sendAnnouncement(payload: AnnouncementDTOForTeachers): Observable<any> {
    return this.http.post<any>(`${this.apiURL}/teacher`, payload);
  }
}