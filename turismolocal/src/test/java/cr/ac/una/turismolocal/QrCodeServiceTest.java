package cr.ac.una.turismolocal;

import cr.ac.una.turismolocal.entity.QrCode;
import cr.ac.una.turismolocal.entity.Town;
import cr.ac.una.turismolocal.repository.QrCodeRepository;
import cr.ac.una.turismolocal.repository.TownRepository;
import cr.ac.una.turismolocal.service.impl.QrCodeServiceImpl;
import org.junit.jupiter.api.BeforeEach;
import org.junit.jupiter.api.Test;
import org.junit.jupiter.api.extension.ExtendWith;
import org.mockito.InjectMocks;
import org.mockito.Mock;
import org.mockito.junit.jupiter.MockitoExtension;

import java.util.List;
import java.util.Optional;

import static org.junit.jupiter.api.Assertions.*;
import static org.mockito.ArgumentMatchers.any;
import static org.mockito.Mockito.*;

@ExtendWith(MockitoExtension.class)
class QrCodeServiceTest {

    @Mock
    private QrCodeRepository qrCodeRepository;

    @Mock
    private TownRepository townRepository;

    @InjectMocks
    private QrCodeServiceImpl qrCodeService;

    private Town town;
    private QrCode qrCode;

    @BeforeEach
    void setUp() {

        town = new Town();
        town.setId(1L);
        town.setName("Liberia");

        qrCode = new QrCode();
        qrCode.setId(1L);
        qrCode.setTown(town);
        qrCode.setActive(true);
    }

    @Test
    void shouldReturnAllQrCodes() {

        when(qrCodeRepository.findAll())
                .thenReturn(List.of(qrCode));

        List<QrCode> result =
                qrCodeService.getAllQrCodes();

        assertEquals(1, result.size());
    }

    @Test
    void shouldReturnQrCodeById() {

        when(qrCodeRepository.findById(1L))
                .thenReturn(Optional.of(qrCode));

        QrCode result =
                qrCodeService.getQrCodeById(1L);

        assertNotNull(result);
    }

    @Test
    void shouldThrowWhenQrCodeNotFound() {

        when(qrCodeRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> qrCodeService.getQrCodeById(99L)
        );
    }

    @Test
    void shouldSaveQrCode() {

        when(qrCodeRepository.save(any(QrCode.class)))
                .thenAnswer(i -> i.getArgument(0));

        QrCode result =
                qrCodeService.saveQrCode(new QrCode());

        assertTrue(result.getActive());
        assertNotNull(result.getCreatedAt());
    }

    @Test
    void shouldDeleteQrCode() {

        doNothing().when(qrCodeRepository)
                .deleteById(1L);

        qrCodeService.deleteQrCode(1L);

        verify(qrCodeRepository)
                .deleteById(1L);
    }

    @Test
    void shouldGenerateQrForTown() {

        when(townRepository.findById(1L))
                .thenReturn(Optional.of(town));

        when(qrCodeRepository.save(any(QrCode.class)))
                .thenAnswer(i -> i.getArgument(0));

        QrCode result =
                qrCodeService.generateQrForTown(1L);

        assertNotNull(result);
        assertEquals(town, result.getTown());
        assertTrue(result.getActive());
        assertNotNull(result.getQrValue());
        assertNotNull(result.getQrImageUrl());
    }

    @Test
    void shouldThrowWhenTownDoesNotExist() {

        when(townRepository.findById(99L))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> qrCodeService.generateQrForTown(99L)
        );
    }

    @Test
    void shouldReturnActiveQrByTown() {

        when(qrCodeRepository.findByTownIdAndActiveTrue(1L))
                .thenReturn(Optional.of(qrCode));

        QrCode result =
                qrCodeService.getActiveQrByTown(1L);

        assertNotNull(result);
    }

    @Test
    void shouldThrowWhenNoActiveQrExists() {

        when(qrCodeRepository.findByTownIdAndActiveTrue(1L))
                .thenReturn(Optional.empty());

        assertThrows(
                RuntimeException.class,
                () -> qrCodeService.getActiveQrByTown(1L)
        );
    }

    @Test
    void shouldRegenerateQrForTown() {

        when(qrCodeRepository.findByTownId(1L))
                .thenReturn(List.of(qrCode));

        when(townRepository.findById(1L))
                .thenReturn(Optional.of(town));

        when(qrCodeRepository.save(any(QrCode.class)))
                .thenAnswer(i -> i.getArgument(0));

        QrCode result =
                qrCodeService.regenerateQrForTown(1L);

        assertNotNull(result);

        verify(qrCodeRepository, atLeastOnce())
                .save(any(QrCode.class));
    }
}