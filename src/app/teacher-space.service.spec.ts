import { TestBed } from '@angular/core/testing';

import { TeacherSpaceService } from './teacher-space.service';

describe('TeacherSpaceService', () => {
  let service: TeacherSpaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(TeacherSpaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
