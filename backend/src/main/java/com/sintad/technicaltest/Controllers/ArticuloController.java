package com.sintad.technicaltest.Controllers;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.messaging.simp.SimpMessagingTemplate;
import org.springframework.web.bind.annotation.CrossOrigin;
import org.springframework.web.bind.annotation.DeleteMapping;
import org.springframework.web.bind.annotation.RequestMethod;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.PathVariable;
import org.springframework.web.bind.annotation.PostMapping;
import org.springframework.web.bind.annotation.PutMapping;
import org.springframework.web.bind.annotation.RequestBody;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import com.sintad.technicaltest.Entitys.Articulo;
import com.sintad.technicaltest.Services.ArticuloService;

import io.swagger.v3.oas.annotations.Operation;
import io.swagger.v3.oas.annotations.responses.ApiResponse;

@RestController
@CrossOrigin(
    origins = "http://localhost:4200",
    allowedHeaders = "*",
    allowCredentials = "true",
    methods = {RequestMethod.GET, RequestMethod.POST, RequestMethod.PUT, RequestMethod.DELETE, RequestMethod.OPTIONS}
)
@RequestMapping("/articulos")
public class ArticuloController {

    @Autowired
    private ArticuloService articuloService;

    @Autowired
    private SimpMessagingTemplate messagingTemplate; // Para enviar mensajes a través de WebSocket

    @Operation(summary = "Crear un nuevo artículo", description = "Este endpoint permite crear un nuevo artículo.")
    @ApiResponse(responseCode = "201", description = "Artículo creado exitosamente")
    @ApiResponse(responseCode = "400", description = "Datos inválidos")
    @PostMapping
    public ResponseEntity<?> crearArticulo(@RequestBody Articulo articulo) {
        try {
            Articulo nuevoArticulo = articuloService.crearArticulo(articulo);

            // Notificar a los clientes suscritos al tema sobre el nuevo artículo
            messagingTemplate.convertAndSend("/topic/articulos/nuevo", nuevoArticulo);

            return ResponseEntity.status(HttpStatus.CREATED).body(nuevoArticulo);
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.BAD_REQUEST).body("Error al crear el artículo: " + e.getMessage());
        }
    }

    @Operation(summary = "Obtener todos los artículos", description = "Este endpoint devuelve una lista de todos los artículos.")
    @ApiResponse(responseCode = "200", description = "Lista de artículos obtenida exitosamente")
    @GetMapping
    public ResponseEntity<?> obtenerTodosLosArticulos() {
        List<Articulo> articulos = articuloService.obtenerTodosLosArticulos();
        return ResponseEntity.ok(articulos);
    }

    @Operation(summary = "Incrementar vistas de un artículo", description = "Este endpoint incrementa el contador de vistas de un artículo.")
    @ApiResponse(responseCode = "200", description = "Vistas incrementadas exitosamente")
    @ApiResponse(responseCode = "404", description = "Artículo no encontrado")
    @PostMapping("/{id}/incrementar-vistas")
    public ResponseEntity<?> incrementarVistas(@PathVariable Long id) {
        Articulo articulo = articuloService.findById(id);
        if (articulo != null) {
            articulo.setViews(articulo.getViews() + 1);
            articuloService.save(articulo);

            // Notificar a los clientes suscritos al tema sobre el incremento de vistas
            messagingTemplate.convertAndSend("/topic/articulos/vistas", id);

            return ResponseEntity.ok("Vistas incrementadas exitosamente.");
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Artículo no encontrado.");
        }
    }

    @Operation(summary = "Obtener un artículo por ID", description = "Este endpoint devuelve un artículo específico por su ID.")
    @ApiResponse(responseCode = "200", description = "Artículo encontrado")
    @ApiResponse(responseCode = "404", description = "Artículo no encontrado")
    @GetMapping("/{id}")
    public ResponseEntity<?> obtenerArticuloPorId(@PathVariable Long id) {
        Articulo articulo = articuloService.obtenerArticuloPorId(id);
        if (articulo != null) {
            return ResponseEntity.ok(articulo);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Artículo no encontrado.");
        }
    }

    @Operation(summary = "Actualizar un artículo", description = "Este endpoint permite actualizar un artículo existente.")
    @ApiResponse(responseCode = "200", description = "Artículo actualizado exitosamente")
    @ApiResponse(responseCode = "404", description = "Artículo no encontrado")
    @PutMapping("/{id}")
    public ResponseEntity<?> actualizarArticulo(@PathVariable Long id, @RequestBody Articulo articulo) {
        Articulo articuloActualizado = articuloService.actualizarArticulo(id, articulo);
        if (articuloActualizado != null) {
            return ResponseEntity.ok(articuloActualizado);
        } else {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Artículo no encontrado.");
        }
    }

    @Operation(summary = "Eliminar un artículo", description = "Este endpoint permite eliminar un artículo por su ID.")
    @ApiResponse(responseCode = "200", description = "Artículo eliminado exitosamente")
    @ApiResponse(responseCode = "404", description = "Artículo no encontrado")
    @DeleteMapping("/{id}")
    public ResponseEntity<?> eliminarArticulo(@PathVariable Long id) {
        try {
            articuloService.eliminarArticulo(id);
            return ResponseEntity.ok("Artículo eliminado exitosamente.");
        } catch (Exception e) {
            return ResponseEntity.status(HttpStatus.NOT_FOUND).body("Artículo no encontrado.");
        }
    }
}