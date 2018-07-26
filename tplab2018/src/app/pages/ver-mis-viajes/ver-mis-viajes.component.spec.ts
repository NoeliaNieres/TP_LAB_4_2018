import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { VerMisViajesComponent } from './ver-mis-viajes.component';

describe('VerMisViajesComponent', () => {
  let component: VerMisViajesComponent;
  let fixture: ComponentFixture<VerMisViajesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ VerMisViajesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(VerMisViajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
