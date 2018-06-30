import { async, ComponentFixture, TestBed } from '@angular/core/testing';

import { UsuarioAbmComponent } from './usuario-abm.component';

describe('UsuarioAbmComponent', () => {
  let component: UsuarioAbmComponent;
  let fixture: ComponentFixture<UsuarioAbmComponent>;

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [ UsuarioAbmComponent ]
    })
    .compileComponents();
  }));

  beforeEach(() => {
    fixture = TestBed.createComponent(UsuarioAbmComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
