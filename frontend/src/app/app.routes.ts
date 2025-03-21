import { Routes } from '@angular/router';
import { ComentariosComponent } from './comentarios/comentario.component';
import { ArticulosComponent } from './articulos/articulos.component';
import { LoginComponent } from './login/login.component';
import { RegistroComponent } from './registro/registro.component';
import { AuthGuard } from './auth.guard';

export const routes: Routes = [
    {
        path: 'login', component: LoginComponent
    },
    {
        path: 'register', component: RegistroComponent
    },
    {
        path: 'articulos', component: ArticulosComponent, canActivate: [AuthGuard]
    },
    {
        path: 'comentarios', component: ComentariosComponent, canActivate: [AuthGuard]
    }
];
