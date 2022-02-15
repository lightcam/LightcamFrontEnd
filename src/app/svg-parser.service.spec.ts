import { TestBed } from '@angular/core/testing';

import { SvgParserService } from './svg-parser.service';

describe('SvgParserService', () => {
  let service: SvgParserService;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(SvgParserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
