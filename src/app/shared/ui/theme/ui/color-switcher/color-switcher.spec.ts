import { ComponentFixture, TestBed } from '@angular/core/testing';

import { ColorSwitcher } from './color-switcher';

describe('ColorSwitcher', () => {
  let component: ColorSwitcher;
  let fixture: ComponentFixture<ColorSwitcher>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ColorSwitcher],
    }).compileComponents();

    fixture = TestBed.createComponent(ColorSwitcher);
    component = fixture.componentInstance;
    await fixture.whenStable();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
