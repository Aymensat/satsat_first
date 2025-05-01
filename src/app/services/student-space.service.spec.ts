import { TestBed } from '@angular/core/testing';

import { StudentSpaceService } from './student-space.service';

describe('StudentSpaceService', () => {
  let service: StudentSpaceService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(StudentSpaceService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
