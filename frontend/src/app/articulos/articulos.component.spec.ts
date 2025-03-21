import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ArticulosComponent } from './articulos.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';
import { WebSocketService } from '../utils/websocket.service';

describe('ArticulosComponent', () => {
  let component: ArticulosComponent;
  let fixture: ComponentFixture<ArticulosComponent>;
  let mockDialog: jasmine.SpyObj<MatDialog>;
  let mockWebSocketService: jasmine.SpyObj<WebSocketService>;

  beforeEach(async () => {
    mockDialog = jasmine.createSpyObj('MatDialog', ['open']);
    mockWebSocketService = jasmine.createSpyObj('WebSocketService', ['nuevoArticulo$']);

    await TestBed.configureTestingModule({
      imports: [HttpClientTestingModule, ArticulosComponent],
      providers: [
        { provide: MatDialog, useValue: mockDialog },
        { provide: WebSocketService, useValue: mockWebSocketService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(ArticulosComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería cargar los artículos al inicializarse', () => {
    const mockArticulos = [
      { id: 1, titulo: 'Artículo 1', contenido: 'Contenido 1', autor: 'Autor 1', views: 10 },
      { id: 2, titulo: 'Artículo 2', contenido: 'Contenido 2', autor: 'Autor 2', views: 5 }
    ];

    spyOn(component['http'], 'get').and.returnValue(of(mockArticulos));

    component.cargarArticulos();

    expect(component.articulos.length).toBe(2);
    expect(component.articulos).toEqual(mockArticulos);
  });

  it('debería abrir el diálogo para agregar un artículo', () => {
    const dialogRefSpy = jasmine.createSpyObj('MatDialogRef', ['afterClosed']);
    dialogRefSpy.afterClosed.and.returnValue(of({ titulo: 'Nuevo Artículo', contenido: 'Contenido' }));
    mockDialog.open.and.returnValue(dialogRefSpy);

    component.agregarArticulo();

    expect(mockDialog.open).toHaveBeenCalled();
  });

  it('debería agregar un artículo a la lista al recibirlo por WebSocket', () => {
    const mockArticulo = { id: 3, titulo: 'Nuevo Artículo', contenido: 'Contenido', autor: 'Autor', views: 0 };
    mockWebSocketService.nuevoArticulo$ = of(mockArticulo);

    mockWebSocketService.nuevoArticulo$.subscribe((nuevoArticulo) => {
      component.agregarArticuloALaVista(nuevoArticulo);
    });

    expect(component.articulos.length).toBe(1);
    expect(component.articulos[0]).toEqual(mockArticulo);
  });
});