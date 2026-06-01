package cr.ac.una.turismolocal.service;

import cr.ac.una.turismolocal.entity.Place;

import java.util.List;

public interface PlaceService {

    List<Place> getAllPlaces();

    Place getPlaceById(Long id);

    List<Place> getPlacesByTown(Long townId);

    Place savePlace(Place place);

    Place updatePlace(Long id, Place place);

    void deletePlace(Long id);
}