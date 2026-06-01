package cr.ac.una.turismolocal.service;

import cr.ac.una.turismolocal.entity.QrCode;
import java.util.List;

public interface QrCodeService {
    List<QrCode> getAllQrCodes();
    QrCode getQrCodeById(Long id);
    QrCode saveQrCode(QrCode qrCode);
    void deleteQrCode(Long id);
}