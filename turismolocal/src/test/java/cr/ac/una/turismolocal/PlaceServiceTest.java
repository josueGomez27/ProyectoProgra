package cr.ac.una.turismolocal;

import cr.ac.una.turismolocal.entity.Place;
import cr.ac.una.turismolocal.repository.PlaceRepository;
import cr.ac.una.turismolocal.service.impl.PlaceServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlaceServiceTest {

    @Mock
    private PlaceRepository placeRepository;

    @InjectMocks
    private PlaceServiceImpl placeService;

    private Place place;

    @BeforeEach
    void setUp() {
        place = new Place();
        place.setId(1L);
        place.setName("Parque Nacional");
        place.setLatitude(10.5);
        place.setLongitude(-85.4);
        place.setActive(true);
    }

    @Test
    void shouldReturnAllPlaces() {

        when(placeRepository.findAll())
                .thenReturn(List.of(place));

        List<Place> result = placeService.getAllPlaces();

        assertEquals(1, result.size());
    }

    @Test
    void shouldReturnPlaceById() {

        when(placeRepository.findById(1L))
                .thenReturn(Optional.of(place));

        Place result = placeService.getPlaceById(1L);

        assertNotNull(result);
        assertEquals("Parque Nacional", result.getName());
    }

    @Test
    void shouldReturnPlacesByTown() {

        when(placeRepository.findByTownId(1L))
                .thenReturn(List.of(place));

        List<Place> result =
                placeService.getPlacesByTown(1L);

        assertEquals(1, result.size());
    }

    @Test
    void shouldSavePlace() {

        when(placeRepository.save(any(Place.class)))
                .thenReturn(place);

        Place result = placeService.savePlace(place);

        assertNotNull(result);

        verify(placeRepository).save(any(Place.class));
        verify(placeRepository).flush();
    }

    @Test
    void shouldUpdatePlace() {

        when(placeRepository.save(any(Place.class)))
                .thenReturn(place);

        Place result =
                placeService.updatePlace(1L, place);

        assertNotNull(result);

        verify(placeRepository).save(any(Place.class));
        verify(placeRepository).flush();
    }

    @Test
    void shouldDeletePlace() {

        doNothing().when(placeRepository).deleteById(1L);

        placeService.deletePlace(1L);

        verify(placeRepository).deleteById(1L);
    }
}