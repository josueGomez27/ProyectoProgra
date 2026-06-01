package cr.ac.una.turismolocal.entity;

import com.fasterxml.jackson.annotation.JsonManagedReference;
import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;
import java.util.List;

@Entity
@Table(name = "categories")
@Getter
@Setter
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Category {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    private String name;

    private String color;

    private Boolean active;

    private LocalDateTime createdAt;

    @JsonManagedReference(value = "category-places")
    @OneToMany(mappedBy = "category")
    private List<Place> places;
}