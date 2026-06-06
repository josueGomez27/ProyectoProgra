package cr.ac.una.turismolocal;

import cr.ac.una.turismolocal.entity.Place;
import cr.ac.una.turismolocal.repository.PlaceRepository;
import cr.ac.una.turismolocal.service.impl.PlaceServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import java.util.List;

import static org.junit.jupiter.api.Assertions.assertEquals;
import static org.mockito.Mockito.when;

public class PlaceServiceTest {

    @Test
    void getPlacesByTownShouldReturnPlacesForTown() {

        PlaceRepository repo = Mockito.mock(PlaceRepository.class);

        when(repo.findByTownId(1L))
                .thenReturn(List.of(new Place(), new Place()));

        PlaceServiceImpl service = new PlaceServiceImpl(repo);

        List<Place> places = service.getPlacesByTown(1L);

        assertEquals(2, places.size());
    }
}