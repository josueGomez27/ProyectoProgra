package cr.ac.una.turismolocal.service.impl;

import cr.ac.una.turismolocal.entity.PlaceImage;
import cr.ac.una.turismolocal.repository.PlaceImageRepository;
import cr.ac.una.turismolocal.service.PlaceImageService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class PlaceImageServiceImpl implements PlaceImageService {

    private final PlaceImageRepository placeImageRepository;

    @Override
    public List<PlaceImage> getAllImages() {
        return placeImageRepository.findAll();
    }

    @Override
    public PlaceImage getImageById(Long id) {
        return placeImageRepository.findById(id).orElse(null);
    }

    @Override
    public PlaceImage saveImage(PlaceImage image) {
        return placeImageRepository.save(image);
    }

    @Override
    public void deleteImage(Long id) {
        placeImageRepository.deleteById(id);
    }
}