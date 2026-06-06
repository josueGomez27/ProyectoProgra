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
    }
//hola bro
    @GetMapping
    public List<Place> getAllPlaces() {
        return placeService.getAllPlaces();
    }

    @GetMapping("/{id}")
    public Place getPlaceById(@PathVariable Long id) {
        return placeService.getPlaceById(id);
    }

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

        Place p = new Place();
        p.setName(input.getName());
        p.setDescription(input.getDescription());
        p.setAddress(input.getAddress());
        p.setImageUrl(input.getImageUrl());
        p.setLatitude(input.getLatitude());
        p.setLongitude(input.getLongitude());
        p.setActive(input.getActive() != null ? input.getActive() : true);

        if (input.getTownId() != null) {
            p.setTown(townRepository.findById(input.getTownId()).orElse(null));
        }

        if (input.getCategoryId() != null) {
            p.setCategory(categoryRepository.findById(input.getCategoryId()).orElse(null));
        }

        Place saved = placeService.savePlace(p);

        System.out.println("===== GUARDADO =====");
        System.out.println("ID = " + saved.getId());
        System.out.println("LAT = " + saved.getLatitude());
        System.out.println("LON = " + saved.getLongitude());
        System.out.println("====================");

        return saved;
    }

    @PutMapping("/{id}")
    public Place updatePlace(@PathVariable Long id, @RequestBody PlaceInputDTO input) {
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
            existingPlace.setActive(
                    input.getActive() != null
                            ? input.getActive()
                            : existingPlace.getActive()
            );

            if (input.getTownId() != null) {
                existingPlace.setTown(
                        townRepository.findById(input.getTownId()).orElse(null)
                );
            }

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