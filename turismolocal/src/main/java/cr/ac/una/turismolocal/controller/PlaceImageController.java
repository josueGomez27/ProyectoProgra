package cr.ac.una.turismolocal.controller;

import cr.ac.una.turismolocal.entity.PlaceImage;
import cr.ac.una.turismolocal.service.PlaceImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/place-images")
@RequiredArgsConstructor
public class PlaceImageController {

    private final PlaceImageService placeImageService;

    @GetMapping
    public List<PlaceImage> getAllImages() {
        return placeImageService.getAllImages();
    }

    @GetMapping("/{id}")
    public PlaceImage getImageById(@PathVariable Long id) {
        return placeImageService.getImageById(id);
    }

    @PostMapping
    public PlaceImage saveImage(@RequestBody PlaceImage image) {
        return placeImageService.saveImage(image);
    }

    @DeleteMapping("/{id}")
    public void deleteImage(@PathVariable Long id) {
        placeImageService.deleteImage(id);
    }
}