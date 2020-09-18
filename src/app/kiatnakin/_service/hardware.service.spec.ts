/* tslint:disable:no-unused-variable */

import { TestBed, async, inject } from '@angular/core/testing';
import { HardwareService } from './hardware.service';

describe('HardwareService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [HardwareService]
    });
  });

  it('should ...', inject([HardwareService], (service: HardwareService) => {
    expect(service).toBeTruthy();
  }));
});
