package cr.ac.una.turismolocal.controller;

import cr.ac.una.turismolocal.entity.Town;
import cr.ac.una.turismolocal.service.TownService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/towns")
@RequiredArgsConstructor

@CrossOrigin(origins = "http://localhost:5173")
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
        return townService.saveTown(town);
    }

    @PutMapping("/{id}")
    public Town updateTown(@PathVariable Long id, @RequestBody Town town) {
        return townService.updateTown(id, town);
    }

    @DeleteMapping("/{id}")
    public void deleteTown(@PathVariable Long id) {
        townService.deleteTown(id);
    }
}