package cr.ac.una.turismolocal.repository;

import cr.ac.una.turismolocal.entity.Place;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;

public interface PlaceRepository extends JpaRepository<Place, Long> {

    List<Place> findByTownId(Long townId);

}