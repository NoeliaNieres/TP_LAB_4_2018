import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ViajesPagosComponent } from './viajes-pagos.component';

describe('ViajesPagosComponent', () => {
  let component: ViajesPagosComponent;
  let fixture: ComponentFixture<ViajesPagosComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ViajesPagosComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ViajesPagosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
