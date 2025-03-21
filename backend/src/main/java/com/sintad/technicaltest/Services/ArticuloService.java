package com.sintad.technicaltest.Services;

import java.util.List;
import java.util.Optional;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.cache.annotation.Cacheable;
import org.springframework.stereotype.Service;

import com.sintad.technicaltest.Entitys.Articulo;
import com.sintad.technicaltest.Exceptions.ArticleNotFoundException;
import com.sintad.technicaltest.Exceptions.InvalidArticleDataException;
import com.sintad.technicaltest.Repositories.ArticuloRepository;

@Service
public class ArticuloService {

    @Autowired
    private ArticuloRepository articuloRepository;

    public Articulo crearArticulo(Articulo articulo) {
        if (articulo.getTitulo() == null || articulo.getTitulo().isEmpty()) {
            throw new InvalidArticleDataException("El título del artículo no puede estar vacío.");
        }

        return articuloRepository.save(articulo);
    }

    public List<Articulo> obtenerTodosLosArticulos() {
        return articuloRepository.findAll();
    }

    public Articulo obtenerArticuloPorId(Long id) {
        Optional<Articulo> articulo = articuloRepository.findById(id);

        if (articulo.isEmpty()) {
            throw new ArticleNotFoundException("Artículo no encontrado con ID: " + id);
        }

        return articulo.get();
    }

    public Articulo actualizarArticulo(Long id, Articulo articulo) {
        Articulo articuloExistente = articuloRepository.findById(id).orElse(null);
        if (articuloExistente != null) {
            articulo.setId(id);
            return articuloRepository.save(articulo);
        }
        return null;
    }

    public void eliminarArticulo(Long id) {
        articuloRepository.deleteById(id);
    }

    @Cacheable(value = "popularArticles")
    public List<Articulo> getPopularArticles() {
        // Lógica para obtener los artículos populares (por ejemplo, ordenar por número de visitas)
        List<Articulo> popularArticles = articuloRepository.findAllByOrderByViewsDesc();
        //Lógica para solo regresar los 10 primeros.
        if (popularArticles.size() > 10){
            popularArticles = popularArticles.subList(0, 10);
        }
        return popularArticles;
    }

    public Articulo findById(Long id) {
        return articuloRepository.findById(id)
                .orElseThrow(() -> new ArticleNotFoundException("Artículo no encontrado con ID: " + id));
    }

    public void save(Articulo articulo) {
        articuloRepository.save(articulo);
    }
}