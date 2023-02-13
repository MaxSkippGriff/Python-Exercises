import { ComponentFixture, TestBed } from '@angular/core/testing';
import { HttpClientModule } from '@angular/common/http';
import { LoginComponent } from './login.component';
import { RouterTestingModule } from '@angular/router/testing';
import { FormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { DebugElement } from '@angular/core';

describe('LoginComponent', () => {
  let component: LoginComponent;
  let fixture: ComponentFixture<LoginComponent>;
  let html: DebugElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ LoginComponent ],
      imports: [ HttpClientModule, RouterTestingModule, FormsModule ]
    }).compileComponents().then(() => {
      fixture = TestBed.createComponent(LoginComponent);
      component = fixture.componentInstance;
      html = fixture.debugElement;
      fixture.detectChanges();
    });
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('invalid username message is hidden', () => {
    const element = html.query(By.css('#invalidUsername'));
    expect(element.nativeElement.hasAttribute('hidden')).toBeTruthy();
  });


  it('invalid password message is hidden', () => {
    const element = html.query(By.css('#invalidPassword'));
    expect(element.nativeElement.hasAttribute('hidden')).toBeTruthy();
  });
});
