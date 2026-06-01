package cr.ac.una.turismolocal.service;

import cr.ac.una.turismolocal.entity.Town;
import java.util.List;

public interface TownService {

    List<Town> getAllTowns();

    Town getTownById(Long id);

    Town saveTown(Town town);

    Town updateTown(Long id, Town town);

    void deleteTown(Long id);
}