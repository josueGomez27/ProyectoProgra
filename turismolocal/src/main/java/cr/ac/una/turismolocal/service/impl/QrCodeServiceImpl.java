package cr.ac.una.turismolocal.service.impl;

import com.google.zxing.BarcodeFormat;
import com.google.zxing.WriterException;
import com.google.zxing.client.j2se.MatrixToImageWriter;
import com.google.zxing.common.BitMatrix;
import com.google.zxing.qrcode.QRCodeWriter;
import cr.ac.una.turismolocal.entity.QrCode;
import cr.ac.una.turismolocal.entity.Town;
import cr.ac.una.turismolocal.repository.QrCodeRepository;
import cr.ac.una.turismolocal.repository.TownRepository;
import cr.ac.una.turismolocal.service.QrCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.time.LocalDateTime;
import java.util.Base64;
import java.util.List;

@Service
@RequiredArgsConstructor
public class QrCodeServiceImpl implements QrCodeService {

    private final QrCodeRepository qrCodeRepository;
    private final TownRepository townRepository;

    private static final String FRONTEND_URL =
            "https://proyecto-progra-three.vercel.app";

    @Override
    public List<QrCode> getAllQrCodes() {
        return qrCodeRepository.findAll();
    }

    @Override
    public QrCode getQrCodeById(Long id) {
        return qrCodeRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("Código QR no encontrado"));
    }

    @Override
    public QrCode saveQrCode(QrCode qrCode) {
        qrCode.setCreatedAt(LocalDateTime.now());
        qrCode.setActive(true);
        return qrCodeRepository.save(qrCode);
    }

    @Override
    public void deleteQrCode(Long id) {
        qrCodeRepository.deleteById(id);
    }

    @Override
    public QrCode generateQrForTown(Long townId) {
        Town town = townRepository.findById(townId)
                .orElseThrow(() -> new RuntimeException("Pueblo no encontrado"));

        String qrValue = FRONTEND_URL + "/places/" + town.getId();
        String qrImageBase64 = generateQrBase64(qrValue);

        QrCode qrCode = QrCode.builder()
                .town(town)
                .qrValue(qrValue)
                .qrImageUrl(qrImageBase64)
                .active(true)
                .createdAt(LocalDateTime.now())
                .build();

        return qrCodeRepository.save(qrCode);
    }

    @Override
    public QrCode regenerateQrForTown(Long townId) {
        List<QrCode> existingQrCodes = qrCodeRepository.findByTownId(townId);

        for (QrCode qrCode : existingQrCodes) {
            qrCode.setActive(false);
            qrCodeRepository.save(qrCode);
        }

        return generateQrForTown(townId);
    }

    @Override
    public QrCode getActiveQrByTown(Long townId) {
        return qrCodeRepository.findByTownIdAndActiveTrue(townId)
                .orElseThrow(() -> new RuntimeException("No existe un QR activo para este pueblo"));
    }

    private String generateQrBase64(String text) {
        try {
            QRCodeWriter qrCodeWriter = new QRCodeWriter();

            BitMatrix bitMatrix = qrCodeWriter.encode(
                    text,
                    BarcodeFormat.QR_CODE,
                    300,
                    300
            );

            ByteArrayOutputStream outputStream = new ByteArrayOutputStream();
            MatrixToImageWriter.writeToStream(bitMatrix, "PNG", outputStream);

            return "data:image/png;base64," +
                    Base64.getEncoder().encodeToString(outputStream.toByteArray());

        } catch (WriterException | IOException e) {
            throw new RuntimeException("Error generando el código QR", e);
        }
    }
}