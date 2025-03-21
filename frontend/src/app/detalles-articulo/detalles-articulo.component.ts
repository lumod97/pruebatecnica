import { Component, Inject } from '@angular/core';
import { MatButtonModule } from '@angular/material/button';
import { MAT_DIALOG_DATA, MatDialogModule } from '@angular/material/dialog';
import { ComentariosComponent } from "../comentarios/comentario.component";
import { Articulo } from '../articulos/articulos.interface';

@Component({
  selector: 'app-detalles-articulo',
  templateUrl: './detalles-articulo.component.html',
  styleUrls: ['./detalles-articulo.component.scss'],
  imports: [
    MatDialogModule,
    MatButtonModule,
    ComentariosComponent
]
})
export class DetallesArticuloComponent {
  constructor(@Inject(MAT_DIALOG_DATA) public data: Articulo) {}
}