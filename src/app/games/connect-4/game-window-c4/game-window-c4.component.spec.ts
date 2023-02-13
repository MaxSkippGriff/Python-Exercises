import { ComponentFixture, TestBed } from '@angular/core/testing';
import { GameWindowC4Component } from './game-window-c4.component';

describe('GameWindowC4Component', () => {
  let component: GameWindowC4Component;
  let fixture: ComponentFixture<GameWindowC4Component>;

  beforeEach(async() => {
    await TestBed.configureTestingModule({
      declarations: [ GameWindowC4Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(GameWindowC4Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
