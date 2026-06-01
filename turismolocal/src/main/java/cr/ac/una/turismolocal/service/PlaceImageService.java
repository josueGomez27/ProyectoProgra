package cr.ac.una.turismolocal.service;

import cr.ac.una.turismolocal.entity.PlaceImage;
import java.util.List;

public interface PlaceImageService {
    List<PlaceImage> getAllImages();
    PlaceImage getImageById(Long id);
    PlaceImage saveImage(PlaceImage image);
    void deleteImage(Long id);
}