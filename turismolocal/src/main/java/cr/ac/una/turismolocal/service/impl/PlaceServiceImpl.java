package cr.ac.una.turismolocal.service.impl;

import cr.ac.una.turismolocal.entity.Place;
import cr.ac.una.turismolocal.repository.PlaceRepository;
import cr.ac.una.turismolocal.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaceServiceImpl implements PlaceService {

    private final PlaceRepository placeRepository;

    @Override
    public List<Place> getAllPlaces() {
        return placeRepository.findAll();
    }

    @Override
    public Place getPlaceById(Long id) {
        return placeRepository.findById(id).orElse(null);
    }

    @Override
    public List<Place> getPlacesByTown(Long townId) {
        return placeRepository.findByTownId(townId);
    }

    @Override
    public Place savePlace(Place place) {
        return placeRepository.save(place);
    }

    @Override
    public Place updatePlace(Long id, Place place) {

        Place existingPlace = placeRepository.findById(id).orElse(null);

        if (existingPlace != null) {
            existingPlace.setName(place.getName());
            existingPlace.setDescription(place.getDescription());
            existingPlace.setAddress(place.getAddress());
            existingPlace.setImageUrl(place.getImageUrl());

            return placeRepository.save(existingPlace);
        }

        return null;
    }

    @Override
    public void deletePlace(Long id) {
        placeRepository.deleteById(id);
    }
}