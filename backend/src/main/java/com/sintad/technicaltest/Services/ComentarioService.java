package com.sintad.technicaltest.Services;

import java.util.List;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import com.sintad.technicaltest.Entitys.Comentario;
import com.sintad.technicaltest.Repositories.ComentarioRepository;

@Service
public class ComentarioService {

    @Autowired
    private ComentarioRepository comentarioRepository;

    public Comentario crearComentario(Comentario comentario) {
        return comentarioRepository.save(comentario);
    }

    public List<Comentario> obtenerTodosLosComentarios() {
        return comentarioRepository.findAll();
    }

    public Comentario obtenerComentarioPorId(Long id) {
        return comentarioRepository.findById(id).orElse(null);
    }

    public Comentario actualizarComentario(Long id, Comentario comentario) {
        Comentario comentarioExistente = comentarioRepository.findById(id).orElse(null);
        if (comentarioExistente != null) {
            comentario.setId(id);
            return comentarioRepository.save(comentario);
        }
        return null;
    }

    public void eliminarComentario(Long id) {
        comentarioRepository.deleteById(id);
    }

    public List<Comentario> obtenerComentariosPorIdArticulo(int idArticulo) {
        return comentarioRepository.findAllByArticuloId(idArticulo);
    }
}