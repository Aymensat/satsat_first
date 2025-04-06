import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { StudentScheduleComponent } from './student-schedule/student-schedule.component'; 


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomePageComponent, StudentScheduleComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my_project';
}
