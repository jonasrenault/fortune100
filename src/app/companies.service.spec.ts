/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { CompaniesService } from './companies.service';

describe('Service: Companies', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [CompaniesService]
    });
  });

  it('should ...', inject([CompaniesService], (service: CompaniesService) => {
    expect(service).toBeTruthy();
  }));
});
