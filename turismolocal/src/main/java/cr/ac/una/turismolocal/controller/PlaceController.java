package cr.ac.una.turismolocal.controller;

import cr.ac.una.turismolocal.entity.*;
import cr.ac.una.turismolocal.repository.*;
import cr.ac.una.turismolocal.service.PlaceService;
import lombok.Data;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;
import java.util.List;

@RestController
@RequestMapping("/api/places")
@RequiredArgsConstructor
@CrossOrigin(origins = "*")
public class PlaceController {

    private final PlaceService placeService;
    private final TownRepository townRepository;
    private final CategoryRepository categoryRepository;
    // DTO utilizado para recibir los datos enviados desde el frontend
    @Data
    public static class PlaceInputDTO {
        private String name;
        private String description;
        private String address;
        private String imageUrl;
        private Boolean active;
        private Long townId;
        private Long categoryId;
        private Double latitude;
        private Double longitude;
        // Campo utilizado para registrar quién creó el lugar
        private String createdBy;
    }
    // Obtiene todos los lugares registrados
    @GetMapping
    public List<Place> getAllPlaces() {
        return placeService.getAllPlaces();
    }
    // Busca un lugar por su id
    @GetMapping("/{id}")
    public Place getPlaceById(@PathVariable Long id) {
        return placeService.getPlaceById(id);
    }
    // Obtiene los lugares asociados a un pueblo específico
    @GetMapping("/town/{townId}")
    public List<Place> getPlacesByTown(@PathVariable Long townId) {
        return placeService.getPlacesByTown(townId);
    }

    @PostMapping
    public Place savePlace(@RequestBody PlaceInputDTO input) {

        System.out.println("========== NUEVO PLACE ==========");
        System.out.println("NAME = " + input.getName());
        System.out.println("TOWN ID = " + input.getTownId());
        System.out.println("CATEGORY ID = " + input.getCategoryId());
        System.out.println("LATITUDE = " + input.getLatitude());
        System.out.println("LONGITUDE = " + input.getLongitude());
        System.out.println("=================================");

    // Se crea un nuevo objeto Place con la información recibida
        Place p = new Place();
        p.setName(input.getName());
        p.setDescription(input.getDescription());
        p.setAddress(input.getAddress());
        p.setImageUrl(input.getImageUrl());
        p.setLatitude(input.getLatitude());
        p.setLongitude(input.getLongitude());
        p.setActive(input.getActive() != null ? input.getActive() : true);
        // Auditoría: guarda el usuario que creó el registro
        p.setCreatedBy(input.getCreatedBy());
    // Si viene un townId, se busca el pueblo y se asocia al lugar
        if (input.getTownId() != null) {
            p.setTown(townRepository.findById(input.getTownId()).orElse(null));
        }
    // Si viene un categoryId, se busca la categoría y se asocia al lugar
        if (input.getCategoryId() != null) {
            p.setCategory(categoryRepository.findById(input.getCategoryId()).orElse(null));
        }
    // Se guarda el lugar usando el servicio
        Place saved = placeService.savePlace(p);

        System.out.println("===== GUARDADO =====");
        System.out.println("ID = " + saved.getId());
        System.out.println("LAT = " + saved.getLatitude());
        System.out.println("LON = " + saved.getLongitude());
        System.out.println("====================");

        return saved;
    }
    // Actualiza un lugar turístico existente
    @PutMapping("/{id}")
    public Place updatePlace(@PathVariable Long id, @RequestBody PlaceInputDTO input) {
        //  se busca el lugar existente en la base de datos
        Place existingPlace = placeService.getPlaceById(id);

        if (existingPlace != null) {

            System.out.println("===== UPDATE PLACE =====");
            System.out.println("LAT = " + input.getLatitude());
            System.out.println("LON = " + input.getLongitude());

            existingPlace.setName(input.getName());
            existingPlace.setDescription(input.getDescription());
            existingPlace.setAddress(input.getAddress());
            existingPlace.setImageUrl(input.getImageUrl());
            existingPlace.setLatitude(input.getLatitude());
            existingPlace.setLongitude(input.getLongitude());
            // Si viene un estado nuevo se usa, si no entoncesse mantiene el estado actual
            existingPlace.setActive(
                    input.getActive() != null
                            ? input.getActive()
                            : existingPlace.getActive()
            );
            // Auditoría: mantiene el autor original si no viene uno nuevo
            existingPlace.setCreatedBy(
                    input.getCreatedBy() != null
                            ? input.getCreatedBy()
                            : existingPlace.getCreatedBy()
            );
            // Actualiza el pueblo asociado si viene un townId
            if (input.getTownId() != null) {
                existingPlace.setTown(
                        townRepository.findById(input.getTownId()).orElse(null)
                );
            }
            // Actualiza la categoría asociada si viene un categoryId
            if (input.getCategoryId() != null) {
                existingPlace.setCategory(
                        categoryRepository.findById(input.getCategoryId()).orElse(null)
                );
            }

            return placeService.updatePlace(id, existingPlace);
        }

        return null;
    }

    @DeleteMapping("/{id}")
    public void deletePlace(@PathVariable Long id) {
        placeService.deletePlace(id);
    }
}