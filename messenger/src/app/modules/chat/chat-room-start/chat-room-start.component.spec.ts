import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ChatRoomStartComponent } from './chat-room-start.component';

describe('ChatRoomStartComponent', () => {
  let component: ChatRoomStartComponent;
  let fixture: ComponentFixture<ChatRoomStartComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ ChatRoomStartComponent ]
    })
    .compileComponents();

    fixture = TestBed.createComponent(ChatRoomStartComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
