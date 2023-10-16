import { TestBed } from '@angular/core/testing';

import { AddingPlayerService } from './adding-player.service';

describe('AddingPlayerService', () => {
  let service: AddingPlayerService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(AddingPlayerService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
