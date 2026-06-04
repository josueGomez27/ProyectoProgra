package cr.ac.una.turismolocal.service.impl;

import cr.ac.una.turismolocal.entity.Place;
import cr.ac.una.turismolocal.repository.PlaceRepository;
import cr.ac.una.turismolocal.service.PlaceService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;
import java.util.List;

@Service
@RequiredArgsConstructor

public class PlaceServiceImpl implements PlaceService {

    private final PlaceRepository placeRepository;



    @Override
    public List<Place> getAllPlaces() { return placeRepository.findAll(); }

    @Override
    public Place getPlaceById(Long id) { return placeRepository.findById(id).orElse(null); }

    @Override
    public List<Place> getPlacesByTown(Long townId) { return placeRepository.findByTownId(townId); }

    @Override
    @Transactional
    public Place savePlace(Place place) {
        Place saved = placeRepository.save(place);
        placeRepository.flush();
        return saved;
    }

    @Override
    @Transactional
    public Place updatePlace(Long id, Place place) {
        Place saved = placeRepository.save(place);
        placeRepository.flush();
        return saved;
    }

    @Override
    @Transactional
    public void deletePlace(Long id) { placeRepository.deleteById(id); }
}
