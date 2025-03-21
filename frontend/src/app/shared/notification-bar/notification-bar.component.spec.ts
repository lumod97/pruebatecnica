import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NotificationBarComponent } from './notification-bar.component';

describe('NotificationBarComponent', () => {
  let component: NotificationBarComponent;
  let fixture: ComponentFixture<NotificationBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [NotificationBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(NotificationBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('debería crearse correctamente', () => {
    expect(component).toBeTruthy();
  });

  it('debería mostrar una notificación y ocultarla después de 5 segundos', (done) => {
    const message = 'Notificación de prueba';
    component.showNotification(message);

    expect(component.message).toBe(message);
    expect(component.isVisible).toBeTrue();

    setTimeout(() => {
      expect(component.isVisible).toBeFalse();
      done();
    }, 5000);
  });
});