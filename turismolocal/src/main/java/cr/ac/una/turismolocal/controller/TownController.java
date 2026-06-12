package cr.ac.una.turismolocal.controller;

import cr.ac.una.turismolocal.entity.Town;
import cr.ac.una.turismolocal.service.TownService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/towns")
@RequiredArgsConstructor
public class TownController {

    private final TownService townService;

    @GetMapping
    public List<Town> getAllTowns() {
        return townService.getAllTowns();
    }

    @GetMapping("/{id}")
    public Town getTownById(@PathVariable Long id) {
        return townService.getTownById(id);
    }

    @PostMapping
    public Town saveTown(@RequestBody Town town) {

        if (town.getCreatedBy() == null) {
            town.setCreatedBy("Sistema");
        }

        return townService.saveTown(town);
    }

    @PutMapping("/{id}")
    public Town updateTown(@PathVariable Long id, @RequestBody Town town) {

        Town existingTown = townService.getTownById(id);

        if (existingTown != null) {

            // Mantener el autor original si no viene uno nuevo
            town.setCreatedBy(
                    town.getCreatedBy() != null
                            ? town.getCreatedBy()
                            : existingTown.getCreatedBy()
            );
        }

        return townService.updateTown(id, town);
    }

    @DeleteMapping("/{id}")
    public void deleteTown(@PathVariable Long id) {
        townService.deleteTown(id);
    }
}