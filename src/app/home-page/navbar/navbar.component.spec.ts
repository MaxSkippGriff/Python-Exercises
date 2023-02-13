import {ComponentFixture, fakeAsync, TestBed} from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { NavbarComponent } from './navbar.component';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';
import { tick } from '@angular/core/testing';

describe('NavbarComponent', () => {
  let component: NavbarComponent;
  let fixture: ComponentFixture<NavbarComponent>;
  let html: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ NavbarComponent ],
      imports: [ HttpClientModule, RouterTestingModule ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(NavbarComponent);
    component = fixture.componentInstance;
    html = fixture.debugElement;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should link to homepage', () => {
    const element = html.query(By.css('#home'));
    expect(element.attributes.routerLink).toEqual('/home');
  });

  it('should link to leaderboard page', () => {
    const element = html.query(By.css('#leaderboard'));
    expect(element.attributes.routerLink).toEqual('/home/leaderboard');
  });

  it('should link to profile page', () => {
    const element = html.query(By.css('#profile'));
    expect(element.attributes.routerLink).toEqual('/home/profile');
  });

  it('should signout when signout is clicked', fakeAsync(() => {
    spyOn(component, 'signout');
    const signoutLink = html.query(By.css('#signout-link'));
    signoutLink.triggerEventHandler('click', null);
    tick();
    expect(component.signout).toHaveBeenCalled();
  }));
});
