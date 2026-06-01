package cr.ac.una.turismolocal.controller;

import cr.ac.una.turismolocal.entity.QrCode;
import cr.ac.una.turismolocal.service.QrCodeService;
import lombok.RequiredArgsConstructor;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/qrcodes")
@RequiredArgsConstructor
public class QrCodeController {

    private final QrCodeService qrCodeService;

    @GetMapping
    public List<QrCode> getAllQrCodes() {
        return qrCodeService.getAllQrCodes();
    }

    @GetMapping("/{id}")
    public QrCode getQrCodeById(@PathVariable Long id) {
        return qrCodeService.getQrCodeById(id);
    }

    @PostMapping
    public QrCode saveQrCode(@RequestBody QrCode qrCode) {
        return qrCodeService.saveQrCode(qrCode);
    }

    @DeleteMapping("/{id}")
    public void deleteQrCode(@PathVariable Long id) {
        qrCodeService.deleteQrCode(id);
    }
}