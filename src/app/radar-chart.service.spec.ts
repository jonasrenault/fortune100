/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { RadarChartService } from './radar-chart.service';

describe('Service: RadarChart', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [RadarChartService]
    });
  });

  it('should ...', inject([RadarChartService], (service: RadarChartService) => {
    expect(service).toBeTruthy();
  }));
});
