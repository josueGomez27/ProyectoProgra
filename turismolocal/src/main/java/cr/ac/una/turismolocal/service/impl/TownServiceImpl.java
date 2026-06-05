package cr.ac.una.turismolocal.service.impl;

import cr.ac.una.turismolocal.entity.Town;
import cr.ac.una.turismolocal.repository.TownRepository;
import cr.ac.una.turismolocal.service.TownService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class TownServiceImpl implements TownService {

    private final TownRepository townRepository;

    @Override
    public List<Town> getAllTowns() {
        return townRepository.findAll();
    }

    @Override
    public Town getTownById(Long id) {
        return townRepository.findById(id).orElse(null);
    }

    @Override
    public Town saveTown(Town town) {
        return townRepository.save(town);
    }

    @Override
    public Town updateTown(Long id, Town town) {

        Town existingTown = townRepository.findById(id).orElse(null);

        if (existingTown != null) {
            existingTown.setName(town.getName());
            existingTown.setDescription(town.getDescription());
            existingTown.setProvince(town.getProvince());
            existingTown.setCanton(town.getCanton());
            existingTown.setDistrict(town.getDistrict());

            // NUEVO
            existingTown.setImageUrl(town.getImageUrl());

            return townRepository.save(existingTown);
        }

        return null;
    }

    @Override
    public void deleteTown(Long id) {
        townRepository.deleteById(id);
    }
}