import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { HttpClient } from '@angular/common/http';
import { FormsModule } from '@angular/forms';

interface ScheduleEntry {
  subject: string;
  date: string;
  status: 'attended' | 'absent' | 'catchup' | 'unknown';
}

@Component({
  selector: 'app-student-space',
  templateUrl: './student-space.component.html',
  styleUrls: ['./student-space.component.css'],
  imports: [FormsModule ]
})
export class StudentSpaceComponent implements OnInit {
  field = '';
  year = '';
  className = '';
  schedule: ScheduleEntry[] = [];
  loading = true;

  constructor(
    private route: ActivatedRoute,
    private http: HttpClient,
    private router: Router
  ) {}

  ngOnInit() {
    this.route.params.subscribe(params => {
      this.field = params['field'];
      this.year = params['year'];
      this.className = params['class'];
      this.fetchSchedule();
    });
  }

  fetchSchedule() {
    this.loading = true;
    this.http
      .get<ScheduleEntry[]>(`/api/schedule?field=${this.field}&year=${this.year}&class=${this.className}`)
      .subscribe(data => {
        this.schedule = data;
        this.loading = false;
      });
  }

  updateRoute() {
    this.router.navigate(['/student-space', this.field, this.year, this.className]);
  }
}
