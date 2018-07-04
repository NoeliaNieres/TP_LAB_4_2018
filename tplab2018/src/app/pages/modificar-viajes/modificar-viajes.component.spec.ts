import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { ModificarViajesComponent } from './modificar-viajes.component';

describe('ModificarViajesComponent', () => {
  let component: ModificarViajesComponent;
  let fixture: ComponentFixture<ModificarViajesComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ ModificarViajesComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(ModificarViajesComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
