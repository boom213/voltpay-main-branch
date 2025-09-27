import { ComponentFixture, TestBed } from '@angular/core/testing';

import { GreenEnergyComponent } from './green-energy.component';

describe('GreenEnergyComponent', () => {
  let component: GreenEnergyComponent;
  let fixture: ComponentFixture<GreenEnergyComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [GreenEnergyComponent]
    });
    fixture = TestBed.createComponent(GreenEnergyComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
