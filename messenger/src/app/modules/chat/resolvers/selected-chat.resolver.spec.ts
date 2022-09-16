import { TestBed } from '@angular/core/testing';

import { SelectedChatResolver } from './selected-chat.resolver';

describe('SelectedChatResolver', () => {
  let resolver: SelectedChatResolver;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    resolver = TestBed.inject(SelectedChatResolver);
  });

  it('should be created', () => {
    expect(resolver).toBeTruthy();
  });
});
