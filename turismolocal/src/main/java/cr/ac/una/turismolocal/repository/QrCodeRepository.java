package cr.ac.una.turismolocal.repository;

import cr.ac.una.turismolocal.entity.QrCode;
import org.springframework.data.jpa.repository.JpaRepository;

public interface QrCodeRepository extends JpaRepository<QrCode, Long> {
}