import { ComponentFixture, TestBed } from '@angular/core/testing';

import { DetallesArticuloComponent } from './detalles-articulo.component';

describe('DetallesArticuloComponent', () => {
  let component: DetallesArticuloComponent;
  let fixture: ComponentFixture<DetallesArticuloComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [DetallesArticuloComponent]
    })
    .compileComponents();

    fixture = TestBed.createComponent(DetallesArticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
