package cr.ac.una.turismolocal;

import cr.ac.una.turismolocal.entity.Town;
import cr.ac.una.turismolocal.repository.TownRepository;
import cr.ac.una.turismolocal.service.impl.TownServiceImpl;
import org.junit.jupiter.api.Test;
import org.mockito.Mockito;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.when;

public class TownServiceTest {

    @Test
    void saveTownShouldSetActiveTrueWhenNull() {

        TownRepository repo = Mockito.mock(TownRepository.class);

        when(repo.save(Mockito.any(Town.class)))
                .thenAnswer(invocation -> invocation.getArgument(0));

        TownServiceImpl service = new TownServiceImpl(repo);

        Town town = new Town();
        town.setName("Liberia");
        town.setActive(null);

        Town saved = service.saveTown(town);

        assertTrue(saved.getActive());
    }
}