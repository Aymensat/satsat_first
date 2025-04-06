import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomePageComponent } from './home-page/home-page.component';
import { StudentSpaceComponent } from "./student-space/student-space.component"; 


@Component({
  selector: 'app-root',
  imports: [RouterOutlet, HomePageComponent, StudentSpaceComponent],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my_project';
}
