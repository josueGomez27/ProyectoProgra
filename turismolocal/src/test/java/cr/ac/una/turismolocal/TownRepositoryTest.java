package cr.ac.una.turismolocal;

import cr.ac.una.turismolocal.entity.Town;
import cr.ac.una.turismolocal.repository.TownRepository;
import org.junit.jupiter.api.Test;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.boot.test.autoconfigure.orm.jpa.DataJpaTest;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;

@DataJpaTest
class TownRepositoryTest {

    @Autowired
    private TownRepository townRepository;

    @Test
    void shouldSaveTown() {

        Town town = new Town();
        town.setName("Liberia");
        town.setProvince("Guanacaste");
        town.setActive(true);

        Town saved = townRepository.save(town);

        assertNotNull(saved.getId());
        assertEquals("Liberia", saved.getName());
    }

    @Test
    void shouldFindTownById() {

        Town town = new Town();
        town.setName("Nicoya");
        town.setProvince("Guanacaste");
        town.setActive(true);

        Town saved = townRepository.save(town);

        Optional<Town> result =
                townRepository.findById(saved.getId());

        assertTrue(result.isPresent());
        assertEquals("Nicoya", result.get().getName());
    }

    @Test
    void shouldFindAllTowns() {

        Town town1 = new Town();
        town1.setName("Liberia");

        Town town2 = new Town();
        town2.setName("Santa Cruz");

        townRepository.save(town1);
        townRepository.save(town2);

        List<Town> towns = townRepository.findAll();

        assertTrue(towns.size() >= 2);
    }

    @Test
    void shouldDeleteTown() {

        Town town = new Town();
        town.setName("Bagaces");

        Town saved = townRepository.save(town);

        Long id = saved.getId();

        townRepository.deleteById(id);

        Optional<Town> result =
                townRepository.findById(id);

        assertFalse(result.isPresent());
    }
}