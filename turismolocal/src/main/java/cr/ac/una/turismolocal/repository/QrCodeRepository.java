package cr.ac.una.turismolocal.repository;

import cr.ac.una.turismolocal.entity.QrCode;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface QrCodeRepository extends JpaRepository<QrCode, Long> {

    List<QrCode> findByTownId(Long townId);

    Optional<QrCode> findByTownIdAndActiveTrue(Long townId);
}