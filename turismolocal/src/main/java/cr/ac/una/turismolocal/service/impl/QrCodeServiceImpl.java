package cr.ac.una.turismolocal.service.impl;

import cr.ac.una.turismolocal.entity.QrCode;
import cr.ac.una.turismolocal.repository.QrCodeRepository;
import cr.ac.una.turismolocal.service.QrCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class QrCodeServiceImpl implements QrCodeService {

    private final QrCodeRepository qrCodeRepository;

    @Override
    public List<QrCode> getAllQrCodes() {
        return qrCodeRepository.findAll();
    }

    @Override
    public QrCode getQrCodeById(Long id) {
        return qrCodeRepository.findById(id).orElse(null);
    }

    @Override
    public QrCode saveQrCode(QrCode qrCode) {
        return qrCodeRepository.save(qrCode);
    }

    @Override
    public void deleteQrCode(Long id) {
        qrCodeRepository.deleteById(id);
    }
}