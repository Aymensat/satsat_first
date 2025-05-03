// Used for both students and teachers to represent timetable entries
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
  
  // Used by students to send announcements (e.g. absence or catch-up request)
  export interface AnnouncementDTOForStudents {
    teacherFullName: string;
    teacherEmail: string;
    type: 'absence' | 'catchup';
    targetedDate: string; 
    weekday : string
    studentComment: string;
  }
  
  
  // Used by teachers to respond or send announcements
  export interface AnnouncementDTOForTeachers {
    field: string;
    classYear: string;
    classLetter: string;
    targetedDate: string;
    type: 'absence' | 'catchup';
    studentComment: string;
    administratorComment: string;
  }
  
  // Used for listing announcements for teachers to see
  export interface AnnouncementOverviewForTeachers {
    id: number;
    fullName: string;
    field: string;
    classYear: string;
    classLetter: string;
    targetedDate: string;
    type: 'absence' | 'catchup';
    studentComment: string;
    status: 'pending' | 'approved' | 'rejected';
  }
  
  // Example DTO for authentication response
  export interface AuthResponse {
    token: string;
    role: 'student' | 'teacher' | 'admin';
    username: string;
  }
  
  // Used if there's a login form model
  export interface LoginFormDTO {
    username: string;
    password: string;
  }
  