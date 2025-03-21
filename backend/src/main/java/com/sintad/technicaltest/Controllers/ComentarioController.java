package com.sintad.technicaltest.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.messaging.handler.annotation.DestinationVariable;
import org.springframework.messaging.handler.annotation.MessageMapping;
import org.springframework.messaging.handler.annotation.Payload;
import org.springframework.messaging.handler.annotation.SendTo;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.RestController;

import com.sintad.technicaltest.Entitys.Comentario;
import com.sintad.technicaltest.Services.ComentarioService;

@RestController
@CrossOrigin(origins = "http://localhost:4200", allowedHeaders = "*", allowCredentials = "true", methods = {
        RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS })
@RequestMapping("/comentarios")
public class ComentarioController {

    @Autowired
    private ComentarioService comentarioService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate;

    @PostMapping
    public Comentario crearComentario(@RequestBody Comentario comentario) {
        return comentarioService.crearComentario(comentario);
    }

    @GetMapping
    public List<Comentario> obtenerTodosLosComentarios() {
        return comentarioService.obtenerTodosLosComentarios();
    }

    @GetMapping("/articulo/{idArticulo}")
    public List<Comentario> obtenerComentariosPorIdArticulo(@PathVariable int idArticulo) {
        return comentarioService.obtenerComentariosPorIdArticulo(idArticulo);
    }

    @GetMapping("/{id}")
    public Comentario obtenerComentarioPorId(@PathVariable Long id) {
        return comentarioService.obtenerComentarioPorId(id);
    }

    @PutMapping("/{id}")
    public Comentario actualizarComentario(@PathVariable Long id, @RequestBody Comentario comentario) {
        return comentarioService.actualizarComentario(id, comentario);
    }

    @DeleteMapping("/{id}")
    public void eliminarComentario(@PathVariable Long id) {
        comentarioService.eliminarComentario(id);
    }

    @MessageMapping("/comentarios/{idArticulo}")
    public void manejarComentario(@Payload Comentario comentario, @DestinationVariable Long idArticulo) {
        // Asocia el comentario con el artículo correspondiente
        comentario.setArticuloId(idArticulo);

        // Llama al servicio para guardar el comentario
        comentarioService.crearComentario(comentario);

        // Envía el comentario al tema correspondiente
        messagingTemplate.convertAndSend("/topic/comentarios/" + idArticulo, comentario);
    }
}