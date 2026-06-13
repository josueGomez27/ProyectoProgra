package cr.ac.una.turismolocal;

import cr.ac.una.turismolocal.entity.PlaceImage;
import cr.ac.una.turismolocal.repository.PlaceImageRepository;
import cr.ac.una.turismolocal.service.impl.PlaceImageServiceImpl;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class PlaceImageServiceTest {

    @Mock
    private PlaceImageRepository repository;

    @InjectMocks
    private PlaceImageServiceImpl service;

    @Test
    void shouldGetAllImages() {

        PlaceImage img = new PlaceImage();

        when(repository.findAll())
                .thenReturn(List.of(img));

        assertEquals(1, service.getAllImages().size());
    }

    @Test
    void shouldGetImageById() {

        PlaceImage img = new PlaceImage();

        when(repository.findById(1L))
                .thenReturn(Optional.of(img));

        assertNotNull(service.getImageById(1L));
    }

    @Test
    void shouldSaveImage() {

        PlaceImage img = new PlaceImage();

        when(repository.save(any()))
                .thenReturn(img);

        assertNotNull(service.saveImage(img));
    }

    @Test
    void shouldDeleteImage() {

        doNothing().when(repository).deleteById(1L);

        service.deleteImage(1L);

        verify(repository).deleteById(1L);
    }
}