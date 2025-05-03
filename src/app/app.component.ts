import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';

import { RouterLink, RouterLinkActive  } from '@angular/router';

import {StudentSpaceComponent} from './student-space/student-space.component'
import { TeacherSpaceComponent } from './teacher-space/teacher-space.component';



@Component({
  selector: 'app-root',
  imports: [RouterOutlet ,  RouterLink, RouterLinkActive ,StudentSpaceComponent  , TeacherSpaceComponent ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent {
  title = 'my_project';
}
