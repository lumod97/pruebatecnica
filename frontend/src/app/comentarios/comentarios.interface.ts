export interface Comentario {
  id: number; // ID único del comentario
  contenido: string; // Texto del comentario
  articuloId: number; // ID del artículo al que pertenece el comentario
  usuarioId: number; // ID del usuario que hizo el comentario
}