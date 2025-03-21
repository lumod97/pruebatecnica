import { TestBed, ComponentFixture } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HttpClientTestingModule } from '@angular/common/http/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { of } from 'rxjs';
import { NotificationBarComponent } from './shared/notification-bar/notification-bar.component';
import { WebSocketService } from './utils/websocket.service';
import { AuthService } from './utils/auth-service.service';
import { UserService } from './utils/user-service.service';

describe('AppComponent', () => {
  let component: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let mockAuthService: jasmine.SpyObj<AuthService>;
  let mockUserService: jasmine.SpyObj<UserService>;
  let mockWebSocketService: jasmine.SpyObj<WebSocketService>;

  beforeEach(async () => {
    mockAuthService = jasmine.createSpyObj('AuthService', ['isLoggedIn$', 'userName$']);
    mockUserService = jasmine.createSpyObj('UserService', ['obtenerUsuarioPorId']);
    mockWebSocketService = jasmine.createSpyObj('WebSocketService', ['nuevoArticulo$']);

    await TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NotificationBarComponent // Importa el componente standalone
      ],
      declarations: [AppComponent],
      providers: [
        { provide: AuthService, useValue: mockAuthService },
        { provide: UserService, useValue: mockUserService },
        { provide: WebSocketService, useValue: mockWebSocketService }
      ]
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    component = fixture.componentInstance;
  });

  it('debería crearse el componente', () => {
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

  it('debería agregar un artículo a la lista y mostrar una notificación', () => {
    const mockArticulo = { id: 3, titulo: 'Nuevo Artículo', contenido: 'Contenido', autor: 'Autor', views: 0 };
    const notificationSpy = spyOn(component.notificationBar, 'showNotification');

    component.agregarArticuloALaVista(mockArticulo);

    expect(component.articulos.length).toBe(1);
    expect(component.articulos[0]).toEqual(mockArticulo);
    expect(notificationSpy).toHaveBeenCalledWith(`Nuevo artículo agregado: "Nuevo Artículo" por Autor`);
  });

  it('debería guardar un artículo y agregarlo a la lista', () => {
    const mockArticulo = { titulo: 'Nuevo Artículo', contenido: 'Contenido', autor: 'Autor' };
    const mockArticuloGuardado = { ...mockArticulo, id: 3, views: 0 };
    spyOn(component['http'], 'post').and.returnValue(of(mockArticuloGuardado));

    component.guardarArticulo(mockArticulo);

    expect(component.articulos.length).toBe(1);
    expect(component.articulos[0]).toEqual(mockArticuloGuardado);
  });

  it('debería manejar el cierre de sesión correctamente', () => {
    const routerSpy = spyOn(component['router'], 'navigate');
    const authSpy = spyOn(component['authService'], 'logout');

    component.cerrarSesion();

    expect(authSpy).toHaveBeenCalled();
    expect(routerSpy).toHaveBeenCalledWith(['/login']);
  });

  it('debería obtener el usuario al iniciar sesión', () => {
    const mockUser = { nombreUsuario: 'Usuario Test' };
    mockUserService.obtenerUsuarioPorId.and.returnValue(of(mockUser));

    component.userId = 1;
    component.obtenerUsuario();

    expect(component.userName).toBe('Usuario Test');
    expect(mockAuthService.userName$).toHaveBeenCalledWith('Usuario Test');
  });
});
