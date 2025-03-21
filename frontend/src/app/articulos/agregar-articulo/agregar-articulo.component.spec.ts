import { ComponentFixture, TestBed } from '@angular/core/testing';
import { AgregarArticuloComponent } from './agregar-articulo.component';
import { ReactiveFormsModule } from '@angular/forms';
import { MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';

describe('AgregarArticuloComponent', () => {
  let component: AgregarArticuloComponent;
  let fixture: ComponentFixture<AgregarArticuloComponent>;
  let dialogRefSpy: jasmine.SpyObj<MatDialogRef<AgregarArticuloComponent>>;

  beforeEach(async () => {
    dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['close']);

    await TestBed.configureTestingModule({
      imports: [ReactiveFormsModule, AgregarArticuloComponent],
      providers: [
        { provide: MatDialogRef, useValue: dialogRefSpy },
        { provide: MAT_DIALOG_DATA, useValue: {} }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AgregarArticuloComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería inicializar el formulario vacío', () => {
    expect(component.articuloForm).toBeDefined();
    expect(component.articuloForm.valid).toBeFalse();
  });

  it('debería cerrar el diálogo con los datos del formulario al guardar', () => {
    component.articuloForm.setValue({ titulo: 'Título de prueba', contenido: 'Contenido de prueba' });
    component.guardar();

    expect(dialogRefSpy.close).toHaveBeenCalledWith({
      titulo: 'Título de prueba',
      contenido: 'Contenido de prueba'
    });
  });

  it('debería cerrar el diálogo sin datos al cancelar', () => {
    component.cancelar();
    expect(dialogRefSpy.close).toHaveBeenCalledWith();
  });
});