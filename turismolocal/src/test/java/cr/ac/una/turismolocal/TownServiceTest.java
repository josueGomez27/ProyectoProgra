package cr.ac.una.turismolocal;

import cr.ac.una.turismolocal.entity.Town;
import cr.ac.una.turismolocal.repository.TownRepository;
import cr.ac.una.turismolocal.service.impl.TownServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.Arrays;
import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class TownServiceTest {

    @Mock
    private TownRepository townRepository;

    @InjectMocks
    private TownServiceImpl townService;

    private Town town;

    @BeforeEach
    void setUp() {
        town = new Town();
        town.setId(1L);
        town.setName("Liberia");
        town.setActive(true);
    }

    @Test
    void shouldReturnAllTowns() {

        when(townRepository.findAll())
                .thenReturn(Arrays.asList(town));

        List<Town> result = townService.getAllTowns();

        assertEquals(1, result.size());
        assertEquals("Liberia", result.get(0).getName());

        verify(townRepository, times(1)).findAll();
    }

    @Test
    void shouldReturnTownById() {

        when(townRepository.findById(1L))
                .thenReturn(Optional.of(town));

        Town result = townService.getTownById(1L);

        assertNotNull(result);
        assertEquals("Liberia", result.getName());

        verify(townRepository).findById(1L);
    }

    @Test
    void shouldReturnNullWhenTownNotFound() {

        when(townRepository.findById(99L))
                .thenReturn(Optional.empty());

        Town result = townService.getTownById(99L);

        assertNull(result);
    }

    @Test
    void shouldSaveTown() {

        when(townRepository.save(any(Town.class)))
                .thenReturn(town);

        Town result = townService.saveTown(town);

        assertNotNull(result);
        assertEquals("Liberia", result.getName());

        verify(townRepository).save(any(Town.class));
    }

    @Test
    void shouldUpdateTown() {

        Town updatedTown = new Town();
        updatedTown.setName("Nicoya");
        updatedTown.setActive(true);

        when(townRepository.findById(1L))
                .thenReturn(Optional.of(town));

        when(townRepository.save(any(Town.class)))
                .thenAnswer(i -> i.getArgument(0));

        Town result = townService.updateTown(1L, updatedTown);

        assertNotNull(result);
        assertEquals("Nicoya", result.getName());

        verify(townRepository).findById(1L);
        verify(townRepository).save(any(Town.class));
    }

    @Test
    void shouldReturnNullWhenUpdatingNonExistingTown() {

        when(townRepository.findById(99L))
                .thenReturn(Optional.empty());

        Town result = townService.updateTown(99L, town);

        assertNull(result);
    }

    @Test
    void shouldDeleteTown() {

        doNothing().when(townRepository).deleteById(1L);

        townService.deleteTown(1L);

        verify(townRepository).deleteById(1L);
    }
}