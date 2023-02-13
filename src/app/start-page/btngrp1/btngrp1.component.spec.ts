import { ComponentFixture, TestBed } from '@angular/core/testing';

import { Btngrp1Component } from './btngrp1.component';

describe('Btngrp1Component', () => {
  let component: Btngrp1Component;
  let fixture: ComponentFixture<Btngrp1Component>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [ Btngrp1Component ]
    })
    .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(Btngrp1Component);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
