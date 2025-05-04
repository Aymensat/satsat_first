import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { Observable, catchError, throwError, of } from 'rxjs';
import { tap } from 'rxjs/operators';

// Import the DTO from the OpenAPI spec
export interface AnnouncementDTOForAdmins {
  id: number;
  teacherFullName: string;
  teacherEmail: string;
  classYear: 'first' | 'second' | 'third';
  field: 'gsil' | 'mechatronics' | 'computer_science' | 'infotronics';
  classLetter: 'a' | 'b' | 'c' | 'd';
  targetedDate: string;
  weekday: string;
  type: 'absence' | 'catchup';
  state: 'pending' | 'approved' | 'rejected';
  studentComment: string;
  administratorComment: string;
  createdAt: string;
}

// Interface for the update request
export interface AnnouncementUpdateDTO {
  state: 'approved' | 'rejected' | 'pending';
  administratorComment?: string;
}

@Injectable({
  providedIn: 'root'
})
export class AdminService {
  private apiURL = 'http://localhost:8080';
  
  constructor(private http: HttpClient) { }
  
  // Get all announcements for admin
  getAllAnnouncements(): Observable<AnnouncementDTOForAdmins[]> {
    return this.http.get<AnnouncementDTOForAdmins[]>(`${this.apiURL}/administration/all-announcement`)
      .pipe(
        tap(announcements => {
          console.log('Fetched admin announcements:', announcements.length);
        }),
        catchError(this.handleError<AnnouncementDTOForAdmins[]>('getAllAnnouncements', []))
      );
  }
  
  // Update announcement status
  updateAnnouncementStatus(id: number, status: 'approved' | 'rejected' | 'pending', comment?: string): Observable<any> {
    const updateData: AnnouncementUpdateDTO = {
      state: status,
      administratorComment: comment
    };
    
    return this.http.put(`${this.apiURL}/administration/announcement/${id}`, updateData)
      .pipe(
        tap(() => {
          console.log(`Updated announcement ${id} status to ${status}`);
        }),
        catchError(this.handleError<any>('updateAnnouncementStatus'))
      );
  }
  
  // Generic error handler
  private handleError<T>(operation = 'operation', result?: T) {
    return (error: HttpErrorResponse): Observable<T> => {
      console.error(`${operation} failed: ${error.message}`);
      
      if (error.status === 401) {
        // Unauthorized - handle auth error (e.g., redirect to login)
        console.error('Authentication error. Please login again.');
      } else if (error.status === 403) {
        // Forbidden - handle permission error
        console.error('You do not have permission to perform this action.');
      }
      
      // Return empty result or re-throw based on operation
      if (result !== undefined) {
        return of(result as T);
      } else {
        return throwError(() => new Error(`${operation} failed: ${error.message}`));
      }
    };
  }
  
  // Additional helper methods could be added here
  getAnnouncementStatistics(): Observable<any> {
    return this.http.get<any>(`${this.apiURL}/administration/statistics`)
      .pipe(
        catchError(this.handleError<any>('getAnnouncementStatistics', {}))
      );
  }
}