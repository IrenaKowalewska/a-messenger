import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatListTabComponent } from './chat-list-tab.component';

describe('ChatListTabComponent', () => {
  let component: ChatListTabComponent;
  let fixture: ComponentFixture<ChatListTabComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatListTabComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatListTabComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
